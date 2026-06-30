import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import * as tokens from './index'

const __dirname = resolve(fileURLToPath(new URL('.', import.meta.url)))
const css = readFileSync(resolve(__dirname, '../dist/tokens.css'), 'utf8')

describe('tokens.css', () => {
  it('contains a :root block', () => {
    expect(css).toContain(':root {')
  })

  it('outputs the core palette variables', () => {
    expect(css).toContain('--fc-paper: #FBFBF9')
    expect(css).toContain('--fc-paper-raised: #FFFFFF')
    expect(css).toContain('--fc-ink: #1A1A1A')
    expect(css).toContain('--fc-ink-muted: #5C5C5C')
  })

  it('outputs all grey scale variables', () => {
    for (const n of [100, 200, 300, 400, 500, 600, 700, 800, 900]) {
      expect(css).toContain(`--fc-grey-${n}:`)
    }
  })

  it('outputs spacing variables', () => {
    expect(css).toContain('--fc-space-1: 0.25rem')
    expect(css).toContain('--fc-space-4: 1rem')
    expect(css).toContain('--fc-space-16: 4rem')
  })

  it('outputs fluid type scale with clamp()', () => {
    expect(css).toContain('--fc-text-base: clamp(')
    expect(css).toContain('--fc-text-5xl: clamp(')
  })

  it('outputs font family stacks', () => {
    expect(css).toContain('--fc-font-sans:')
    expect(css).toContain('--fc-font-serif:')
    expect(css).toContain('--fc-font-mono:')
  })

  it('outputs motion tokens', () => {
    expect(css).toContain('--fc-duration-fast: 120ms')
    expect(css).toContain('--fc-duration-base: 200ms')
    expect(css).toContain('--fc-easing-standard: cubic-bezier(')
  })

  it('outputs radius tokens', () => {
    expect(css).toContain('--fc-radius-sm: 2px')
    expect(css).toContain('--fc-radius-full: 9999px')
  })

  it('outputs shadow tokens', () => {
    expect(css).toContain('--fc-shadow-hairline:')
    expect(css).toContain('--fc-shadow-raised:')
  })

  it('contains no hard-coded hex values outside of palette section', () => {
    const lines = css.split('\n')
    const paletteEnd = lines.findIndex((line) => line.includes('spacing.tokens.json'))
    const nonPaletteLines = lines.slice(paletteEnd)
    const hexPattern = /#[0-9A-Fa-f]{3,6}\b/
    const violations = nonPaletteLines.filter(
      (line) => hexPattern.test(line) && !line.trim().startsWith('/*')
    )
    expect(violations).toEqual([])
  })

  it('all --fc-* variables use the correct prefix', () => {
    const varDeclarations = css.match(/--[a-z][a-z0-9-]*:/g) ?? []
    const nonFc = varDeclarations.filter((value) => !value.startsWith('--fc-'))
    expect(nonFc).toEqual([])
  })
})

describe('token name exports', () => {
  it('exports match their CSS variable name', () => {
    expect(tokens.paper).toBe('--fc-paper')
    expect(tokens.paperRaised).toBe('--fc-paper-raised')
    expect(tokens.ink).toBe('--fc-ink')
    expect(tokens.inkMuted).toBe('--fc-ink-muted')
    expect(tokens.space4).toBe('--fc-space-4')
    expect(tokens.textBase).toBe('--fc-text-base')
    expect(tokens.durationFast).toBe('--fc-duration-fast')
    expect(tokens.radiusFull).toBe('--fc-radius-full')
    expect(tokens.shadowHairline).toBe('--fc-shadow-hairline')
  })

  it('all exports are strings starting with --fc-', () => {
    for (const [key, value] of Object.entries(tokens)) {
      expect(typeof value, `token "${key}"`).toBe('string')
      expect(value, `token "${key}"`).toMatch(/^--fc-/)
    }
  })
})
