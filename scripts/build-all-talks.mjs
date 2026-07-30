#!/usr/bin/env node
// Builds every talk in this repo into a single combined static site for
// GitHub Pages: one Slidev SPA per talk, under /talks/<talk-dir>/, plus a
// generated landing page at the site root linking to each.
//
// A "talk" is any top-level directory containing a slides.md — no manual
// registration needed, so adding a new talk folder is enough to have it
// picked up on the next deploy.
//
// Run locally to preview the combined output before pushing:
//   node scripts/build-all-talks.mjs && npx serve site

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SITE_DIR = join(ROOT, 'site')
// Matches this repo's GitHub Pages project-page path: <user>.github.io/talks/
const PAGES_BASE = process.env.PAGES_BASE ?? '/talks/'

const SKIP = new Set(['node_modules', 'site', '.git', '.github'])

const talks = readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith('.') && !SKIP.has(d.name))
  .map((d) => d.name)
  .filter((name) => existsSync(join(ROOT, name, 'slides.md')))
  .sort()

if (talks.length === 0) {
  console.error('No talk folders found — expected at least one */slides.md')
  process.exit(1)
}

mkdirSync(SITE_DIR, { recursive: true })

const built = []

for (const talk of talks) {
  const dir = join(ROOT, talk)
  const base = `${PAGES_BASE}${talk}/`
  const out = join(SITE_DIR, talk)

  console.log(`\n=== ${talk} (base ${base}) ===`)
  execSync('pnpm install --frozen-lockfile', { cwd: dir, stdio: 'inherit' })
  execSync(
    [
      'pnpm exec slidev build slides.md',
      `--base "${base}"`,
      `--out "${out}"`,
      '--router-mode hash', // subdirectory-safe routing, no server rewrites needed
      // Notes ship in the public build on purpose: once a talk's repo is
      // public, its slides.md (notes included) is already readable on
      // GitHub, so stripping them here buys no privacy — it only breaks
      // presenter mode on the live URL. Add --without-notes back per-talk
      // if a repo is ever kept private specifically to protect notes.
    ].join(' '),
    { cwd: dir, stdio: 'inherit' },
  )

  let title = talk
  try {
    const frontmatter = readFileSync(join(dir, 'slides.md'), 'utf8')
    const match = frontmatter.match(/^title:\s*(.+)$/m)
    if (match) title = match[1].trim()
  } catch {
    // fall back to the folder name
  }

  built.push({ talk, title, base })
}

const rows = built
  .map(
    ({ talk, title, base }) =>
      `      <li><a href="${base}">${title}</a><span class="path">${talk}</span></li>`,
  )
  .join('\n')

writeFileSync(
  join(SITE_DIR, 'index.html'),
  `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Talks</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    :root { color-scheme: dark; }
    body {
      background: #111; color: #eee; margin: 0;
      font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
    }
    main { max-width: 40rem; margin: 4rem auto; padding: 0 1.5rem; }
    h1 { font-weight: 600; letter-spacing: -0.01em; }
    ul { list-style: none; padding: 0; margin: 2rem 0 0; }
    li {
      display: flex; justify-content: space-between; align-items: baseline;
      padding: 0.9rem 0; border-bottom: 1px solid #292929; gap: 1rem;
    }
    a { color: #eee; text-decoration: none; font-size: 1.1rem; }
    a:hover { text-decoration: underline; }
    .path { color: #888; font-family: ui-monospace, monospace; font-size: 0.78rem; white-space: nowrap; }
  </style>
</head>
<body>
  <main>
    <h1>Talks</h1>
    <ul>
${rows}
    </ul>
  </main>
</body>
</html>
`,
)

console.log(`\nBuilt ${built.length} talk(s) into ${SITE_DIR}`)
