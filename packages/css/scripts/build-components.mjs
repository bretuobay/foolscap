#!/usr/bin/env node
/**
 * Copies individual component CSS files from src/ to dist/components/
 * after Vite has built the main foolscap.css bundle.
 */

import { copyFile, mkdir, readdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const srcComponents = join(root, 'src', 'components')
const distComponents = join(root, 'dist', 'components')

async function copyDir(src, dest) {
  await mkdir(dest, { recursive: true })
  const entries = await readdir(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name)
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath)
    } else if (entry.name.endsWith('.css')) {
      await copyFile(srcPath, destPath)
    }
  }
}

await copyDir(srcComponents, distComponents)
console.log('Component CSS files copied to dist/components/')
