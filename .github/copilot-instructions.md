# Copilot instructions for DXP Component Library

This document guides Copilot sessions on build/test/lint commands, high-level architecture, and repository-specific conventions.

---

## 1) Build, test, and lint commands

Primary commands (npm scripts in package.json):
- Dev (live preview):
  - npm run dev
  - Starts component dev UI (ports noted below).
- Component dev UI (build preview CSS then start):
  - npm run cmp
- Build:
  - npm run build
  - Client only: npm run build:client
  - Server (SSR) only: npm run build:server
- Preview CSS compiler (one-shot or watch):
  - npm run build:preview-css
  - npm run watch:preview-css
- Tests (Vitest):
  - npm run test  (runs vitest --coverage)
  - Run a single test file: npx vitest path/to/component/main.test.js
  - Run a single test by name: npx vitest -t "test name"
- JS linting:
  - npm run lint:js
  - Fix: npm run lint:js:fix
  - Lint a single file: npx eslint dxp/component-service/<component>/main.js
- CSS linting:
  - npm run lint:css
  - Fix: npm run lint:css:fix
  - Lint a single file: npx stylelint path/to/file.scss
- Formatting:
  - npm run prettier (check)
  - npm run prettier:fix (write)
- Version management helper:
  - npm run vermgmt

Examples for single-file invocations (preferred for Copilot quick edits):
- npx vitest dxp/component-service/button/main.test.js
- npx eslint dxp/component-service/button/main.js
- npx stylelint dxp/component-service/button/css/button.scss

---

## 2) High-level architecture (big picture)

- Root focuses on two content types:
  1) dxp/component-service/* — individual components. Each component is a small package containing manifest.json, preview.html, example.data.json, main.js, css/, js/ and tests.
  2) dxp/layouts/* — page layouts defined by manifest.json and markup.hbs (Handlebars).

- Shared dev tooling and assets live in src/: shared styles, scripts, mixins and global components. Vite is used for builds and defines path aliases (see vite.config.js).

- Dev preview flow:
  - npm run dev launches concurrently: preview-css watch, dxp-next dev UI, and a local server.
  - The preview-css-compiler (dxp/01_compilers/preview-css-compiler.js) generates an inline <style> block inserted between <!-- preview-css:start --> and <!-- preview-css:end --> in preview.html to produce styled previews in the dxp-next dev UI.
  - Ports used by the tooling: dev UI (4000), edge component preview (5555), UI preview (3000). See README for exact mapping.

- Deployment and versioning:
  - dxp-next CLI (dxp-next) handles dev UI and deploy flows.
  - npm run deploy --name=component_name and vermgmt help with multi-component deployments and version increments.

- Tests: Vitest is the test runner; tests are typically co-located with components (main.test.js).

---

## 3) Key conventions and patterns

- Required component files: manifest.json, preview.html, example.data.json.
- Do not edit generated preview CSS block in preview.html — edit SCSS and regenerate via preview-css-compiler.
- preview-css markers: <!-- preview-css:start --> and <!-- preview-css:end --> (compiler replaces content between these markers).
- Component structure: dxp/component-service/<name>/{css,js,example.data.json,main.js,manifest.json,preview.html,main.test.js}
- Use aliases from vite.config.js (e.g., @images/) for imports instead of deep relatives.
- Environment: use .env (gitignored) seeded from .example.env when needed. Components often fallback to mocks unless env vars are present.
- Linters: stylelint rules for SCSS, ESLint for JS. Run lint scripts from package.json before commits.
- Tests: vitest is configured project-wide. Run single-file tests with npx vitest <path> or filter by test name with -t.
- Preview CSS build step is required for styled previews in the dxp-next dev-ui (npm run cmp or npm run dev to auto-watch).
- Versioning: vermgmt script is present to assist with component version workflows.

---

## 4) AI assistant / other assistant config files

Checked for existing assistant rules/docs (CLAUDE.md, AGENTS.md, .cursorrules, .windsurfrules, CONVENTIONS.md, AIDER_CONVENTIONS.md, .clinerules, etc.) — none were found in the repository root to incorporate.

---

## Quick checklist for Copilot sessions

- Start by reading package.json and README.md to find the exact npm scripts and dev flow.
- For UI changes, run npm run watch:preview-css (or npm run dev) and open the appropriate preview port.
- For single-file verification run npx vitest <path> or npx eslint <path> or npx stylelint <path>.
- When generating/altering preview HTML, avoid editing the generated CSS block; change the SCSS source and regenerate.

---

If you want this file extended with CI-specific details (workflow names, required secrets), or to include `codespace` or `devcontainer` hints, say which CI or environment to target.
