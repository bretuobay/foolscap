import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TreeViewRoot, type TreeViewItem } from './TreeView'

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

describe('TreeView', () => {
  it('renders tree semantics and expanded branch groups', () => {
    render(<TreeViewRoot items={items} defaultExpandedIds={['documents']} label="Files" />)
    expect(screen.getByRole('tree', { name: 'Files' })).toHaveClass('fc-tree')
    expect(screen.getByRole('treeitem', { name: /Documents/ })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('treeitem', { name: /Report.pdf/ })).toHaveAttribute('aria-level', '2')
  })

  it('expands and collapses branches', async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    render(<TreeViewRoot items={items} defaultExpandedIds={[]} onExpandedChange={onExpandedChange} />)
    await user.click(screen.getByRole('button', { name: 'Expand Documents' }))
    expect(screen.getByRole('treeitem', { name: /Documents/ })).toHaveAttribute('aria-expanded', 'true')
    expect(onExpandedChange).toHaveBeenCalledWith(['documents'])
  })

  it('selects an item with keyboard activation', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <TreeViewRoot
        items={items}
        defaultExpandedIds={['documents']}
        onSelectionChange={onSelectionChange}
      />
    )
    screen.getByRole('treeitem', { name: /Documents/ }).focus()
    await user.keyboard('[ArrowDown]')
    const report = screen.getByRole('treeitem', { name: /Report.pdf/ })
    fireEvent.keyDown(report, { key: ' ' })
    await waitFor(() => expect(report).toHaveAttribute('aria-selected', 'true'))
    expect(onSelectionChange).toHaveBeenCalledWith('report')
  })

  it('moves focus with arrow keys and typeahead', async () => {
    const user = userEvent.setup()
    render(<TreeViewRoot items={items} defaultExpandedIds={['documents']} />)
    const documents = screen.getByRole('treeitem', { name: /Documents/ })
    documents.focus()
    await user.keyboard('[ArrowDown]')
    expect(screen.getByRole('treeitem', { name: /Report.pdf/ })).toHaveFocus()
    await user.keyboard('n')
    expect(screen.getByRole('treeitem', { name: /Notes.txt/ })).toHaveFocus()
  })

  it('reflects controlled selected state', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <TreeViewRoot
        items={items}
        defaultExpandedIds={['documents']}
        selectedId="notes"
        onSelectionChange={onSelectionChange}
      />
    )
    await user.click(screen.getByRole('treeitem', { name: /Report.pdf/ }))
    expect(screen.getByRole('treeitem', { name: /Notes.txt/ })).toHaveAttribute('aria-selected', 'true')
    expect(onSelectionChange).toHaveBeenCalledWith('report')
  })
})
