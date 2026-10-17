#!/usr/bin/env node
// Inlines src/index.css into theme.css so end users make a single request.
//   node scripts/build.mjs           write theme.css
//   node scripts/build.mjs --check   exit 1 if theme.css is stale

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "src", "index.css");
const outPath = join(root, "theme.css");
const { version } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

export function build() {
  const manifest = readFileSync(manifestPath, "utf8");
  const files = [...manifest.matchAll(/@import\s+url\(\s*["']?([^"')]+)["']?\s*\)\s*;/g)].map((m) => m[1]);

  if (files.length === 0) throw new Error("src/index.css lists no @import files");

  const parts = files.map((rel) => {
    const file = join(root, "src", rel);
    if (!existsSync(file)) throw new Error(`src/index.css imports a missing file: ${rel}`);
    return readFileSync(file, "utf8").trim();
  });

  const banner = `/*! Liquid Glass for Jellyfin 12.2 | v${version} | MIT
 * https://github.com/IDLAVS/jellyfin-liquid-glass
 *
 * GENERATED FILE. Do not edit by hand: change src/*.css and run \`npm run build\`.
 * Sources: ${files.join(", ")}
 */
`;

  return banner + "\n" + parts.join("\n\n") + "\n";
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const css = build();
  if (process.argv.includes("--check")) {
    const current = existsSync(outPath) ? readFileSync(outPath, "utf8") : "";
    if (current !== css) {
      console.error("theme.css is out of date. Run `npm run build`.");
      process.exit(1);
    }
    console.log("theme.css is up to date.");
  } else {
    writeFileSync(outPath, css);
    console.log(`theme.css written (${css.length} bytes, ${css.split("\n").length} lines)`);
  }
}
