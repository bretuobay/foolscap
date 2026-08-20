import { Component } from '@angular/core'
import { fireEvent, render, screen, waitFor } from '@testing-library/angular'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Button } from '../tier1/Button'
import { Modal, ModalBody, ModalClose, ModalFooter, ModalHeader, ModalTitle } from './Modal'

const modalImports = [Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, ModalClose, Button]

const modalTemplate = `
  <dialog
    fc-modal
    [open]="open"
    [variant]="variant"
    [animationDuration]="0"
    (close)="onClose()"
  >
    <div fc-modal-header>
      <h2 fc-modal-title>Delete project</h2>
      <button fc-modal-close>Close</button>
    </div>
    <div fc-modal-body>
      <p>Deleting this project cannot be undone.</p>
    </div>
    <div fc-modal-footer>
      <button fc-button variant="danger">Delete</button>
    </div>
  </dialog>
`

async function renderModal(props: { open?: boolean; variant?: string; onClose?: () => void } = {}) {
  const onClose = props.onClose ?? vi.fn()
  const result = await render(modalTemplate, {
    imports: modalImports,
    componentProperties: {
      open: props.open ?? true,
      variant: props.variant ?? 'default',
      onClose,
    },
  })
  const dialog = document.body.querySelector('dialog') as HTMLDialogElement
  return { ...result, dialog, onClose }
}

afterEach(() => {
  document.body.style.overflow = ''
  vi.useRealTimers()
})

describe('Modal', () => {
  it('renders a dialog with the expected classes and data attributes', async () => {
    const { dialog } = await renderModal({ open: false })
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveClass('fc-modal')
    expect(dialog).toHaveAttribute('data-state', 'closed')
    expect(dialog).toHaveAttribute('data-variant', 'default')
    expect(dialog).toHaveAttribute('data-size', 'md')
  })

  it('opens the native dialog when open=true', async () => {
    const { dialog } = await renderModal({ open: true })
    await waitFor(() => expect(dialog).toHaveAttribute('open'))
    expect(dialog).toHaveAttribute('data-state', 'open')
  })

  it('wires title and body ids into aria-labelledby / aria-describedby', async () => {
    const { dialog } = await renderModal({ variant: 'alert' })
    const title = screen.getByRole('heading', { name: 'Delete project' })
    const body = screen.getByText('Deleting this project cannot be undone.').closest('.fc-modal__body')
    await waitFor(() => {
      expect(dialog).toHaveAttribute('aria-labelledby', title.id)
      expect(dialog).toHaveAttribute('aria-describedby', body?.id)
    })
  })

  it('closes from the close button and calls onClose once', async () => {
    const { dialog, onClose } = await renderModal()
    await waitFor(() => expect(dialog).toHaveAttribute('open'))
    await fireEvent.click(screen.getByRole('button', { name: 'Close modal' }))
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1)
      expect(dialog).not.toHaveAttribute('open')
    })
  })

  it('closes when the backdrop is clicked', async () => {
    const { dialog, onClose } = await renderModal()
    await waitFor(() => expect(dialog).toHaveAttribute('open'))
    await fireEvent.click(dialog)
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1)
      expect(dialog).not.toHaveAttribute('open')
    })
  })

  it('returns focus to the trigger after close', async () => {
    @Component({
      standalone: true,
      imports: modalImports,
      template: `
        <button type="button">Launch</button>
        <dialog fc-modal [open]="open" [animationDuration]="0" (close)="open = false">
          <div fc-modal-header>
            <h2 fc-modal-title>Dialog</h2>
            <button fc-modal-close>Close</button>
          </div>
          <div fc-modal-body>Body</div>
        </dialog>
        <button type="button" (click)="open = true">Open</button>
      `,
    })
    class Wrapper {
      open = false
    }

    await render(Wrapper)
    const trigger = screen.getByRole('button', { name: 'Launch' })
    trigger.focus()
    await fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    await waitFor(() => expect(document.body.querySelector('dialog')).toHaveAttribute('open'))
    await fireEvent.click(screen.getByRole('button', { name: 'Close modal' }))
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
