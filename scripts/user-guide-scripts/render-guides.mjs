// scripts/user-guide-scripts/render-guides.mjs
//
// DETERMINISTIC user-guide generator (no model). For every component it builds the full guide
// page from the manifest + example data and renders the real main component, then writes
// docs/<component>/user-guide.html. Honours the COMPONENT env var (name, comma list, or "all").
//
// The model-owned parts — the VARIANT examples (chosen by a model, rendered by functions) and the
// editor-friendly PROSE — live in managed regions that survive regeneration:
//   - variants  : a  <!-- ucx:variants --> … <!-- /ucx:variants -->  region, preserved verbatim and
//                 re-rendered each build (its ucx:render markers carry the model's chosen data).
//   - prose     : data-ucx-prose="ID" slots whose text is overlaid from the existing file.
// See ci-guide-pass.mjs for the once-over that fills those in.

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
  buildDocument,
  processDocument,
  readCompiledCss,
  readComponentScripts,
  esc,
  proseSlot,
  extractProseSlots,
  overlayProse,
  extractRegion,
  region,
  propertiesList,
  displayOptionsTable,
  tagKeyRow,
  sectionHeading,
  variantPlaceholder,
  addComponentSection,
  renderMarker,
  anchorBadgePositions,
} from "./guide-ui.mjs";

const ROOT = process.cwd();
const DOCS_DIR = path.resolve(ROOT, "docs");

const cleanName = (s) => s.replace(/^\[[^\]]*\]\s*/, "").trim();

function headerBlock(comp) {
  const overview = proseSlot("overview", esc(comp.description || ""), "p", "text-lg text-gray-500 mt-3 max-w-2xl");
  return `<p class="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">Component guide</p>
  <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">${esc(cleanName(comp.displayName))}</h1>
  ${overview}
  <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-gray-400">
    <code class="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">${esc(comp.codeName)}</code>
    ${comp.version ? `<span class="text-gray-300">·</span><span>v${esc(comp.version)}</span>` : ""}
  </div>`;
}

async function buildGuide(name, css, js) {
  const comp = await loadComponent(name);
  const label = `${name}/user-guide.html`;

  const dataPath = await findExampleData(comp.dir);
  if (!dataPath) {
    console.warn(`  ! ${name}: no example data — skipped`);
    return null;
  }
  const exampleData = JSON.parse(await fs.readFile(dataPath, "utf8"));

  let defaultRender;
  try {
    defaultRender = await renderComponent(name, exampleData);
  } catch (e) {
    console.warn(`  ! ${name}: default render failed (${e.message}) — skipped`);
    return null;
  }

  const { content, configuration } = flattenFields(comp.manifest);
  const contentLeaves = content.filter((r) => !r.container);

  // Badge mode: a field path that renders MORE THAN ONCE (raw, not array-normalised) means a single
  // logical field appears twice (e.g. card link on the heading-wrap AND the CTA button) → badge the
  // last one. Array items (cards[0], cards[1]) are distinct raw paths → "first" (the first item).
  const rawCounts = {};
  for (const m of defaultRender.matchAll(/data-sq-field="([^"]+)"/g)) rawCounts[m[1]] = (rawCounts[m[1]] || 0) + 1;
  const badgeMode = Object.values(rawCounts).some((c) => c >= 2) ? "last" : "first";

  // 1:1 numbering: the numbered field list contains ONLY the content fields that actually get a badge
  // on the live render, ordered by where the badge lands (so numbers read top-to-bottom). Content
  // fields with no anchor (toggles, icon/colour/size) and all configuration go in the options table.
  const badgePos = anchorBadgePositions(defaultRender, badgeMode);
  const anchored = contentLeaves
    .filter((r) => badgePos.has(r.badgeKeyNorm))
    .sort((a, b) => badgePos.get(a.badgeKeyNorm) - badgePos.get(b.badgeKeyNorm));
  const otherContent = contentLeaves.filter((r) => !badgePos.has(r.badgeKeyNorm));

  const existing = await fs.readFile(path.join(DOCS_DIR, name, "user-guide.html"), "utf8").catch(() => null);

  const previewMarker = renderMarker({
    component: name,
    role: "preview",
    id: "default",
    badge: badgeMode,
    data: exampleData,
    placeholder: `<p class="px-5 py-10 text-center text-sm text-gray-400">Run <code>npm run guides:render</code> to render this preview.</p>`,
  });

  const variantsInner = (existing && extractRegion(existing, "ucx:variants")?.trim()) || variantPlaceholder();
  const variantsSection = `${sectionHeading("Variant states")}
  <p class="text-base text-gray-500 mt-2">Here are some variations of the ${esc(cleanName(comp.displayName))} component, each showing a different visible change.</p>
  <div class="mt-6">
  ${region("ucx:variants", variantsInner)}
  </div>`;

  // The main component renders FULL-PAGE WIDTH (its own max-w container), framed like a real page
  // section; the numbered field descriptions sit in a list UNDERNEATH it, 1:1 with the badges.
  const body = `<div class="max-w-screen-xl mx-auto px-4 pt-10">
  ${headerBlock(comp)}
  <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mt-10 mb-3">Component preview</p>
</div>
<div class="border-y border-gray-200 bg-white">
${previewMarker}
</div>
<div class="max-w-screen-xl mx-auto px-4 py-10">
  <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Editable fields</p>
  <p class="text-sm text-gray-400 mb-4">Each number matches a circled badge on the component above.</p>
  ${propertiesList(anchored)}
  ${displayOptionsTable([...otherContent, ...configuration], "Settings & options")}
  ${tagKeyRow()}
  ${variantsSection}
  ${addComponentSection(comp.displayName)}
</div>`;

  let doc = buildDocument({ title: cleanName(comp.displayName), bodyHtml: body });
  if (existing) doc = overlayProse(doc, extractProseSlots(existing));
  doc = await processDocument(doc, css, label, js);

  if (doc !== existing) {
    await fs.mkdir(path.join(DOCS_DIR, name), { recursive: true });
    await fs.writeFile(path.join(DOCS_DIR, name, "user-guide.html"), doc, "utf8");
    console.log(`  ✓ ${label}`);
  } else {
    console.log(`  = ${label} (no change)`);
  }
  return true;
}

async function main() {
  installStableRandom();
  const requested = (process.env.COMPONENT || "").trim();
  const css = await readCompiledCss();
  if (!css) console.warn("  ! no compiled CSS found — guides will be unstyled (set COMPONENT_GUIDE_CSS or drop one at dist/assets/css/output.css)");
  const js = await readComponentScripts();
  if (!js) console.warn("  ! no component scripts found under src/scripts — guides will not be interactive");

  let names;
  if (requested && requested.toLowerCase() !== "all") names = requested.split(/[\s,]+/).filter(Boolean);
  else names = await listComponents();

  console.log(`Generating ${names.length} user guide(s)…`);
  let ok = 0;
  let skipped = 0;
  for (const name of names) {
    try {
      const r = await buildGuide(name, css, js);
      r === null ? skipped++ : ok++;
    } catch (e) {
      console.warn(`  ! ${name}: ${e.message} — skipped`);
      skipped++;
    }
  }
  console.log(`\nDone — ${ok} written, ${skipped} skipped.`);
}

if (pathToFileURL(process.argv[1]).href === import.meta.url) {
  main()
    .catch((e) => {
      console.error(e);
      process.exitCode = 1;
    })
    .finally(() => restoreRandom());
}
