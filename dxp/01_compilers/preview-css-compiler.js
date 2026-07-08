/**
 * preview-css-compiler.js
 *
 * Makes components appear styled in the local Squiz `dxp-next cmp dev-ui`
 * preview (and the DXP console preview).
 *
 * Each component's `css/*.scss` relies on the shared design-system variables
 * (`--color-text`, `--spacing-sm`, ...) that live in `src/styles`. In isolation
 * the dev-ui does not load those, so the preview renders bare, unstyled HTML.
 *
 * For every component we compile a self-contained stylesheet (design-system
 * `:root` variables + global reset + base typography + the component's own SCSS)
 * and inline it into that component's `preview.html` between the
 * `<!-- preview-css:start -->` / `<!-- preview-css:end -->` markers.
 *
 * Why inline into `preview.html` and not the manifest?
 *   `preview.html` is the *preview wrapper* — it is used only by the dev-ui and
 *   the DXP console preview, never by the deployed production render. Injecting
 *   styles here therefore has zero effect on `dxp-next cmp deploy` output. (A
 *   manifest `functions[].output.staticFiles` entry, by contrast, is a
 *   production contract that would ship this reset onto host pages.)
 *
 * The component SCSS imports via Vite path aliases (`@styles/...`,
 * `@common-styles/...`) that the plain `sass` CLI cannot resolve, so we compile
 * with the Sass JS API and a custom importer that mirrors `vite.config.js`.
 *
 * Usage:
 *   node dxp/01_compilers/preview-css-compiler.js          # build once
 *   node dxp/01_compilers/preview-css-compiler.js --watch  # rebuild on change
 */
import * as sass from 'sass';
import { globSync } from 'glob';
import chokidar from 'chokidar';
import path from 'path';
import { pathToFileURL } from 'url';
import fs from 'fs';

const repoRoot = process.cwd();
const WATCH = process.argv.includes('--watch');

// Mirror of the `resolve.alias` map in vite.config.js so component SCSS that
// imports via `@styles/...` etc. resolves the same way it does in the app build.
const ALIASES = {
  '@common-styles': 'src/styles/common',
  '@styles': 'src/styles',
  '@images': 'src/images',
  '@components': 'dxp/component-service',
  '@layouts': 'dxp/layouts',
  '@dxp': 'dxp',
  '@scripts': 'src/scripts'
};

// Shared base pulled into every preview so design-system variables, the reset,
// and base typography are present alongside the component's own SCSS.
const BASE_PARTIALS = [
  '@common-styles/variables',
  '@common-styles/global-shared',
  '@common-styles/fonts'
];

const MARKER_START = '<!-- preview-css:start -->';
const MARKER_END = '<!-- preview-css:end -->';

// Wrapper used when a component has no preview.html yet, or one without the
// markers. `[component://output]` is the placeholder the dev-ui replaces with
// the rendered component.
const WRAPPER_TEMPLATE = `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Component preview</title>
    ${MARKER_START}
    ${MARKER_END}
  </head>
  <body>
    [component://output]
  </body>
</html>
`;

// Custom importer resolving the Vite `@alias/...` prefixes to real files. Sass
// then applies its own partial/extension resolution (e.g. `_variables.scss`).
const aliasImporter = {
  findFileUrl(url) {
    // Match the longest alias first (`@common-styles` before `@styles`).
    const alias = Object.keys(ALIASES)
      .sort((a, b) => b.length - a.length)
      .find((a) => url === a || url.startsWith(`${a}/`));
    if (!alias) return null;
    const rest = url.slice(alias.length);
    return pathToFileURL(path.join(repoRoot, ALIASES[alias], rest));
  }
};

/** All component directories that ship at least one authored SCSS file. */
function findComponents() {
  return globSync('dxp/component-service/*/', { cwd: repoRoot })
    .map((dir) => path.join(repoRoot, dir))
    .map((abs) => {
      const scssFiles = globSync('css/*.scss', { cwd: abs }).map(
        (f) => path.parse(f).name
      );
      return {
        dir: abs,
        name: path.basename(abs.replace(/[\\/]$/, '')),
        scssFiles
      };
    })
    .filter((c) => c.scssFiles.length > 0);
}

/** Compile a component's self-contained preview CSS. */
function compileCss(component) {
  const cssDir = path.join(component.dir, 'css');
  const entry = [...BASE_PARTIALS, ...component.scssFiles]
    .map((ref) => `@use '${ref}';`)
    .join('\n');

  return sass.compileString(entry, {
    // component SCSS resolves from its own css/ dir; base partials via importer.
    loadPaths: [cssDir, repoRoot],
    importers: [aliasImporter],
    style: 'expanded',
    // A base url lets Sass resolve relative `@use` inside the entry string.
    url: pathToFileURL(path.join(cssDir, 'preview.entry.scss'))
  }).css;
}

/** Inline the compiled CSS into the component's preview.html between markers. */
function writePreviewHtml(component, css) {
  const previewPath = path.join(component.dir, 'preview.html');
  let html =
    fs.existsSync(previewPath) &&
    fs.readFileSync(previewPath, 'utf-8').includes(MARKER_START)
      ? fs.readFileSync(previewPath, 'utf-8')
      : WRAPPER_TEMPLATE;

  const styleBlock =
    `${MARKER_START}\n` +
    '    <!-- AUTO-GENERATED by dxp/01_compilers/preview-css-compiler.js.\n' +
    '         Preview-only: not part of the deployed component. Regenerate with\n' +
    '         `npm run build:preview-css`; edit the SCSS, not this block. -->\n' +
    `    <style>\n${css}\n    </style>\n` +
    `    ${MARKER_END}`;

  const markerRegex = new RegExp(`${MARKER_START}[\\s\\S]*?${MARKER_END}`);
  html = html.replace(markerRegex, () => styleBlock);
  fs.writeFileSync(previewPath, html, 'utf-8');
  return previewPath;
}

function buildAll() {
  const components = findComponents();
  if (components.length === 0) {
    console.warn('⚠ preview-css: no components with SCSS found.');
    return;
  }
  for (const component of components) {
    try {
      const css = compileCss(component);
      const out = writePreviewHtml(component, css);
      console.log(
        `✅ preview-css: ${component.name} → ${path.relative(repoRoot, out)}`
      );
    } catch (err) {
      console.error(
        `❌ preview-css: ${component.name} failed:\n${err.message}`
      );
      if (!WATCH) process.exitCode = 1;
    }
  }
}

buildAll();

if (WATCH) {
  console.log('👀 preview-css: watching for SCSS changes...');
  // Watch concrete directories (not cwd + glob patterns, which chokidar matches
  // unreliably on Windows) and filter for `.scss` in the handler.
  const watcher = chokidar.watch(
    [
      path.join(repoRoot, 'src', 'styles'),
      path.join(repoRoot, 'dxp', 'component-service')
    ],
    {
      ignoreInitial: true,
      // Polling is the reliable cross-platform option on Windows (the Squiz
      // dev-ui's own file watcher uses it for the same reason).
      usePolling: true,
      awaitWriteFinish: { stabilityThreshold: 150, pollInterval: 100 }
    }
  );
  const onChange = (file) => {
    if (!file.endsWith('.scss')) return;
    console.log(`↻ preview-css: ${path.relative(repoRoot, file)} changed...`);
    buildAll();
  };
  watcher.on('add', onChange).on('change', onChange).on('unlink', onChange);
}
