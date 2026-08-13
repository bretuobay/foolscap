import { defineComponent, h, nextTick, ref, type PropType } from 'vue'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Button } from '../tier1/Button'
import { Modal, ModalBody, ModalClose, ModalFooter, ModalHeader, ModalTitle } from './Modal'

const ModalFixture = defineComponent({
  props: {
    open: { type: Boolean, default: true },
    variant: { type: String, default: 'default' },
    animationDuration: { type: Number, default: 0 },
    onClose: { type: Function as PropType<() => void>, default: undefined },
  },
  setup(props) {
    return () =>
      h(Modal, {
        open: props.open,
        variant: props.variant as 'default' | 'alert',
        animationDuration: props.animationDuration,
        onClose: props.onClose,
      }, {
        default: () => [
          h(ModalHeader, null, {
            default: () => [
              h(ModalTitle, null, { default: () => 'Delete project' }),
              h(ModalClose, null, { default: () => 'Close' }),
            ],
          }),
          h(ModalBody, null, {
            default: () => h('p', null, 'Deleting this project cannot be undone.'),
          }),
          h(ModalFooter, null, {
            default: () => h(Button, { variant: 'danger' }, { default: () => 'Delete' }),
          }),
        ],
      })
  },
})

function renderModal(props: { open?: boolean; variant?: string; onClose?: () => void } = {}) {
  const onClose = props.onClose ?? vi.fn()
  const result = render(ModalFixture, {
    props: { open: props.open ?? true, variant: props.variant ?? 'default', onClose },
  })
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
    const body = screen.getByText('Deleting this project cannot be undone.').closest('.fc-modal__body')
    await waitFor(() => {
      expect(dialog).toHaveAttribute('aria-labelledby', title.id)
      expect(dialog).toHaveAttribute('aria-describedby', body?.id)
    })
  })

  it('closes from the close button and calls onClose once', async () => {
    const { dialog, onClose } = renderModal()
    await waitFor(() => expect(dialog).toHaveAttribute('open'))
    await fireEvent.click(screen.getByRole('button', { name: 'Close modal' }))
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1)
      expect(dialog).not.toHaveAttribute('open')
    })
  })

  it('closes when the backdrop is clicked', async () => {
    const { dialog, onClose } = renderModal()
    await waitFor(() => expect(dialog).toHaveAttribute('open'))
    await fireEvent.click(dialog)
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1)
      expect(dialog).not.toHaveAttribute('open')
    })
  })

  it('returns focus to the trigger after close', async () => {
    const Wrapper = defineComponent({
      setup() {
        const open = ref(false)
        return () => [
          h('button', { type: 'button' }, 'Launch'),
          h(Modal, { open: open.value, onClose: () => { open.value = false }, animationDuration: 0 }, {
            default: () => [
              h(ModalHeader, null, {
                default: () => [
                  h(ModalTitle, null, { default: () => 'Dialog' }),
                  h(ModalClose, null, { default: () => 'Close' }),
                ],
              }),
              h(ModalBody, null, { default: () => 'Body' }),
            ],
          }),
          h('button', { type: 'button', onClick: () => { open.value = true } }, 'Open'),
        ]
      },
    })

    render(Wrapper)
    await nextTick()
    const trigger = screen.getByRole('button', { name: 'Launch' })
    trigger.focus()
    await fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    await waitFor(() => expect(document.body.querySelector('dialog')).toHaveAttribute('open'))
    await fireEvent.click(screen.getByRole('button', { name: 'Close modal' }))
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
