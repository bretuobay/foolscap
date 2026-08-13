import { defineComponent, h, type PropType } from 'vue'
import { fireEvent, render, screen, within } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useToast } from '../composables/useToast'
import type { Toast } from '@web-loom/foolscap-core'
import { ToastItem, ToastProvider, Toaster } from './Toast'

const AddButton = defineComponent({
  props: {
    title: { type: String, default: 'Hello' },
    description: { type: String, default: undefined },
    type: { type: String as PropType<Toast['type']>, default: undefined },
    duration: { type: Number, default: undefined },
    action: { type: Object as PropType<Toast['action']>, default: undefined },
  },
  setup(props) {
    const toast = useToast()
    return () =>
      h(
        'button',
        {
          type: 'button',
          onClick: () =>
            toast.add({
              title: props.title,
              description: props.description,
              type: props.type,
              duration: props.duration,
              action: props.action,
            }),
        },
        'Add',
      )
  },
})

function renderWithProvider(ui: ReturnType<typeof h> | null, providerProps: { limit?: number; defaultDuration?: number } = {}) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(ToastProvider, providerProps, {
            default: () => [h(Toaster), ui],
          })
      },
    }),
  )
}

describe('ToastProvider + Toaster', () => {
  it('renders the toast region in document.body', () => {
    renderWithProvider(null)
    expect(document.body.querySelector('.fc-toast-region')).toBeInTheDocument()
  })

  it('region has role=region', () => {
    renderWithProvider(null)
    expect(screen.getByRole('region')).toBeInTheDocument()
  })

  it('applies position class', () => {
    render(
      defineComponent({
        setup() {
          return () =>
            h(ToastProvider, null, {
              default: () => h(Toaster, { position: 'top' }),
            })
        },
      }),
    )
    expect(document.body.querySelector('.fc-toast-region--top')).toBeInTheDocument()
  })

  it('defaults to bottom-right position', () => {
    renderWithProvider(null)
    expect(document.body.querySelector('.fc-toast-region--bottom-right')).toBeInTheDocument()
  })
})

describe('useToast + Toaster rendering', () => {
  it('add() causes a toast to appear', async () => {
    const user = userEvent.setup()
    renderWithProvider(h(AddButton, { title: 'Saved!' }))
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Saved!')).toBeInTheDocument()
  })

  it('dismiss() removes the toast', async () => {
    const user = userEvent.setup()
    renderWithProvider(h(AddButton, { title: 'Bye' }))
    await user.click(screen.getByRole('button', { name: 'Add' }))
    const region = document.body.querySelector('.fc-toast-region')
    const dismissBtn = within(region as HTMLElement).getByRole('button', { name: 'Dismiss notification' })
    await user.click(dismissBtn)
    expect(screen.queryByText('Bye')).not.toBeInTheDocument()
  })

  it('dismissAll() removes all toasts', async () => {
    const user = userEvent.setup()
    const Controls = defineComponent({
      setup() {
        const toast = useToast()
        return () => [
          h('button', { onClick: () => { toast.add({ title: 'A' }); toast.add({ title: 'B' }) } }, 'Add Two'),
          h('button', { onClick: () => toast.dismissAll() }, 'Dismiss All'),
        ]
      },
    })
    renderWithProvider(h(Controls))
    await user.click(screen.getByRole('button', { name: 'Add Two' }))
    expect(screen.getByText('A')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Dismiss All' }))
    expect(screen.queryByText('A')).not.toBeInTheDocument()
    expect(screen.queryByText('B')).not.toBeInTheDocument()
  })

  it('useToast().toasts reflects current state', async () => {
    const user = userEvent.setup()
    const CountDisplay = defineComponent({
      setup() {
        const toast = useToast()
        return () => [
          h('button', { onClick: () => toast.add({ title: 'X', duration: 0 }) }, 'Add'),
          h('span', { 'data-testid': 'count' }, String(toast.toasts.length)),
        ]
      },
    })
    renderWithProvider(h(CountDisplay))
    expect(screen.getByTestId('count').textContent).toBe('0')
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByTestId('count').textContent).toBe('1')
  })
})

describe('ToastItem', () => {
  it('renders title', async () => {
    const user = userEvent.setup()
    renderWithProvider(h(AddButton, { title: 'Item title' }))
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Item title')).toBeInTheDocument()
  })

  it('renders description when provided', async () => {
    const user = userEvent.setup()
    renderWithProvider(h(AddButton, { title: 'T', description: 'Extra detail' }))
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Extra detail')).toBeInTheDocument()
  })

  it('does not render description when omitted', async () => {
    const user = userEvent.setup()
    renderWithProvider(h(AddButton, { title: 'T' }))
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(document.querySelector('.fc-toast__description')).not.toBeInTheDocument()
  })

  it('renders action button when provided', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    renderWithProvider(h(AddButton, { title: 'T', action: { label: 'Undo', onClick: onAction } }))
    await user.click(screen.getByRole('button', { name: 'Add' }))
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('applies data-type attribute', async () => {
    const user = userEvent.setup()
    renderWithProvider(h(AddButton, { title: 'T', type: 'error' }))
    await user.click(screen.getByRole('button', { name: 'Add' }))
    const region = document.body.querySelector('.fc-toast-region')
    const toast = (region as HTMLElement).querySelector('.fc-toast')
    expect(toast).toHaveAttribute('data-type', 'error')
  })
})

describe('ToastItem standalone', () => {
  it('renders inside a ToastProvider', () => {
    render(
      defineComponent({
        setup() {
          return () =>
            h(ToastProvider, null, {
              default: () => [
                h(Toaster),
                h(ToastItem, { toast: { id: 'x', title: 'Standalone' } }),
              ],
            })
        },
      }),
    )
    expect(screen.getByText('Standalone')).toBeInTheDocument()
  })
})

describe('auto-dismiss', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('toast is removed after its duration', async () => {
    renderWithProvider(h(AddButton, { title: 'Bye', duration: 1000 }))
    await fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Bye')).toBeInTheDocument()
    await vi.advanceTimersByTimeAsync(1001)
    expect(screen.queryByText('Bye')).not.toBeInTheDocument()
  })
})

describe('ToastProvider outside error', () => {
  it('useToast throws when used outside provider', () => {
    const Bad = defineComponent({
      setup() {
        useToast()
        return () => null
      },
    })
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => render(Bad)).toThrow('useToast must be used inside a ToastProvider')
    err.mockRestore()
    warn.mockRestore()
  })
})
