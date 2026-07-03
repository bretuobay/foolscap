import { afterEach, describe, expect, it, vi } from 'vitest'
import { createTreeView, type TreeViewItem } from './tree-view'
import { fixture } from '../utils/test-helpers'

const items: TreeViewItem[] = [
  {
    id: 'documents',
    label: 'Documents',
    children: [
      { id: 'report', label: 'Report.pdf' },
      { id: 'notes', label: 'Notes.txt' },
    ],
  },
  {
    id: 'images',
    label: 'Images',
    children: [{ id: 'avatar', label: 'Avatar.png' }],
  },
]

describe('createTreeView', () => {
  let cleanup: () => void

  afterEach(() => cleanup?.())

  function setup(opts = {}) {
    const { container, cleanup: c } = fixture(`<ul id="tree"></ul>`)
    cleanup = c
    const rootEl = container.querySelector<HTMLElement>('#tree')!
    const tree = createTreeView({ items, defaultExpandedIds: ['documents'], ...opts })
    tree.setRootEl(rootEl)
    return { tree, rootEl }
  }

  it('exposes tree and treeitem props', () => {
    const { tree } = setup()
    expect(tree.getRootProps()).toMatchObject({ role: 'tree', 'aria-label': 'Tree' })
    expect(tree.getItemProps('documents')).toMatchObject({
      role: 'treeitem',
      'aria-expanded': true,
      'aria-selected': false,
      'aria-level': 1,
      'data-state': 'expanded',
      tabIndex: 0,
    })
    expect(tree.getItemProps('report')).toMatchObject({
      'aria-selected': false,
      'aria-level': 2,
    })
    tree.destroy()
  })

  it('expands and collapses branches with events', () => {
    const onExpandedChange = vi.fn()
    const { tree, rootEl } = setup({ defaultExpandedIds: [], onExpandedChange })
    const details: unknown[] = []
    rootEl.addEventListener('fc:expand', (event) => details.push((event as CustomEvent).detail))
    tree.expand('images')
    expect(tree.state.expandedIds).toEqual(['images'])
    expect(onExpandedChange).toHaveBeenCalledWith(['images'])
    expect(details).toEqual([{ id: 'images' }])
    tree.collapse('images')
    expect(tree.state.expandedIds).toEqual([])
    tree.destroy()
  })

  it('selects enabled items and emits select', () => {
    const onSelectionChange = vi.fn()
    const { tree, rootEl } = setup({ onSelectionChange })
    const details: unknown[] = []
    rootEl.addEventListener('fc:select', (event) => details.push((event as CustomEvent).detail))
    tree.select('report')
    expect(tree.state.selectedId).toBe('report')
    expect(tree.getItemProps('report')['data-state']).toBe('selected')
    expect(onSelectionChange).toHaveBeenCalledWith('report')
    expect(details).toEqual([{ id: 'report' }])
    tree.destroy()
  })

  it('moves focus through visible items only', () => {
    const { tree } = setup()
    const documents = document.createElement('li')
    const report = document.createElement('li')
    const notes = document.createElement('li')
    documents.tabIndex = 0
    report.tabIndex = -1
    notes.tabIndex = -1
    document.body.append(documents, report, notes)
    tree.setItemEl('documents', documents)
    tree.setItemEl('report', report)
    tree.setItemEl('notes', notes)
    tree.getItemProps('documents').onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    expect(tree.state.focusedId).toBe('report')
    expect(document.activeElement).toBe(report)
    tree.getItemProps('report').onKeyDown(new KeyboardEvent('keydown', { key: 'End' }))
    expect(tree.state.focusedId).toBe('images')
    tree.destroy()
  })

  it('implements right and left branch navigation', () => {
    const { tree } = setup({ defaultExpandedIds: [] })
    tree.getItemProps('documents').onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(tree.state.expandedIds).toEqual(['documents'])
    tree.getItemProps('documents').onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(tree.state.focusedId).toBe('report')
    tree.getItemProps('report').onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    expect(tree.state.focusedId).toBe('documents')
    tree.destroy()
  })

  it('supports typeahead', () => {
    const { tree } = setup()
    tree.getItemProps('documents').onKeyDown(new KeyboardEvent('keydown', { key: 'n' }))
    expect(tree.state.focusedId).toBe('notes')
    tree.destroy()
  })

  it('reflects controlled expanded and selected state', () => {
    const { tree } = setup({ expandedIds: ['images'], selectedId: 'avatar' })
    tree.expand('documents')
    tree.select('report')
    expect(tree.state.expandedIds).toEqual(['images'])
    expect(tree.state.selectedId).toBe('avatar')
    expect(tree.getGroupProps('documents').hidden).toBe(true)
    tree.destroy()
  })
})
