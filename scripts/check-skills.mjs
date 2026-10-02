import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The index must describe what is actually here.
 *
 * A discovery document that drifts from the thing it describes is worse than
 * none, because it is believed — the same rule this package's one governing
 * rule states one level up. A catalogue listing a skill this repo does not ship
 * sends an agent to a 404; one omitting a skill this repo does ship makes it
 * undiscoverable. Both are silent.
 *
 * Plain Node with no dependencies: this package is markdown and JSON, and
 * adding a toolchain to lint markdown and JSON would be the largest thing in
 * it.
 *
 * This checks that the package agrees with ITSELF. Whether the pinned tool and
 * path counts agree with the live FnlOwl API is verified by the product's own
 * test suite, because those facts only exist there.
 */

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const errors = []
const fail = (msg) => errors.push(msg)

const readJson = (path) => JSON.parse(readFileSync(join(ROOT, path), 'utf8'))

const index = readJson('.well-known/skills/index.json')
const plugin = readJson('.claude-plugin/plugin.json')
const pkg = readJson('package.json')
const codexPlugin = readJson('.codex-plugin/plugin.json')
const cursorPlugin = readJson('.cursor-plugin/plugin.json')

for (const path of ['assets/logo.svg', 'install.sh', '.agents/plugins/marketplace.json']) {
  if (!existsSync(join(ROOT, path))) fail(`missing distribution artifact: ${path}`)
}

// ── One version, stated three times ──────────────────────────────────────
// Manifests disagreeing about a version is worse than none carrying one,
// because a reader has no way to tell which is stale.
for (const [name, manifest] of [
  ['.claude-plugin/plugin.json', plugin],
  ['.codex-plugin/plugin.json', codexPlugin],
  ['.cursor-plugin/plugin.json', cursorPlugin],
  ['package.json', pkg],
]) {
  if (index.version !== manifest.version) {
    fail(`version mismatch: index.json says ${index.version}, ${name} says ${manifest.version}`)
  }
}

// ── Folders on disk ──────────────────────────────────────────────────────
const onDisk = readdirSync(join(ROOT, 'skills')).filter((name) =>
  statSync(join(ROOT, 'skills', name)).isDirectory(),
)
const listed = index.skills.map((s) => s.name)

for (const name of onDisk) {
  if (!listed.includes(name)) fail(`skills/${name}/ exists but is not in .well-known/skills/index.json`)
  if (!existsSync(join(ROOT, 'skills', name, 'SKILL.md'))) fail(`skills/${name}/ has no SKILL.md`)
}
for (const name of listed) {
  if (!onDisk.includes(name)) fail(`index.json lists "${name}" but skills/${name}/ does not exist`)
}

// ── Each entry, against the skill it claims to describe ──────────────────
const frontmatterName = (body) => /^---\n(?:.*\n)*?name:\s*(\S+)/m.exec(body)?.[1]

for (const entry of index.skills) {
  const dir = join(ROOT, 'skills', entry.name)
  if (!existsSync(dir)) continue

  if (entry.path !== `skills/${entry.name}/SKILL.md`) {
    fail(`${entry.name}: path is "${entry.path}", expected "skills/${entry.name}/SKILL.md"`)
  }
  if (!existsSync(join(ROOT, entry.path))) fail(`${entry.name}: path "${entry.path}" does not exist`)

  const skill = readFileSync(join(dir, 'SKILL.md'), 'utf8')
  // The frontmatter `name` is what an agent loads the skill BY. A folder named
  // one thing and a frontmatter naming another installs under a name nothing
  // in this repo mentions.
  const declared = frontmatterName(skill)
  if (declared !== entry.name) {
    fail(`${entry.name}: SKILL.md frontmatter says name "${declared ?? '(missing)'}"`)
  }
  if (!/^---\n(?:.*\n)*?description:\s*\S/m.test(skill)) {
    fail(`${entry.name}: SKILL.md has no frontmatter description — that is what an agent matches on`)
  }
  // The metadata receipt that lets a reader tell a stale skill from a current
  // one. A skill without it cannot be checked against the API at all.
  for (const key of ['api', 'openapi_paths', 'mcp_tools']) {
    if (!new RegExp(`^\\s+${key}:\\s*\\S`, 'm').test(skill)) {
      fail(`${entry.name}: SKILL.md authored-against has no "${key}"`)
    }
  }

  // ── Every reference the skill points a reader at ───────────────────────
  // A recipe naming a file that was renamed sends the agent to read nothing
  // and continue anyway, which is the failure this package exists to prevent
  // one level up.
  const docs = walk(dir).filter((f) => f.endsWith('.md'))
  for (const doc of docs) {
    for (const rel of localLinks(readFileSync(doc, 'utf8'))) {
      const target = resolve(dirname(doc), rel)
      if (!existsSync(target)) {
        fail(`${entry.name}: ${doc.slice(ROOT.length + 1)} links to "${rel}", which does not exist`)
      }
    }
  }
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

/**
 * Markdown links to a file in this package. Absolute URLs and anchors are
 * skipped — an `http(s)` target is somebody else's uptime, and checking it here
 * would make this script fail on a network blip.
 */
function localLinks(body) {
  return [...body.matchAll(/\]\(([^)]+)\)/g)]
    .map((m) => m[1].split('#')[0].trim())
    .filter((href) => href !== '' && !/^[a-z]+:/i.test(href) && !href.startsWith('/'))
}

if (errors.length === 0) {
  console.log(`skills: ${onDisk.length} skill${onDisk.length === 1 ? '' : 's'}, index and manifests agree`)
  process.exit(0)
}

console.error(`skills: ${errors.length} problem${errors.length === 1 ? '' : 's'}\n`)
for (const e of errors) console.error(`  ${e}`)
process.exit(1)
