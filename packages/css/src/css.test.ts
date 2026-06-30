import { readFile, readdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const src = join(root, 'src')

async function collectCssFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectCssFiles(full)))
    } else if (entry.name.endsWith('.css') && entry.name !== 'css.test.ts') {
      files.push(full)
    }
  }
  return files
}

describe('CSS layer declarations', () => {
  it('index.css declares all three cascade layers', async () => {
    const index = await readFile(join(src, 'index.css'), 'utf-8')
    expect(index).toContain('foolscap.reset')
    expect(index).toContain('foolscap.classless')
    expect(index).toContain('foolscap.components')
  })
})

describe('CSS token usage', () => {
  it('no component file contains hard-coded hex colours', async () => {
    const componentDir = join(src, 'components')
    const files = await collectCssFiles(componentDir)
    const hexPattern = /#[0-9a-fA-F]{3,8}\b/

    const violations: string[] = []
    for (const file of files) {
      const content = await readFile(file, 'utf-8')
      if (hexPattern.test(content)) {
        violations.push(file.replace(root, ''))
      }
    }
    expect(violations).toEqual([])
  })

  it('no component file contains hard-coded spacing px values (>= 20px outside media queries)', async () => {
    const componentDir = join(src, 'components')
    const files = await collectCssFiles(componentDir)
    // Flag large px values that should use spacing tokens, excluding:
    // - lines inside @media queries (breakpoints are acceptable)
    // - lines that are CSS custom property declarations (--fc-*)
    // - small structural px values (< 20px) used for borders, geometry, focus rings
    const largePxPattern = /(?<![0-9])(?:[2-9]\d+|[1-9]\d{2,})px/

    const violations: string[] = []
    for (const file of files) {
      const content = await readFile(file, 'utf-8')
      const lines = content.split('\n')
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (line.trimStart().startsWith('@media')) continue
        if (/--[\w-]+\s*:/.test(line)) continue
        if (largePxPattern.test(line)) {
          violations.push(`${file.replace(root, '')}:${i + 1}`)
        }
      }
    }
    expect(violations).toEqual([])
  })
})

describe('CSS layer wrapping', () => {
  it('every component CSS file wraps rules in @layer foolscap.components', async () => {
    const componentDir = join(src, 'components')
    const files = await collectCssFiles(componentDir)
    const missing: string[] = []

    for (const file of files) {
      const content = await readFile(file, 'utf-8')
      if (!content.includes('@layer foolscap.components')) {
        missing.push(file.replace(root, ''))
      }
    }
    expect(missing).toEqual([])
  })

  it('every classless CSS file wraps rules in @layer foolscap.classless', async () => {
    const classlessDir = join(src, 'classless')
    const files = await collectCssFiles(classlessDir)
    const missing: string[] = []

    for (const file of files) {
      const content = await readFile(file, 'utf-8')
      if (!content.includes('@layer foolscap.classless') && !content.includes('@layer foolscap.reset')) {
        missing.push(file.replace(root, ''))
      }
    }
    expect(missing).toEqual([])
  })
})

describe('CSS accessibility', () => {
  it('animated components include prefers-reduced-motion override', async () => {
    const animatedComponents = [
      'components/spinner.css',
      'components/skeleton.css',
      'components/progress-bar.css',
      'components/button.css',
      'components/link.css',
      'components/skip-link.css',
    ]

    for (const rel of animatedComponents) {
      const content = await readFile(join(src, rel), 'utf-8')
      expect(content, `${rel} missing reduced-motion media query`).toContain(
        'prefers-reduced-motion'
      )
    }
  })

  it('interactive components have focus-visible styles', async () => {
    const interactive = [
      'components/button.css',
      'components/text-input.css',
      'components/textarea.css',
      'components/checkbox.css',
      'components/radio-button.css',
      'components/link.css',
    ]

    for (const rel of interactive) {
      const content = await readFile(join(src, rel), 'utf-8')
      expect(content, `${rel} missing :focus-visible`).toContain('focus-visible')
    }
  })
})
