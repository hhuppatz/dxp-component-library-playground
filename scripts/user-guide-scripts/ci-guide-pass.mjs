// scripts/user-guide-scripts/ci-guide-pass.mjs
//
// The CI "once-over". The deterministic build (render-guides.mjs) has already written
// docs/<component>/user-guide.html with the real main render, field tables and a variants
// placeholder. This pass asks a model for the ONLY two things it owns:
//   1. VARIANTS  — a label + which real fields to set/unset (from the field catalogue); functions
//                  apply those to the real example data and render them. The model never writes markup.
//   2. PROSE     — editor-friendly rewrites of the overview / per-field descriptions / tips, written
//                  back into the data-ucx-prose slots.
// Both are persisted in the page; a later render pass re-renders the variants and keeps the prose.
//
// Run in CI (needs ANTHROPIC_API_KEY). For a no-token local dry run, set MODELS_MOCK=1 to use a
// deterministic stub proposal instead of calling the model. Honours COMPONENT (name/list/all).

import { register } from "node:module";
register("../dxp-root-loader.mjs", import.meta.url);

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  installStableRandom,
  restoreRandom,
  loadComponent,
  listComponents,
  findExampleData,
  renderComponent,
} from "./component-render.mjs";
import {
  flattenFields,
  readCompiledCss,
  readComponentScripts,
  processDocument,
  esc,
  extractProseSlots,
  overlayProse,
  renderMarker,
  variantCell,
  variantGrid,
  visualSignature,
} from "./guide-ui.mjs";
import { chat, extractJson, hasToken } from "./models.mjs";

const ROOT = process.cwd();
const DOCS_DIR = path.resolve(ROOT, "docs");
const MAX_VARIANTS = 6;

// ── Path get/set/unset on the example data (supports dotted keys + [index]) ──────────────────────
function parsePath(p) {
  const parts = [];
  for (const seg of String(p).split(".")) {
    const re = /([^[\].]+)|\[(\d+)\]/g;
    let m;
    while ((m = re.exec(seg))) parts.push(m[2] !== undefined ? Number(m[2]) : m[1]);
  }
  return parts;
}
const clone = (o) => JSON.parse(JSON.stringify(o));
function setPath(obj, p, val) {
  const parts = parsePath(p);
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (cur[k] == null) cur[k] = typeof parts[i + 1] === "number" ? [] : {};
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = val;
}
function unsetPath(obj, p) {
  const parts = parsePath(p);
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (cur == null) return;
    cur = cur[parts[i]];
  }
  if (cur == null) return;
  const last = parts[parts.length - 1];
  if (Array.isArray(cur) && typeof last === "number") cur.splice(last, 1);
  else delete cur[last];
}
const normKey = (p) =>
  String(p).replace(/^componentContent\./, "").replace(/^componentConfiguration\./, "").replace(/\[\d+\]/g, "[]");

// Fields that change MARKUP but always LOOK the same (the design system fixes the appearance), so
// the render-diff gate can't catch them — they must be excluded explicitly. No-op / unused fields
// like a component that ignores a toggle are caught by the render-diff gate instead, since they
// don't change the output at all.
const NON_VISUAL_LEAVES = new Set([
  "clickablecard", "clickablecards", // wrapper <a> vs <div>
  "showaslink", // heading wrapped in <a> vs plain text (team-grid)
  "headinglevel", "headinglevelcards", // h2 vs h3 — size fixed by design-system class
  "componentid", "componentclasses", // id / extra classes — no inherent visual change
]);
const leafName = (key) => normKey(key).split(".").pop().replace(/\[\]$/, "").toLowerCase();
const isNonVisual = (key) => NON_VISUAL_LEAVES.has(leafName(key));

// Apply one set/unset to the cloned data, returning true only if it is a VALID, VISUAL change:
// known field, not a container, not structural/non-visual, valid enum value, and (for unset) optional.
function applyChange(data, fieldByKey, p, val, isUnset) {
  const row = fieldByKey.get(normKey(p));
  if (!row || row.container || isNonVisual(p)) return false;
  if (isUnset) {
    if (row.required) return false; // an editor can't remove a required field
    unsetPath(data, p);
    return true;
  }
  if (row.enumFull && row.enumFull.length && !row.enumFull.map(String).includes(String(val))) return false; // invalid option
  setPath(data, p, val);
  return true;
}

// The fields worth offering as variants: visual + changeable (optional → hide; boolean → toggle;
// enum with ≥2 options → switch).
function variantMenu(content, configuration) {
  return [...content, ...configuration].filter(
    (r) => !r.container && !isNonVisual(r.key) && (!r.required || r.type === "boolean" || (r.enumFull && r.enumFull.length >= 2))
  );
}
function menuSummary(rows) {
  return rows
    .map((r) => {
      const how =
        r.enumFull && r.enumFull.length
          ? `set to one of ${JSON.stringify(r.enumFull)}`
          : r.type === "boolean"
          ? "set true or false"
          : !r.required
          ? "unset to hide it"
          : "change its value";
      return `- ${r.key} (${r.type}) — ${how}`;
    })
    .join("\n");
}

// ── Model prompt ─────────────────────────────────────────────────────────────────────────────────
function catalogueSummary(fields) {
  return fields
    .map(
      (f) =>
        `- ${f.key} (${f.type}${f.required ? ", required" : ""}${f.enum ? `, options: ${JSON.stringify(f.enum)}` : ""}${f.default !== undefined ? `, default: ${JSON.stringify(f.default)}` : ""})`
    )
    .join("\n");
}
function buildMessages({ displayName, description, content, menu, exampleData, slotIds }) {
  let dataStr = JSON.stringify(exampleData, null, 2);
  if (dataStr.length > 3500) dataStr = dataStr.slice(0, 3500) + "\n...(truncated)";
  const sys =
    "You write documentation copy and pick example configurations for a CMS component preview. " +
    "You return STRICT JSON only — no prose, no markdown fences. You NEVER write HTML or component markup; " +
    "rendering is done by code. Keep every sentence short, friendly and aimed at non-technical Content Editors.";
  const user =
    `Component: "${displayName}". Description: ${description || "(none)"}.\n\n` +
    `EDITABLE CONTENT fields (context for the descriptions):\n${catalogueSummary(content)}\n\n` +
    `VARIANT MENU — the ONLY fields you may change for variants; each change must produce a clearly VISIBLE difference:\n${menuSummary(menu)}\n\n` +
    `Default example data:\n${dataStr}\n\n` +
    `Return STRICT JSON with exactly these keys:\n` +
    `{\n` +
    `  "prose": { ${slotIds.map((s) => `"${s}": "one friendly sentence"`).join(", ")} },\n` +
    `  "variants": [ up to ${MAX_VARIANTS} objects, each {"label":"max 4 words","description":"1 sentence on the VISIBLE change","set":{"<menu field>": <listed value>},"unset":["<optional menu field>"]} ]\n` +
    `}\n\n` +
    `Variant rules: change ONLY fields from the VARIANT MENU, to the listed values (or unset an optional one). Every ` +
    `variant must look visibly different from the default and from the other variants — do NOT touch layout-only or ` +
    `accessibility-only settings, and do NOT invent fields or values. Keep image/URL values identical to the default. ` +
    `prose keys MUST be exactly the ids listed above.`;
  return [
    { role: "system", content: sys },
    { role: "user", content: user },
  ];
}

// Deterministic stub for local dry runs (MODELS_MOCK=1), so the apply pipeline can be tested offline.
function mockProposal({ menu, slotIds }) {
  const prose = {};
  for (const id of slotIds) prose[id] = `[[mock]] ${id.replace(/^field:/, "")} — a friendly editor sentence.`;
  const variants = [];
  for (const r of menu) {
    if (variants.length >= MAX_VARIANTS) break;
    if (r.enumFull && r.enumFull.length >= 2) {
      const v = r.enumFull.find((x) => String(x) !== String(r.default)) ?? r.enumFull[r.enumFull.length - 1];
      variants.push({ label: `${r.title}: ${v}`, description: `Switches ${r.title} to ${v}.`, set: { [r.key]: v } });
    } else if (r.type === "boolean") {
      variants.push({ label: `${r.title} off`, description: `Turns ${r.title} off.`, set: { [r.key]: false } });
    } else if (!r.required) {
      variants.push({ label: `No ${r.title}`, description: `Hides ${r.title}.`, unset: [r.key] });
    }
  }
  return { prose, variants };
}

// ── Apply ─────────────────────────────────────────────────────────────────────────────────────────
function applyProse(html, model) {
  const slots = extractProseSlots(html);
  const map = {};
  for (const [id, text] of Object.entries(model.prose || {})) {
    if (id in slots && typeof text === "string") map[id] = esc(text);
  }
  return overlayProse(html, map);
}

async function applyVariants(html, component, exampleData, defaultRender, fieldByKey, model) {
  const cells = [];
  const defaultSig = visualSignature(defaultRender);
  for (const v of model.variants || []) {
    if (cells.length >= MAX_VARIANTS) break;
    const data = clone(exampleData);
    let applied = 0;
    for (const [p, val] of Object.entries(v.set || {})) if (applyChange(data, fieldByKey, p, val, false)) applied++;
    for (const p of v.unset || []) if (applyChange(data, fieldByKey, p, null, true)) applied++;
    if (!applied) continue; // no valid/visual change requested

    // Visual gate: the variant must look DIFFERENT from the default. Compare visual signatures (not
    // raw HTML) so markup-only changes that look identical (h2/h3, <a>/<div> wrappers, an unset link
    // that still shows the same button) are dropped.
    let rendered;
    try {
      rendered = await renderComponent(component, data);
    } catch {
      continue;
    }
    if (visualSignature(rendered) === defaultSig) continue;

    const n = cells.length + 1;
    const label = v.label || `Variant ${n}`;
    const marker = renderMarker({
      component,
      role: "variant",
      id: `v${n}`,
      label,
      data,
      placeholder: `<p class="px-5 py-8 text-center text-sm text-gray-400">Pending render.</p>`,
    });
    cells.push(variantCell({ label, description: v.description || "", marker }));
  }
  const grid = variantGrid(cells);
  return html.replace(
    /(<!--\s*ucx:variants\s*-->)[\s\S]*?(<!--\s*\/ucx:variants\s*-->)/,
    (_m, open, close) => `${open}\n${grid}\n${close}`
  );
}

async function passComponent(name, css, js) {
  const guidePath = path.join(DOCS_DIR, name, "user-guide.html");
  const html = await fs.readFile(guidePath, "utf8").catch(() => null);
  if (html == null) {
    console.warn(`  ! ${name}: no guide yet (run render-guides first) — skipped`);
    return false;
  }
  const comp = await loadComponent(name);
  const dataPath = await findExampleData(comp.dir);
  if (!dataPath) {
    console.warn(`  ! ${name}: no example data — skipped`);
    return false;
  }
  const exampleData = JSON.parse(await fs.readFile(dataPath, "utf8"));
  const { content, configuration } = flattenFields(comp.manifest);
  const fieldByKey = new Map([...content, ...configuration].map((r) => [normKey(r.key), r]));
  const menu = variantMenu(content, configuration);
  const defaultRender = await renderComponent(name, exampleData);
  const slotIds = Object.keys(extractProseSlots(html)).filter((id) => id !== "tips");

  let model;
  if (process.env.MODELS_FIXTURE) {
    model = JSON.parse(await fs.readFile(process.env.MODELS_FIXTURE, "utf8")); // canned output for testing the guardrails
  } else if (process.env.MODELS_MOCK) {
    model = mockProposal({ menu, slotIds });
  } else {
    const raw = await chat(buildMessages({ displayName: comp.displayName, description: comp.description, content, menu, exampleData, slotIds }), {
      json: true,
      maxTokens: 3000,
    });
    model = extractJson(raw) || {};
  }

  let out = applyProse(html, model);
  out = await applyVariants(out, name, exampleData, defaultRender, fieldByKey, model);
  out = await processDocument(out, css, `${name}/user-guide.html`, js);

  const kept = (out.match(/role="variant"/g) || []).length;
  if (out !== html) {
    await fs.writeFile(guidePath, out, "utf8");
    console.log(`  ✓ ${name}: ${kept} variant(s) kept of ${(model.variants || []).length} proposed + prose`);
  } else {
    console.log(`  = ${name}: no change`);
  }
  return true;
}

async function main() {
  installStableRandom();
  if (!process.env.MODELS_MOCK && !process.env.MODELS_FIXTURE && !hasToken()) {
    console.error("No ANTHROPIC_API_KEY. Set ANTHROPIC_API_KEY, or MODELS_MOCK=1 for a dry run.");
    process.exitCode = 1;
    return;
  }
  const css = await readCompiledCss();
  const js = await readComponentScripts();
  const requested = (process.env.COMPONENT || "").trim();
  let names;
  if (requested && requested.toLowerCase() !== "all") names = requested.split(/[\s,]+/).filter(Boolean);
  else names = await listComponents();

  console.log(`Guide once-over for ${names.length} component(s)${process.env.MODELS_MOCK ? " (MOCK)" : ""}…`);
  for (const name of names) {
    try {
      await passComponent(name, css, js);
    } catch (e) {
      console.warn(`  ! ${name}: ${e.message}`);
    }
    if (names.length > 1 && !process.env.MODELS_MOCK) await new Promise((r) => setTimeout(r, 1200));
  }
  console.log("\nDone.");
}

if (pathToFileURL(process.argv[1]).href === import.meta.url) {
  main()
    .catch((e) => {
      console.error(e);
      process.exitCode = 1;
    })
    .finally(() => restoreRandom());
}
