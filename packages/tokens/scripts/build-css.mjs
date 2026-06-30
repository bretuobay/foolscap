#!/usr/bin/env node
/**
 * Build script: converts W3C Design Token JSON files to CSS custom properties.
 * Output: packages/tokens/dist/tokens.css
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(__dirname, '..')
const SRC_DIR = resolve(PKG_ROOT, 'src')
const OUT_DIR = resolve(PKG_ROOT, 'dist')
const OUT_FILE = resolve(OUT_DIR, 'tokens.css')

const TOKEN_FILES = [
  'palette.tokens.json',
  'spacing.tokens.json',
  'typography.tokens.json',
  'motion.tokens.json',
  'radius.tokens.json',
  'shadow.tokens.json',
]

function processTokenFile(filePath) {
  const raw = readFileSync(filePath, 'utf8')
  const tokens = JSON.parse(raw)
  const lines = []

  for (const [name, token] of Object.entries(tokens)) {
    if (typeof token !== 'object' || token === null || !('$value' in token)) {
      console.warn(`Skipping invalid token entry: ${name}`)
      continue
    }
    lines.push(`  --fc-${name}: ${token.$value};`)
  }

  return lines
}

function build() {
  mkdirSync(OUT_DIR, { recursive: true })

  const allLines = []
  for (const fileName of TOKEN_FILES) {
    const filePath = resolve(SRC_DIR, fileName)
    try {
      const lines = processTokenFile(filePath)
      allLines.push(`  /* ${fileName} */`, ...lines, '')
    } catch (err) {
      if (err.code === 'ENOENT') {
        continue
      }
      throw err
    }
  }

  const css = [
    '/* Auto-generated - do not edit. Run: node scripts/build-css.mjs */',
    ':root {',
    ...allLines,
    '}',
    '',
  ].join('\n')

  writeFileSync(OUT_FILE, css, 'utf8')
  console.log(`Tokens CSS written to: ${OUT_FILE}`)
}

build()
