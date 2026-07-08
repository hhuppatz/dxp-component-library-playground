// scripts/user-guide-scripts/component-render.mjs
//
// Shared helpers for importing and rendering DXP components from their entry file (main.js / main.mjs).
// This module has NO import-time side effects. Each entrypoint must, before rendering:
//   1. register("./dxp-root-loader.mjs", import.meta.url)  — so component entries can use extensionless
//      ("../../utils/html") and root ("/dxp/...") imports.
//   2. installStableRandom()                               — so Math.random-derived ids are stable and
//      re-runs are byte-for-byte idempotent.

import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
export const COMPONENTS_DIR = path.resolve(ROOT, "dxp", "component-service");

// Pin every source of non-determinism a component might derive ids from, so re-renders (and thus
// re-runs of the build) are byte-for-byte identical: Math.random, Date.now, and crypto.randomUUID.
let saved = null;
const FIXED_UUID = "00000000-0000-4000-8000-000000000000";
export function installStableRandom() {
  if (saved) return; // load-bearing: a second call would save the already-faked fns as the originals
  const webcrypto = globalThis.crypto;
  const hasUuid = typeof webcrypto?.randomUUID === "function"; // global crypto only exists on Node 20+
  saved = {
    random: Math.random,
    now: Date.now,
    uuid: hasUuid ? webcrypto.randomUUID : null,
  };
  Math.random = () => 0.123456789;
  Date.now = () => 1717200000000; // fixed timestamp
  if (hasUuid) webcrypto.randomUUID = () => FIXED_UUID;
}
export function restoreRandom() {
  if (!saved) return;
  Math.random = saved.random;
  Date.now = saved.now;
  if (saved.uuid) globalThis.crypto.randomUUID = saved.uuid;
  saved = null;
}

// Every DXP component is `export default { async main(data, info?) }` (the Squiz DXP contract),
// so the render entry is always default.main. null when it's missing — callers warn and skip rather
// than guessing at some other exported function.
export function findRender(mod) {
  return typeof mod?.default?.main === "function" ? mod.default.main : null;
}

// One calling convention: components destructure the data from arg 1 (`main({ heading, … }, info)`).
// Call it directly and let a real render error propagate — callers catch and report it.
export async function callRender(renderFn, inputData) {
  return renderFn(inputData, {});
}

// Resolve a component's entry file. Prefers the manifest's declared function entry (e.g. "main.js"),
// then falls back to main.js / main.mjs. This is what makes the pipeline work across repos whose
// components use either extension.
function resolveEntry(component) {
  const dir = path.join(COMPONENTS_DIR, component);
  try {
    const manifest = JSON.parse(fsSync.readFileSync(path.join(dir, "manifest.json"), "utf8"));
    const fns = manifest.functions || [];
    const mainName = manifest.mainFunction || fns[0]?.name;
    const entry = (fns.find((f) => f.name === mainName) || fns[0] || {}).entry;
    if (entry && fsSync.existsSync(path.join(dir, entry))) return path.join(dir, entry);
  } catch {}
  for (const cand of ["main.js", "main.mjs"]) {
    const p = path.join(dir, cand);
    if (fsSync.existsSync(p)) return p;
  }
  return null;
}

const moduleCache = new Map();
export async function renderComponent(component, inputData) {
  if (!component) throw new Error('missing component="" attribute');
  const entry = resolveEntry(component);
  if (!entry) throw new Error(`no main.js/main.mjs for component "${component}"`);
  let mod = moduleCache.get(entry);
  if (!mod) {
    mod = await import(pathToFileURL(entry).href);
    moduleCache.set(entry, mod);
  }
  const render = findRender(mod);
  if (!render) throw new Error(`no render function exported by ${path.basename(entry)} for "${component}"`);
  const out = await callRender(render, inputData);
  if (typeof out !== "string") throw new Error("render did not return a string");
  return out.trim();
}

export function mainFunctionDef(manifest) {
  const fns = manifest.functions || [];
  const name = manifest.mainFunction || fns[0]?.name || "main";
  return fns.find((f) => f.name === name) || fns[0] || { name, entry: "main.js" };
}

export async function findExampleData(dir) {
  const root = path.join(dir, "example.data.json");
  if (fsSync.existsSync(root)) return root;
  const ed = path.join(dir, "example-data");
  if (fsSync.existsSync(ed)) {
    const files = (await fs.readdir(ed)).filter((f) => f.endsWith(".json")).sort();
    if (!files.length) return null;
    // Prefer a file literally named example.data.json (the conventional default) over, say,
    // example-video.data.json which would otherwise sort first.
    const preferred = files.includes("example.data.json") ? "example.data.json" : files[0];
    return path.join(ed, preferred);
  }
  return null;
}

export async function listComponents() {
  const entries = await fs.readdir(COMPONENTS_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && fsSync.existsSync(path.join(COMPONENTS_DIR, e.name, "manifest.json")))
    .map((e) => e.name)
    .sort();
}

export async function loadComponent(name) {
  const dir = path.join(COMPONENTS_DIR, name);
  const manifest = JSON.parse(await fs.readFile(path.join(dir, "manifest.json"), "utf8"));
  return {
    name,
    dir,
    manifest,
    displayName: manifest.displayName || manifest.name || name,
    description: manifest.description || "",
    version: manifest.version || "",
    codeName: manifest.name || name,
  };
}
