import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  DropdownMenuContent,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from './DropdownMenu'

const ITEMS = [
  { value: 'edit', label: 'Edit' },
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'separator', label: '', separator: true },
  { value: 'delete', label: 'Delete', disabled: true },
]

function renderDropdown(onSelect = vi.fn()) {
  return {
    onSelect,
    ...render(
      <DropdownMenuRoot items={ITEMS} onSelect={onSelect}>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent />
      </DropdownMenuRoot>
    ),
  }
}

describe('DropdownMenu', () => {
  it('renders closed by default', () => {
    renderDropdown()
    expect(document.querySelector('.fc-dropdown-menu')).toHaveAttribute('data-state', 'closed')
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveAttribute(
      'aria-haspopup',
      'menu'
    )
    expect(screen.getByRole('menu', { hidden: true })).toHaveAttribute('hidden')
  })

  it('opens on trigger click', async () => {
    const user = userEvent.setup()
    renderDropdown()
    await user.click(screen.getByRole('button', { name: 'Actions' }))
    expect(document.querySelector('.fc-dropdown-menu')).toHaveAttribute('data-state', 'open')
    expect(screen.getByRole('menu')).not.toHaveAttribute('hidden')
  })

  it('selects an item and closes', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    renderDropdown(onSelect)

    await user.click(screen.getByRole('button', { name: 'Actions' }))
    await user.click(screen.getByRole('menuitem', { name: 'Duplicate' }))

    expect(onSelect).toHaveBeenCalledWith(ITEMS[1])
    expect(document.querySelector('.fc-dropdown-menu')).toHaveAttribute('data-state', 'closed')
  })

  it('opens and navigates with keyboard', async () => {
    const user = userEvent.setup()
    renderDropdown()
    const trigger = screen.getByRole('button', { name: 'Actions' })

    trigger.focus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus()
  })

  it('marks disabled items', async () => {
    const user = userEvent.setup()
    renderDropdown()
    await user.click(screen.getByRole('button', { name: 'Actions' }))
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute(
      'aria-disabled',
      'true'
    )
  })
})
