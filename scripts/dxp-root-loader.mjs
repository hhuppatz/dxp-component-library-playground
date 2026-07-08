// scripts/dxp-root-loader.mjs
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const ROOT = process.cwd();
const EXTENSIONS = [".js", ".mjs", ".cjs"];

function isFile(p) {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

function resolveWithExtensions(basePath) {
  if (EXTENSIONS.some((ext) => basePath.endsWith(ext)) && isFile(basePath)) return basePath;

  // Try extensions
  for (const ext of EXTENSIONS) {
    const p = `${basePath}${ext}`;
    if (isFile(p)) return p;
  }

  // Try index files
  for (const ext of EXTENSIONS) {
    const p = path.join(basePath, `index${ext}`);
    if (isFile(p)) return p;
  }

  return null;
}

export async function resolve(specifier, context, nextResolve) {
  // 1) Vite-style root alias: "/dxp/..."
  if (specifier.startsWith("/dxp/")) {
    const rel = specifier.slice(1); // drop leading "/"
    const base = path.resolve(ROOT, rel);
    const hit = resolveWithExtensions(base);
    if (hit) {
      return { url: pathToFileURL(hit).href, shortCircuit: true };
    }
  }

  // 2) extensionless relative imports like "./utils/html" or "../utils/html"
  if (
    (specifier.startsWith("./") || specifier.startsWith("../")) &&
    !specifier.includes("?") // ignore querystring imports
  ) {
    const parent = context.parentURL && context.parentURL.startsWith("file:")
      ? fileURLToPath(context.parentURL)
      : ROOT;

    const base = path.resolve(path.dirname(parent), specifier);
    const hit = resolveWithExtensions(base);
    if (hit) {
      return { url: pathToFileURL(hit).href, shortCircuit: true };
    }
  }

  return nextResolve(specifier, context);
}
