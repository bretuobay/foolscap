import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { Button } from '../tier1/Button'
import { Modal, ModalBody, ModalClose, ModalFooter, ModalHeader, ModalTitle } from './Modal'

function renderModal(props: Partial<React.ComponentProps<typeof Modal>> = {}) {
  const onClose = vi.fn()

  const result = render(
    <Modal open={props.open ?? true} onClose={onClose} animationDuration={0} {...props}>
      <ModalHeader>
        <ModalTitle>Delete project</ModalTitle>
        <ModalClose>Close</ModalClose>
      </ModalHeader>
      <ModalBody>
        <p>Deleting this project cannot be undone.</p>
      </ModalBody>
      <ModalFooter>
        <Button variant="danger">Delete</Button>
      </ModalFooter>
    </Modal>
  )

  const dialog = document.body.querySelector('dialog') as HTMLDialogElement

  return { ...result, dialog, onClose }
}

afterEach(() => {
  document.body.style.overflow = ''
  vi.useRealTimers()
})

describe('Modal', () => {
  it('renders a dialog with the expected classes and data attributes', () => {
    const { dialog } = renderModal({ open: false })

    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveClass('fc-modal')
    expect(dialog).toHaveAttribute('data-state', 'closed')
    expect(dialog).toHaveAttribute('data-variant', 'default')
    expect(dialog).toHaveAttribute('data-size', 'md')
  })

  it('opens the native dialog when open=true', async () => {
    const { dialog } = renderModal({ open: true })

    await waitFor(() => expect(dialog).toHaveAttribute('open'))
    expect(dialog).toHaveAttribute('data-state', 'open')
  })

  it('wires title and body ids into aria-labelledby / aria-describedby', async () => {
    const { dialog } = renderModal({ variant: 'alert' })

    const title = screen.getByRole('heading', { name: 'Delete project' })
    const body = screen
      .getByText('Deleting this project cannot be undone.')
      .closest('.fc-modal__body')

    await waitFor(() => {
      expect(dialog).toHaveAttribute('aria-labelledby', title.id)
      expect(dialog).toHaveAttribute('aria-describedby', body?.id)
    })
  })

  it('closes from the close button and calls onClose once', async () => {
    const { dialog, onClose } = renderModal()

    await waitFor(() => expect(dialog).toHaveAttribute('open'))
    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }))

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1)
      expect(dialog).not.toHaveAttribute('open')
    })
  })

  it('closes when the backdrop is clicked', async () => {
    const { dialog, onClose } = renderModal()

    await waitFor(() => expect(dialog).toHaveAttribute('open'))
    fireEvent.click(dialog)

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1)
      expect(dialog).not.toHaveAttribute('open')
    })
  })

  it('returns focus to the trigger after close', async () => {
    function Wrapper() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button type="button">Launch</button>
          <Modal open={open} onClose={() => setOpen(false)} animationDuration={0}>
            <ModalHeader>
              <ModalTitle>Dialog</ModalTitle>
              <ModalClose>Close</ModalClose>
            </ModalHeader>
            <ModalBody>Body</ModalBody>
          </Modal>
          <button type="button" onClick={() => setOpen(true)}>
            Open
          </button>
        </>
      )
    }

    render(<Wrapper />)
    const trigger = screen.getByRole('button', { name: 'Launch' })
    trigger.focus()

    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(document.body.querySelector('dialog')).toHaveAttribute('open')
    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }))

    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
