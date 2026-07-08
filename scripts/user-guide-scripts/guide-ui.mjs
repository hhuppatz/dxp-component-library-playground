// scripts/user-guide-scripts/guide-ui.mjs
//
// The shared "engine" + HTML fragment builders for the component user guides.
//
// Engine (used by render-guides.mjs and ci-guide-pass.mjs):
//   - badge injection + field numbering + ucx:render/ucx:data marker rendering + CSS inlining,
//     all driven by processDocument().
// Field catalogue: flattenFields() splits a manifest into Content vs Configuration.
// Fragment builders: deterministic HTML for the generated guides.
// Prose slots: data-ucx-prose="ID" elements whose text survives regeneration (overlayProse), so a
//   model "once-over" can refine wording without the deterministic build wiping it.

import fs from "node:fs/promises";
import path from "node:path";
import { renderComponent } from "./component-render.mjs";

export const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const FLOWBITE_JS = "https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.js";

// ── Badges ─────────────────────────────────────────────────────────────────────────────────────
export function badgeSpan(n) {
  return `<span data-ucx-badge class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold shrink-0 align-middle mr-1">${n}</span>`;
}

// Normalise a field key so a live render's data-sq-field ("componentContent.cards[0].heading")
// matches a property row's data-ucx-field ("componentContent.cards[].heading" / "cards[].heading").
export function badgeKey(field) {
  return field
    .replace(/^componentContent\./, "")
    .replace(/^componentConfiguration\./, "")
    .replace(/\[\d+\]/g, "[]");
}

const VOID_TAGS = new Set(["img", "input", "br", "hr", "source", "area", "base", "col", "embed", "meta", "param", "track", "wbr"]);
const ANCHOR_RE = /<([a-zA-Z][\w-]*)\b[^>]*?\bdata-sq-field="([^"]+)"[^>]*>/g;

// Find where to drop a badge so it sits to the RIGHT of the field: just before the element's closing
// tag (its last child) for normal elements, or right after a void/self-closing element. Returns the
// splice index, or null if the markup can't be balanced.
function badgeInsertIndex(html, openStart, tagName) {
  const gt = html.indexOf(">", openStart);
  if (gt === -1) return null;
  if (VOID_TAGS.has(tagName.toLowerCase()) || html[gt - 1] === "/") return gt + 1;
  const openRe = new RegExp("<" + tagName + "(?=[\\s/>])", "gi");
  const closeRe = new RegExp("</" + tagName + "\\s*>", "gi");
  let depth = 1;
  let pos = gt + 1;
  while (depth > 0) {
    openRe.lastIndex = pos;
    closeRe.lastIndex = pos;
    const o = openRe.exec(html);
    const c = closeRe.exec(html);
    if (!c) return null;
    if (o && o.index < c.index) {
      depth++;
      pos = o.index + 1;
    } else {
      depth--;
      if (depth === 0) return c.index;
      pos = c.index + c[0].length;
    }
  }
  return null;
}

// For each normalised key, the chosen anchor occurrence per `mode` and its badge insert index.
function chosenAnchors(html, numByField, mode) {
  const occ = [];
  let m;
  ANCHOR_RE.lastIndex = 0;
  while ((m = ANCHOR_RE.exec(html))) {
    const key = badgeKey(m[2]);
    if (numByField && !numByField[key]) continue;
    occ.push({ start: m.index, tag: m[1], key });
  }
  const pick = new Map();
  for (const o of occ) {
    if (mode === "all") pick.set(`${o.key}@${o.start}`, o);
    else if (mode === "last" || !pick.has(o.key)) pick.set(o.key, o);
  }
  const out = [];
  for (const o of pick.values()) {
    const at = badgeInsertIndex(html, o.start, o.tag);
    if (at != null) out.push({ key: o.key, at });
  }
  return out;
}

// Map of normalised key -> badge insert index (where the number will visually appear). Used to order
// the field list so it reads top-to-bottom in lockstep with the badges.
export function anchorBadgePositions(html, mode = "first") {
  const pos = new Map();
  for (const a of chosenAnchors(html, null, mode)) if (!pos.has(a.key)) pos.set(a.key, a.at);
  return pos;
}

// Insert a numbered badge to the RIGHT of each anchored field (last child / after a void element).
//   "first" → first match (array items: the representative first item)
//   "last"  → last match  (a field that renders twice, e.g. card link on heading-wrap AND CTA button)
//   "all"   → every match
export function injectBadges(html, numByField, mode = "first") {
  const inserts = chosenAnchors(html, numByField, mode)
    .map((a) => ({ at: a.at, badge: badgeSpan(numByField[a.key]) }))
    .sort((a, b) => b.at - a.at); // right-to-left so earlier offsets stay valid
  let out = html;
  for (const ins of inserts) out = out.slice(0, ins.at) + ins.badge + out.slice(ins.at);
  return out;
}

// A "visual signature" of rendered HTML: only what affects STATIC appearance — visible text, CSS
// classes (minus pseudo-state variants like hover:/focus:/*-hover), and visual attributes — with
// interchangeable container/heading tags canonicalised and non-visual attributes (href, id, target,
// data-*, aria-*, role, …) dropped. Two renders with the SAME signature look identical, so a variant
// whose signature matches the default produces no visible change — e.g. h2 vs h3, an <a> vs <div>
// wrapper, or an unset link that still shows the same button.
const INTERCHANGEABLE_TAGS = new Set([
  "a", "div", "span", "p", "section", "aside", "header", "footer", "nav", "main", "article", "figure",
  "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "label",
]);
const VISUAL_ATTRS = new Set([
  "class", "src", "alt", "style", "viewbox", "d", "fill", "stroke", "points", "x", "y", "cx", "cy", "r", "width", "height", "rx", "ry",
]);
const STATE_VARIANT = /^(hover|focus|active|focus-visible|focus-within|group-hover|group-focus|disabled|visited|target|motion-safe|motion-reduce|dark):/;
const STATE_CUSTOM = /(^|-)(hover|focus|active|visited)(-|$)/;
export function visualSignature(html) {
  let s = String(html).replace(/<!--[\s\S]*?-->/g, "");
  s = s.replace(/<(\/?)([a-zA-Z][\w-]*)((?:\s+[^<>]*?)?)\s*\/?>/g, (_m, slash, tag, attrs) => {
    const name = tag.toLowerCase();
    const canon = INTERCHANGEABLE_TAGS.has(name) ? "t" : name;
    if (slash) return `</${canon}>`;
    const keep = [];
    const attrRe = /([a-zA-Z:_-]+)\s*=\s*"([^"]*)"/g;
    let a;
    while ((a = attrRe.exec(attrs))) {
      const an = a[1].toLowerCase();
      if (an === "class") {
        const cls = a[2]
          .split(/\s+/)
          .filter((c) => c && !STATE_VARIANT.test(c) && !STATE_CUSTOM.test(c))
          .sort()
          .join(" ");
        if (cls) keep.push(`class="${cls}"`);
      } else if (VISUAL_ATTRS.has(an)) {
        keep.push(`${an}="${a[2]}"`);
      }
    }
    return `<${canon}${keep.length ? " " + keep.join(" ") : ""}>`;
  });
  return s.replace(/\s+/g, " ").trim();
}

// ── Field numbering (driven by data-ucx-field rows, in document order) ───────────────────────────
export function buildNumbering(html) {
  const numByField = {};
  const fieldRe = /data-ucx-field="([^"]+)"/g;
  let m;
  let n = 0;
  while ((m = fieldRe.exec(html))) {
    n += 1;
    const key = badgeKey(m[1]);
    if (!(key in numByField)) numByField[key] = n;
  }
  let i = 0;
  const out = html.replace(
    /(<span\b[^>]*\bdata-ucx-num\b[^>]*>)([\s\S]*?)(<\/span>)/g,
    (_full, open, _inner, close) => `${open}${++i}${close}`
  );
  if (i !== n) {
    console.warn(`  ! numbering mismatch: ${n} data-ucx-field row(s) but ${i} data-ucx-num span(s)`);
  }
  return { html: out, numByField };
}

// ── ucx:render / ucx:data markers ────────────────────────────────────────────────────────────────
export function parseAttrs(str) {
  const attrs = {};
  const re = /([a-zA-Z][\w-]*)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(str))) attrs[m[1]] = m[2];
  return attrs;
}

const escAttr = (s) => String(s ?? "").replace(/"/g, "'");

// Build a fresh ucx:render block (open marker + ucx:data + placeholder + close marker).
export function renderMarker({ component, role, id, badge, label, note, data, placeholder = "" }) {
  const attrs = [
    `component="${component}"`,
    `role="${role}"`,
    `id="${id}"`,
    badge ? `badge="${badge}"` : "",
    label ? `label="${escAttr(label)}"` : "",
    note ? `note="${escAttr(note)}"` : "",
  ]
    .filter(Boolean)
    .join(" ");
  const json = JSON.stringify(data, null, 2);
  return `<!-- ucx:render ${attrs} -->\n<!-- ucx:data\n${json}\n-->\n${placeholder}\n<!-- /ucx:render -->`;
}

// Make every id (and the references to it) unique to this block. The same component is rendered
// many times in one guide (preview + variants); on a real page Math.random/crypto.randomUUID give
// each instance a unique id, but those are pinned to constants here for deterministic builds, so
// without this every accordion/tab/video instance shares ids and Flowbite (which resolves
// data-*-target via a document-wide querySelector) wires them all to the FIRST one — i.e. clicking a
// variant silently toggles the preview. Bracketing each search with the closing quote means we only
// rewrite complete attribute values, never partial-id substrings.
const ID_REF_ATTRS = ["aria-controls", "aria-labelledby", "aria-describedby", "for", "data-video-frameid"];
export function scopeIds(html, prefix) {
  const ids = new Set();
  for (const m of html.matchAll(/\bid="([^"]+)"/g)) ids.add(m[1]);
  if (!ids.size) return html;
  let out = html;
  // longest ids first, so a shorter id can never be mistaken for the start of a longer one
  for (const id of [...ids].sort((a, b) => b.length - a.length)) {
    const scoped = `${prefix}-${id}`;
    out = out.split(`id="${id}"`).join(`id="${scoped}"`); // declarations
    out = out.split(`"#${id}"`).join(`"#${scoped}"`); // #-prefixed refs (href, data-*-target / data-*-toggle)
    for (const attr of ID_REF_ATTRS) out = out.split(`${attr}="${id}"`).join(`${attr}="${scoped}"`); // bare-id refs
  }
  return out;
}

async function rebuildBlock(block, numByField, label) {
  const openMatch = block.match(/^<!--\s*ucx:render\b([\s\S]*?)-->/);
  const dataMatch = block.match(/<!--\s*ucx:data\b([\s\S]*?)-->/);
  if (!openMatch) return block;
  const attrs = parseAttrs(openMatch[1]);
  const id = attrs.id || "?";
  const openMarker = openMatch[0];

  if (!dataMatch) {
    console.warn(`  ! ${label}#${id}: no ucx:data block — left unchanged`);
    return block;
  }
  let data;
  try {
    data = JSON.parse(dataMatch[1].trim());
  } catch (e) {
    console.warn(`  ! ${label}#${id}: invalid ucx:data JSON (${e.message}) — left unchanged`);
    return block;
  }

  let rendered;
  try {
    rendered = await renderComponent(attrs.component, data);
  } catch (e) {
    console.warn(`  ! ${label}#${id}: render failed (${e.message}) — left unchanged`);
    return block;
  }

  rendered = scopeIds(rendered, attrs.id || attrs.role || "ucx");
  if (attrs.role === "preview") rendered = injectBadges(rendered, numByField, attrs.badge || "first");

  return `${openMarker}\n${dataMatch[0]}\n${rendered}\n<!-- /ucx:render -->`;
}

export async function processRenderBlocks(html, numByField, label) {
  // Require a real component="…" attribute so prose that merely mentions the marker syntax
  // (e.g. in a header comment) is never matched.
  const blockRe = /<!--\s*ucx:render\s+[^>]*?\bcomponent="[^"]*"[^>]*?-->[\s\S]*?<!--\s*\/ucx:render\s*-->/g;
  const matches = [...html.matchAll(blockRe)];
  if (!matches.length) return html;

  let out = "";
  let cursor = 0;
  for (const match of matches) {
    out += html.slice(cursor, match.index);
    out += await rebuildBlock(match[0], numByField, label);
    cursor = match.index + match[0].length;
  }
  out += html.slice(cursor);
  return out;
}

// ── Inlined compiled CSS (so a file renders when opened locally) ─────────────────────────────────
export const CSS_START = "/* ucx:managed-css */";
export const CSS_END = "/* /ucx:managed-css */";
export function inlineCss(html, css, label) {
  if (!css) return html;
  const re = new RegExp(escapeRe(CSS_START) + "[\\s\\S]*?" + escapeRe(CSS_END));
  if (!re.test(html)) {
    console.warn(`  ! ${label}: no ${CSS_START} … ${CSS_END} markers — skipping CSS inline`);
    return html;
  }
  return html.replace(re, `${CSS_START}\n${css}\n${CSS_END}`);
}

export async function readCompiledCss() {
  // Inline compiled CSS so guides render styled when opened directly. Point COMPONENT_GUIDE_CSS at
  // your compiled stylesheet, or drop one at dist/assets/css/output.css. Missing → guides render
  // unstyled (functionally fine; a warning is logged).
  const candidates = [
    process.env.COMPONENT_GUIDE_CSS,
    "dist/assets/css/output.css",
    "dist/client/assets/main.css",
  ].filter(Boolean);
  for (const rel of candidates) {
    try {
      const css = await fs.readFile(path.resolve(process.cwd(), rel), "utf8");
      if (css.trim()) return css;
    } catch {}
  }
  return "";
}

// ── Inlined component scripts (so previews are actually interactive) ──────────────────────────────
// If your components need JS to be interactive, list the files here (relative to src/scripts). They
// are baked into the self-contained guide. Missing files are skipped silently.
export const JS_START = "/* ucx:managed-js */";
export const JS_END = "/* /ucx:managed-js */";
const GUIDE_SCRIPT_FILES = ["carousel.js", "tabs.js", "lightbox.js", "hero-video.js"];
export async function readComponentScripts() {
  const dir = path.resolve(process.cwd(), "src", "scripts");
  const parts = [];
  for (const f of GUIDE_SCRIPT_FILES) {
    try {
      const src = await fs.readFile(path.join(dir, f), "utf8");
      // Wrap each in its own IIFE so top-level declarations can't collide across files.
      if (src.trim()) parts.push(`/* ${f} */\n(function(){\n${src}\n})();`);
    } catch {}
  }
  // Neutralise any literal </script> so the inline block can't be closed early.
  return parts.join("\n\n").replace(/<\/script/gi, "<\\/script");
}
export function inlineScripts(html, js, label) {
  if (!js) return html;
  const re = new RegExp(escapeRe(JS_START) + "[\\s\\S]*?" + escapeRe(JS_END));
  if (!re.test(html)) {
    console.warn(`  ! ${label}: no ${JS_START} … ${JS_END} markers — skipping JS inline`);
    return html;
  }
  return html.replace(re, `${JS_START}\n${js}\n${JS_END}`);
}

// The shared rendering pipeline: number rows, render markers, inline CSS + component scripts.
export async function processDocument(html, css, label, js) {
  const { html: numbered, numByField } = buildNumbering(html);
  let out = await processRenderBlocks(numbered, numByField, label);
  out = inlineCss(out, css, label);
  out = inlineScripts(out, js, label);
  return out;
}

// ── Managed regions (e.g. <!-- ucx:variants --> … <!-- /ucx:variants -->) ────────────────────────
export function extractRegion(html, name) {
  const re = new RegExp(
    "<!--\\s*" + escapeRe(name) + "\\s*-->([\\s\\S]*?)<!--\\s*/" + escapeRe(name) + "\\s*-->"
  );
  const m = html.match(re);
  return m ? m[1] : null;
}
export function region(name, inner) {
  return `<!-- ${name} -->\n${inner}\n<!-- /${name} -->`;
}

// ── Prose slots (model-editable text that survives regeneration) ─────────────────────────────────
export function proseSlot(id, seedHtml, tag = "span", cls = "") {
  const clsAttr = cls ? ` class="${cls}"` : "";
  return `<${tag} data-ucx-prose="${id}"${clsAttr}>${seedHtml}</${tag}>`;
}
export function extractProseSlots(html) {
  const slots = {};
  const re = /<([a-zA-Z][\w-]*)\b[^>]*\bdata-ucx-prose="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g;
  let m;
  while ((m = re.exec(html))) slots[m[2]] = m[3];
  return slots;
}
export function overlayProse(html, existing) {
  if (!existing) return html;
  return html.replace(
    /(<([a-zA-Z][\w-]*)\b[^>]*\bdata-ucx-prose="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g,
    (full, open, _tag, id, _inner, close) => (id in existing ? `${open}${existing[id]}${close}` : full)
  );
}

// ── Document shell ───────────────────────────────────────────────────────────────────────────────
export function buildDocument({ title, bodyHtml }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)} — Component User Guide</title>
<style>
${CSS_START}
${CSS_END}
</style>
</head>
<body class="antialiased bg-gray-50">
${bodyHtml}
<script src="${FLOWBITE_JS}"></script>
<script>
${JS_START}
${JS_END}
</script>
</body>
</html>
`;
}

// ── Field catalogue: split a manifest into { content[], configuration[] } ────────────────────────
function mainInput(manifest) {
  const fns = manifest.functions || [];
  const name = manifest.mainFunction || fns[0]?.name || "main";
  const fn = fns.find((f) => f.name === name) || fns[0] || {};
  return fn.input || {};
}
function collectEnum(def) {
  let vals = null;
  let labels = null;
  if (Array.isArray(def.enum)) {
    vals = def.enum.slice();
  } else if (Array.isArray(def.oneOf)) {
    vals = [];
    labels = [];
    for (const b of def.oneOf) {
      const e = Array.isArray(b.enum) ? b.enum : b.const !== undefined ? [b.const] : [];
      for (const v of e) {
        vals.push(v);
        labels.push(b.title || String(v));
      }
    }
  }
  if (!vals) return { enum: undefined, enumLabels: undefined, enumFull: undefined };
  // drop the empty-string option and cap long lists (e.g. the ~700-value icon enum)
  const keep = [];
  const keepLabels = [];
  vals.forEach((v, i) => {
    if (v === "") return;
    keep.push(v);
    if (labels) keepLabels.push(labels[i]);
  });
  const cap = 16;
  // enumFull = every valid value (for value validation); enum = capped for display.
  if (keep.length > cap) {
    const extra = keep.length - (cap - 1);
    return {
      enum: [...keep.slice(0, cap - 1), `…(+${extra} more)`],
      enumLabels: labels ? [...keepLabels.slice(0, cap - 1), `…(+${extra} more)`] : undefined,
      enumFull: keep,
    };
  }
  return { enum: keep, enumLabels: labels ? keepLabels : undefined, enumFull: keep };
}
function typeOf(def) {
  if (def.type) return def.type;
  if (Array.isArray(def.oneOf)) return "string";
  if (def.items) return "array";
  return "";
}
function makeRow(group, key, def, required) {
  const isObj = def.type === "object" && def.properties;
  const isArr = (def.type === "array" || def.items) && def.items?.properties;
  const { enum: en, enumLabels, enumFull } = collectEnum(def);
  return {
    group,
    key,
    badgeKeyNorm: badgeKey(key),
    title: def.title || key.split(".").pop(),
    description: def.description || "",
    type: typeOf(def),
    required,
    repeatable: !!isArr,
    container: !!(isObj || isArr),
    enum: en,
    enumLabels,
    enumFull,
    default: def.default,
    inlineEditable: !!def["ui:metadata"]?.inlineEditable,
    quickOption: !!def["ui:metadata"]?.quickOption,
  };
}
export function flattenFields(manifest) {
  const input = mainInput(manifest);
  const props = input.properties || {};
  const content = [];
  const configuration = [];

  const walk = (out, group, schema, prefix) => {
    const properties = schema.properties || {};
    const required = new Set(schema.required || []);
    for (const [key, def] of Object.entries(properties)) {
      const dotted = prefix ? `${prefix}.${key}` : key;
      const row = makeRow(group, dotted, def, required.has(key));
      out.push(row);
      if (def.type === "object" && def.properties) walk(out, group, def, dotted);
      else if ((def.type === "array" || def.items) && def.items?.properties)
        walk(out, group, def.items, `${dotted}[]`);
    }
  };

  if (props.componentConfiguration) walk(configuration, "Configuration", props.componentConfiguration, "componentConfiguration");
  if (props.componentContent) walk(content, "Content", props.componentContent, "componentContent");

  // Top-level content fields that are NOT wrapped in componentContent (e.g. accordion, and the flat
  // hh-* components in this repo whose fields sit directly under functions[0].input.properties).
  const topRequired = new Set(input.required || []);
  for (const [key, def] of Object.entries(props)) {
    if (key === "componentConfiguration" || key === "componentContent") continue;
    content.push(makeRow("Content", key, def, topRequired.has(key)));
    if (def.type === "object" && def.properties) walk(content, "Content", def, key);
    else if ((def.type === "array" || def.items) && def.items?.properties) walk(content, "Content", def.items, `${key}[]`);
  }

  return { content, configuration };
}

// ── Tag pills ────────────────────────────────────────────────────────────────────────────────────
const PILL_CLASS = {
  required: "bg-green-100 text-green-800",
  optional: "bg-yellow-100 text-yellow-800",
  editable: "bg-sky-100 text-sky-800",
  choice: "bg-violet-100 text-violet-800",
  other: "bg-gray-100 text-gray-800",
};
export function tagPill(label, kind = "other") {
  return `<span class="inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${PILL_CLASS[kind] || PILL_CLASS.other}">${esc(label)}</span>`;
}
function typeTag(row) {
  if (row.enum && row.enum.length) return ["Choice", "choice"];
  switch (row.type) {
    case "SquizImage":
      return ["Image", "other"];
    case "SquizLink":
      return ["Link", "other"];
    case "boolean":
      return ["Toggle", "other"];
    case "FormattedText":
    case "string":
      return ["Editable text", "editable"];
  }
  if (row.repeatable) return ["Repeatable", "other"];
  return null;
}
function fieldTags(row) {
  const tags = [tagPill(row.required ? "Required" : "Optional", row.required ? "required" : "optional")];
  const t = typeTag(row);
  if (t) tags.push(tagPill(t[0], t[1]));
  if (row.inlineEditable && (!t || t[0] !== "Editable text")) tags.push(tagPill("Inline edit", "editable"));
  return tags.join("\n                ");
}

// ── Property tables ──────────────────────────────────────────────────────────────────────────────
function enumNote(row) {
  if (!row.enum || !row.enum.length) return "";
  const labels = row.enumLabels && row.enumLabels.length === row.enum.length ? row.enumLabels : row.enum;
  return "Options: " + labels.join(" / ");
}
// A short, content-editor-facing word for a field's type (rather than the raw schema type — "Text"
// not "string", "Link" not "SquizLink"), matching the names editors see in the Content Editor.
function friendlyType(row) {
  if (row.enum && row.enum.length) return "Choice";
  switch (row.type) {
    case "SquizImage":
      return "Image";
    case "SquizLink":
      return "Link";
    case "boolean":
      return "Toggle";
    case "FormattedText":
      return "Formatted text";
    case "string":
      return "Text";
  }
  if (row.repeatable) return "List";
  return row.type || "Text";
}
// Break a content field into the parts an editor actually fills in, named with the manifest's visible
// titles and described with its descriptions (not the raw JSON paths / schema types).
function contentTableRows(row) {
  const title = row.title;
  const desc = row.description || "";
  if (row.type === "SquizLink") {
    return [
      [`${title} URL`, "Link", desc || "The web address this link points to"],
      [`${title} text`, "Text", "The wording shown on the button or link"],
      ["Open in", "Choice", "Open in the same tab, or a new tab"],
    ];
  }
  if (row.type === "SquizImage") {
    return [
      [title, "Image", desc || "Pick or upload an image; leave empty to hide it"],
      [`${title} alt text`, "Text", "Describes the image for screen readers and if it can't load"],
    ];
  }
  const notes = desc || enumNote(row) || (row.repeatable ? "A repeatable list of items" : "");
  return [[title, friendlyType(row), notes]];
}
function propertyTable(rows) {
  const body = rows
    .map(
      ([p, t, n]) =>
        `<tr><td class="py-1 pr-6 font-medium text-gray-700 break-words">${esc(p)}</td><td class="py-1 pr-6 text-gray-500 break-words">${esc(t)}</td><td class="py-1 break-words">${esc(n)}</td></tr>`
    )
    .join("\n                  ");
  // table-fixed + fixed column widths so Property / Type / Notes line up across every field's table.
  return `<table class="w-full table-fixed text-xs text-left text-gray-600 border-collapse">
                <thead><tr class="text-gray-400 uppercase tracking-wide"><th class="pb-1 font-semibold pr-6 w-2/5">Property</th><th class="pb-1 font-semibold pr-6 w-1/5">Type</th><th class="pb-1 font-semibold">Notes</th></tr></thead>
                <tbody class="divide-y divide-gray-50">
                  ${body}
                </tbody>
              </table>`;
}

// A numbered content property row (carries data-ucx-field for badge numbering + a data-ucx-prose
// description slot the model can refine).
export function propertyRow(row) {
  const seed = row.description ? esc(row.description) : esc(`${row.title}.`);
  const descSlot = proseSlot(`field:${row.key}`, seed, "p", "text-sm text-gray-500 mb-3");
  return `<div class="px-5 py-4" data-ucx-field="${row.key}">
          <div class="flex items-start gap-3">
            <span data-ucx-num class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold shrink-0">0</span>
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <span class="font-semibold text-gray-900 text-sm">${esc(row.title)}</span>
                ${fieldTags(row)}
              </div>
              ${descSlot}
              ${propertyTable(contentTableRows(row))}
            </div>
          </div>
        </div>`;
}

export function propertiesList(contentLeaves) {
  if (!contentLeaves.length) {
    return `<div class="rounded-lg border border-gray-200 bg-white shadow-sm px-5 py-4 text-sm text-gray-500">This component has no editable content fields — it is configured entirely from the options below.</div>`;
  }
  return `<div class="rounded-lg border border-gray-200 bg-white shadow-sm divide-y divide-gray-100">
        ${contentLeaves.map(propertyRow).join("\n\n        ")}
      </div>`;
}

// ── Configuration (Display options) table ────────────────────────────────────────────────────────
export function displayOptionsTable(configRows, title = "Display options") {
  const leaves = configRows.filter((r) => !r.container);
  if (!leaves.length) return "";
  const body = leaves
    .map((r) => {
      const def = r.default === undefined || r.default === "" ? "—" : String(r.default);
      const notes = r.description || enumNote(r) || (r.type === "boolean" ? "On/off toggle" : "");
      const quick = r.quickOption ? ` ${tagPill("Quick option", "other")}` : "";
      return `<tr><td class="px-3 py-1.5 align-top font-medium text-gray-700 break-words">${esc(r.title)}</td><td class="px-3 py-1.5 align-top text-gray-500">${esc(friendlyType(r))}${quick}</td><td class="px-3 py-1.5 align-top font-mono">${esc(def)}</td><td class="px-3 py-1.5 align-top hidden sm:table-cell">${esc(notes)}</td></tr>`;
    })
    .join("\n            ");
  return `<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mt-8 mb-3">${esc(title)}</p>
      <div class="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table class="w-full text-xs text-left text-gray-600 border-collapse">
          <thead><tr class="text-gray-400 uppercase tracking-wide bg-gray-50"><th class="px-3 py-1.5 font-semibold">Option</th><th class="px-3 py-1.5 font-semibold">Type</th><th class="px-3 py-1.5 font-semibold">Default</th><th class="px-3 py-1.5 font-semibold hidden sm:table-cell">Notes</th></tr></thead>
          <tbody class="divide-y divide-gray-100">
            ${body}
          </tbody>
        </table>
      </div>`;
}

// ── Other fragments ──────────────────────────────────────────────────────────────────────────────
export function tagKeyRow() {
  return `<div class="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 items-center">
    <span class="font-semibold text-gray-400 uppercase tracking-widest">Key</span>
    <span class="flex items-center gap-1.5">${tagPill("Required", "required")} always present</span>
    <span class="flex items-center gap-1.5">${tagPill("Optional", "optional")} can be hidden</span>
    <span class="flex items-center gap-1.5">${tagPill("Editable text", "editable")} text you can change</span>
    <span class="flex items-center gap-1.5">${tagPill("Choice", "choice")} pick from options</span>
    <span class="flex items-center gap-1.5">${tagPill("Image / Link / Toggle", "other")} other field types</span>
    <span class="flex items-center gap-1.5">${tagPill("Inline edit", "editable")} click-to-edit in the page</span>
    <span class="flex items-center gap-1.5">${tagPill("Quick option", "other")} set in the options panel</span>
  </div>`;
}

export function sectionHeading(text, mt = "mt-16") {
  return `<h2 class="text-2xl font-bold text-gray-900 ${mt}">${esc(text)}</h2>`;
}

export function variantPlaceholder() {
  return `<p class="text-base text-gray-500">Variant examples are added by the guide workflow.</p>`;
}

// A single variant cell: caption + a (model-chosen, function-rendered) ucx:render variant marker.
export function variantCell({ label, description, marker }) {
  return `<div>
      <p class="text-xs font-semibold text-gray-500 mb-2">${esc(label)}</p>
      <div class="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
${marker}
      </div>
      ${description ? `<p class="text-xs text-gray-400 mt-2">${esc(description)}</p>` : ""}
    </div>`;
}
export function variantGrid(cells) {
  if (!cells.length) return variantPlaceholder();
  return `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  ${cells.join("\n  ")}
  </div>`;
}

function cleanName(displayName) {
  return displayName.replace(/^\[[^\]]*\]\s*/, "").trim();
}
export function addComponentSection(displayName) {
  const name = esc(cleanName(displayName));
  return `${sectionHeading("Add the component to your page")}
  <div class="mt-4 text-base text-gray-600 space-y-4 max-w-3xl">
    <p>When you are editing your page using Page Builder:</p>
    <ol class="list-decimal ps-5 space-y-2">
      <li>Add a component to your page by clicking the <span class="font-semibold text-gray-900">Add component</span> button, or by adding a content block then clicking <span class="font-semibold text-gray-900">Add component</span>.</li>
      <li>Locate the <span class="font-semibold text-gray-900">${name}</span> component within the component browser, then click the <span class="font-semibold text-gray-900">Select</span> button.</li>
    </ol>
  </div>`;
}
