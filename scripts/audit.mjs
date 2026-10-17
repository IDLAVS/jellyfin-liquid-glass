#!/usr/bin/env node
// Static audit for the theme's CSS. No dependencies.
//   node scripts/audit.mjs
//
// Errors fail the run (exit 1). Warnings are informational.
//
// Checks
//   syntax      unterminated comments/strings, unbalanced {} () [], stray tokens,
//               missing semicolons, empty selectors, malformed declarations
//   at-rules    @media / @supports parameters (known features, units, structure)
//   prefixes    vendor prefixes only from an allow-list, and each prefixed
//               property must sit next to its standard form with the same value
//   selectors   no generated Emotion classes (.css-xxxxx); no :has() in a
//               comma list (an engine without :has() would drop the whole rule)
//   variables   every var(--x) resolves to a declared custom property
//   build       src/ is fully listed in the manifest and theme.css is current

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "./build.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];
const err = (file, line, msg) => errors.push(`${file}:${line}  ${msg}`);
const warn = (file, line, msg) => warnings.push(`${file}:${line}  ${msg}`);

// ---------------------------------------------------------------- tokenizer
function parse(css, file) {
  const rootNode = { prelude: "", line: 1, children: [], decls: [], statements: [] };
  const stack = [rootNode];
  let buf = "";
  let bufLine = 1;
  let line = 1;
  let paren = 0;
  let bracket = 0;

  const top = () => stack[stack.length - 1];
  const push = (ch) => {
    if (buf.trim() === "" && ch.trim() !== "") bufLine = line;
    buf += ch;
  };

  const flushDecl = (atLine) => {
    const text = buf.trim();
    buf = "";
    if (!text) return;
    const node = top();
    if (node === rootNode) {
      rootNode.statements.push({ text, line: atLine });
      return;
    }
    const colon = text.indexOf(":");
    if (colon < 1) {
      err(file, atLine, `malformed declaration: "${text.slice(0, 60)}"`);
      return;
    }
    const prop = text.slice(0, colon).trim();
    let value = text.slice(colon + 1).trim();
    const important = /!\s*important\s*$/i.test(value);
    if (important) value = value.replace(/!\s*important\s*$/i, "").trim();
    node.decls.push({ prop, value, important, line: atLine });
  };

  for (let i = 0; i < css.length; i++) {
    const c = css[i];

    if (c === "/" && css[i + 1] === "*") {
      const end = css.indexOf("*/", i + 2);
      if (end === -1) {
        err(file, line, "unterminated comment");
        return rootNode;
      }
      line += (css.slice(i, end + 2).match(/\n/g) || []).length;
      i = end + 1;
      continue;
    }

    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < css.length && css[j] !== c) {
        if (css[j] === "\\") j++;
        if (css[j] === "\n") {
          err(file, line, "unterminated string");
          break;
        }
        j++;
      }
      push(css.slice(i, j + 1));
      i = j;
      continue;
    }

    if (c === "\n") line++;

    if (c === "(") paren++;
    else if (c === ")") {
      paren--;
      if (paren < 0) {
        err(file, line, "unmatched )");
        paren = 0;
      }
    } else if (c === "[") bracket++;
    else if (c === "]") {
      bracket--;
      if (bracket < 0) {
        err(file, line, "unmatched ]");
        bracket = 0;
      }
    }

    if (c === "{" && paren === 0 && bracket === 0) {
      const node = { prelude: buf.trim(), line: bufLine, children: [], decls: [], statements: [] };
      if (!node.prelude) err(file, line, "block with no selector or at-rule");
      top().children.push(node);
      stack.push(node);
      buf = "";
      continue;
    }

    if (c === "}" && paren === 0 && bracket === 0) {
      flushDecl(bufLine);
      if (stack.length === 1) {
        err(file, line, "unmatched }");
      } else {
        stack.pop();
      }
      continue;
    }

    if (c === ";" && paren === 0 && bracket === 0) {
      flushDecl(bufLine);
      continue;
    }

    push(c);
  }

  if (paren !== 0) err(file, line, "unclosed ( at end of file");
  if (bracket !== 0) err(file, line, "unclosed [ at end of file");
  if (buf.trim()) err(file, bufLine, `trailing text outside a rule: "${buf.trim().slice(0, 60)}"`);
  while (stack.length > 1) {
    const n = stack.pop();
    err(file, n.line, `unclosed block: ${n.prelude.slice(0, 70)}`);
  }
  return rootNode;
}

// -------------------------------------------------------------- at-rule params
const MEDIA_FEATURES = new Set([
  "width", "height", "min-width", "max-width", "min-height", "max-height",
  "orientation", "aspect-ratio", "resolution", "min-resolution", "max-resolution",
  "hover", "any-hover", "pointer", "any-pointer",
  "prefers-reduced-motion", "prefers-reduced-transparency", "prefers-color-scheme",
  "prefers-contrast", "forced-colors", "display-mode", "update",
]);
const LENGTH_FEATURES = new Set(["width", "height", "min-width", "max-width", "min-height", "max-height"]);
const MEDIA_TYPES = new Set(["all", "screen", "print", "not", "only", "and", "or"]);

function splitTop(s, sep) {
  const out = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === sep && depth === 0) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function checkMedia(params, file, line) {
  if (!params.trim()) return err(file, line, "@media with no condition");
  for (const query of splitTop(params, ",")) {
    const q = query.trim();
    if (!q) {
      err(file, line, "@media has an empty query in its list");
      continue;
    }
    // strip "(...)" groups, then what is left must be media-type keywords
    const groups = [...q.matchAll(/\(([^()]*)\)/g)].map((m) => m[1].trim());
    const keywords = q.replace(/\([^()]*\)/g, " ").split(/\s+/).filter(Boolean);
    for (const k of keywords) {
      if (!MEDIA_TYPES.has(k.toLowerCase())) err(file, line, `@media: unexpected word "${k}"`);
    }
    if (q.split("(").length !== q.split(")").length) err(file, line, "@media: unbalanced parentheses");
    for (const g of groups) {
      const m = g.match(/^([a-z-]+)\s*(?::\s*(.+))?$/i);
      if (!m) {
        err(file, line, `@media: cannot parse condition "(${g})"`);
        continue;
      }
      const [, feature, value] = m;
      if (!MEDIA_FEATURES.has(feature)) err(file, line, `@media: unknown feature "${feature}"`);
      if (LENGTH_FEATURES.has(feature) && !/^-?\d*\.?\d+(px|em|rem|vh|vw)$/.test(value || "")) {
        err(file, line, `@media: "${feature}" needs a length with a unit, got "${value}"`);
      }
    }
    if (/\band\s*$|^\s*and\b|\band\s+and\b/i.test(q)) err(file, line, "@media: dangling 'and'");
  }
}

function checkSupports(params, file, line) {
  if (!params.trim()) return err(file, line, "@supports with no condition");
  if (params.split("(").length !== params.split(")").length) {
    return err(file, line, "@supports: unbalanced parentheses");
  }
  // collapse innermost groups until only the and/or/not skeleton is left
  let body = params.replace(/selector\([^)]*\)/g, "(S)");
  for (let prev; prev !== body; ) {
    prev = body;
    body = body.replace(/\([^()]*\)/g, " G ");
  }
  const words = body.split(/\s+/).filter(Boolean);
  if (!words.includes("G")) err(file, line, "@supports: no condition found");
  for (const w of words) {
    if (!["not", "and", "or", "G"].includes(w)) err(file, line, `@supports: unexpected word "${w}"`);
  }
}

// ------------------------------------------------------------------ rule checks
const PREFIX_PROP_ALLOW = {
  "-webkit-backdrop-filter": { standard: "backdrop-filter", why: "Safari/iOS WebKit (incl. the Jellyfin iOS app)" },
  "-webkit-mask-image": { standard: "mask-image", why: "Chromium < 120, Android System WebView, Safari < 15.4" },
  "-webkit-font-smoothing": { standard: null, why: "no standard equivalent (macOS/iOS text rendering)" },
  "-moz-osx-font-smoothing": { standard: null, why: "no standard equivalent (macOS text rendering)" },
};
const PREFIX_SELECTOR_ALLOW = [
  /::-webkit-scrollbar(-thumb|-track)?/,
  /::-webkit-slider-thumb/,
  /::-moz-range-thumb/,
];

const declaredVars = new Set();
const usedVars = new Map();
const stats = { rules: 0, decls: 0, important: 0, files: 0 };

function checkSelectorList(prelude, file, line) {
  const selectors = splitTop(prelude, ",").map((s) => s.trim());
  if (selectors.some((s) => s === "")) err(file, line, `empty selector in list: ${prelude.slice(0, 70)}`);

  if (/\.css-[a-z0-9]{5,}\b/.test(prelude)) {
    err(file, line, `generated Emotion class in selector (unstable across builds): ${prelude.slice(0, 70)}`);
  }

  // A list made only of :has() selectors is all-or-nothing anyway. Mixing them
  // with plain selectors makes an engine without :has() drop the plain ones too.
  const withHas = selectors.filter((s) => s.includes(":has(")).length;
  if (withHas > 0 && withHas < selectors.length) {
    err(file, line, `:has() mixed into a selector list with plain selectors: ${prelude.slice(0, 70)}`);
  }

  const pseudoPrefixed = prelude.match(/::?-(webkit|moz|ms|o)-[a-z-]+/g) || [];
  for (const p of pseudoPrefixed) {
    if (!PREFIX_SELECTOR_ALLOW.some((re) => re.test(p))) err(file, line, `vendor-prefixed selector not allow-listed: ${p}`);
  }
}

function checkDecls(node, file) {
  const seen = new Map();
  for (const d of node.decls) {
    stats.decls++;
    if (d.important) stats.important++;

    if (!/^(--[\w-]+|-?[a-z][a-z-]*)$/i.test(d.prop)) {
      err(file, d.line, `invalid property name "${d.prop}"`);
      continue;
    }
    if (d.value === "") {
      err(file, d.line, `empty value for "${d.prop}"`);
      continue;
    }
    if (/\n\s*[a-z-]+\s*:\s*\S/i.test(d.value) && !d.prop.startsWith("--")) {
      err(file, d.line, `probable missing semicolon inside the value of "${d.prop}"`);
    }
    if (/expression\(|progid:|^behavior$/i.test(d.value + " " + d.prop) || d.prop === "zoom" || d.prop === "-ms-filter") {
      err(file, d.line, `legacy/non-standard feature: ${d.prop}`);
    }

    if (d.prop.startsWith("--")) {
      declaredVars.add(d.prop);
    } else if (/^-(webkit|moz|ms|o)-/.test(d.prop)) {
      const allow = PREFIX_PROP_ALLOW[d.prop];
      if (!allow) {
        err(file, d.line, `deprecated/unneeded vendor prefix: ${d.prop}`);
      } else if (allow.standard) {
        const twin = node.decls.find((x) => x.prop === allow.standard);
        if (!twin) err(file, d.line, `${d.prop} without ${allow.standard} in the same rule`);
        else if (twin.value !== d.value) err(file, d.line, `${d.prop} and ${allow.standard} differ`);
      }
    } else if (PREFIX_PROP_ALLOW["-webkit-" + d.prop]?.standard === d.prop) {
      if (!node.decls.some((x) => x.prop === "-webkit-" + d.prop)) {
        err(file, d.line, `${d.prop} without -webkit-${d.prop} (Safari/iOS needs both)`);
      }
    }

    if (/-(webkit|moz|ms|o)-(box|flex|inline-box|gradient|calc)\b/.test(d.value)) {
      err(file, d.line, `deprecated prefixed value in ${d.prop}: ${d.value.slice(0, 60)}`);
    }

    for (const m of d.value.matchAll(/var\(\s*(--[\w-]+)\s*(,|\))/g)) {
      if (!usedVars.has(m[1])) usedVars.set(m[1], { file, line: d.line });
    }

    const key = d.prop + (d.important ? "!" : "");
    if (seen.has(key) && !d.prop.startsWith("-")) {
      warn(file, d.line, `"${d.prop}" declared twice in one rule (first at line ${seen.get(key)})`);
    }
    seen.set(key, d.line);
  }
}

function walk(node, file, parentAt) {
  for (const child of node.children) {
    const prelude = child.prelude.replace(/\s+/g, " ");
    if (prelude.startsWith("@")) {
      const name = prelude.match(/^@([a-z-]+)/i)?.[1]?.toLowerCase();
      const params = prelude.slice(name.length + 1).trim();
      if (name === "media") checkMedia(params, file, child.line);
      else if (name === "supports") checkSupports(params, file, child.line);
      else if (!["container", "layer", "keyframes", "font-face", "property"].includes(name)) {
        err(file, child.line, `unknown at-rule @${name}`);
      }
      if (child.decls.length && ["media", "supports"].includes(name)) {
        err(file, child.line, `@${name} contains bare declarations (missing selector?)`);
      }
      checkDecls(child, file);
      walk(child, file, name);
    } else {
      stats.rules++;
      checkSelectorList(prelude, file, child.line);
      if (child.decls.length === 0 && child.children.length === 0) warn(file, child.line, `empty rule: ${prelude.slice(0, 60)}`);
      checkDecls(child, file);
      walk(child, file, parentAt);
    }
  }
}

// ------------------------------------------------------------------------ run
function listCss(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? listCss(p) : name.endsWith(".css") ? [p] : [];
  });
}

const srcFiles = listCss(join(root, "src"));
const manifest = readFileSync(join(root, "src", "index.css"), "utf8");

for (const file of srcFiles) {
  const rel = relative(root, file);
  const css = readFileSync(file, "utf8");
  stats.files++;
  const tree = parse(css, rel);
  if (rel === "src/index.css") {
    if (tree.children.length) err(rel, 1, "manifest must contain only @import statements");
    continue;
  }
  walk(tree, rel, null);
  const inManifest = manifest.includes(`./${relative(join(root, "src"), file)}`);
  if (!inManifest) err(rel, 1, "file is not listed in src/index.css, so it is not built into theme.css");
}

// theme.css: must parse cleanly as one document and match a fresh build
let builtCss = "";
try {
  builtCss = build();
  const onDisk = readFileSync(join(root, "theme.css"), "utf8");
  if (onDisk !== builtCss) err("theme.css", 1, "out of date with src/. Run `npm run build`");
  parse(onDisk, "theme.css");
  if (/@import/.test(onDisk.replace(/\/\*[\s\S]*?\*\//g, ""))) err("theme.css", 1, "built file still contains @import");
} catch (e) {
  err("theme.css", 1, e.message);
}

for (const [name, where] of usedVars) {
  if (declaredVars.has(name)) continue;
  if (/^--(jf-|custom-bg$|bgImage$|slideshow-)/.test(name)) continue; // owned by Jellyfin / plugins / the user
  err(where.file, where.line, `var(${name}) is never declared`);
}
for (const name of declaredVars) {
  if (name.startsWith("--jf-")) continue;
  if (!usedVars.has(name) && !builtCss.includes(`var(${name}`)) warn("src", 0, `${name} is declared but never used`);
}

const out = (title, list) => list.length && console.log(`\n${title} (${list.length})\n  ` + list.join("\n  "));
out("ERRORS", errors);
out("WARNINGS", warnings);
console.log(
  `\nAudited ${stats.files} source files: ${stats.rules} rules, ${stats.decls} declarations, ` +
    `${stats.important} !important, ${declaredVars.size} custom properties.`
);
console.log(errors.length ? `FAILED: ${errors.length} error(s)` : "PASSED: no errors");
process.exit(errors.length ? 1 : 0);
