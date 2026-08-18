import { render, screen, waitFor } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Drawer, DrawerBody, DrawerClose, DrawerHeader, DrawerTitle } from './Drawer'

const drawerImports = [Drawer, DrawerHeader, DrawerTitle, DrawerBody, DrawerClose]

const drawerTemplate = `
  <fc-drawer [open]="open" [animationDuration]="0" (openChange)="onOpenChange($event)">
    <div fc-drawer-header>
      <h2 fc-drawer-title>Filters</h2>
      <button fc-drawer-close></button>
    </div>
    <div fc-drawer-body>Drawer body</div>
  </fc-drawer>
`

afterEach(() => {
  document.body.style.overflow = ''
})

describe('Drawer', () => {
  it('renders closed by default', async () => {
    await render(drawerTemplate, {
      imports: drawerImports,
      componentProperties: { open: false, onOpenChange: () => undefined },
    })
    const root = document.body.querySelector('.fc-drawer')
    expect(root).toBeInTheDocument()
    expect(root).toHaveAttribute('data-state', 'closed')
    expect(root).toHaveAttribute('data-side', 'right')
    expect(screen.getByRole('button', { name: 'Close drawer', hidden: true })).toBeInTheDocument()
    expect(document.body.querySelector('.fc-drawer__overlay')).toBeInTheDocument()
  })

  it('opens the panel when open=true', async () => {
    await render(drawerTemplate, {
      imports: drawerImports,
      componentProperties: { open: true, onOpenChange: () => undefined },
    })
    const dialog = document.body.querySelector('dialog') as HTMLDialogElement
    await waitFor(() => expect(dialog).toHaveAttribute('open'))
    await waitFor(() => expect(document.body.querySelector('.fc-drawer')).toHaveAttribute('data-state', 'open'))
    expect(screen.getByRole('heading', { name: 'Filters' })).toBeInTheDocument()
  })

  it('closes from the close button and emits openChange', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    await render(drawerTemplate, {
      imports: drawerImports,
      componentProperties: { open: true, onOpenChange },
    })
    await waitFor(() => expect(document.body.querySelector('.fc-drawer')).toHaveAttribute('data-state', 'open'))
    await user.click(screen.getByRole('button', { name: 'Close drawer' }))
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
  })
})
