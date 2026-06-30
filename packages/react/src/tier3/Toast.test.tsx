import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider, Toaster, ToastItem } from './Toast'
import { useToast } from '../hooks/useToast'

function renderWithProvider(ui: React.ReactNode, providerProps: Omit<React.ComponentProps<typeof ToastProvider>, 'children'> = {}) {
  return render(
    <ToastProvider {...providerProps}>
      <Toaster />
      {ui}
    </ToastProvider>,
  )
}

// Button that imperatively adds a toast — used across many tests
function AddButton({ title = 'Hello', ...rest }: Partial<Parameters<ReturnType<typeof useToast>['add']>[0]> & { title?: string }) {
  const toast = useToast()
  return (
    <button type="button" onClick={() => toast.add({ title, ...rest })}>
      Add
    </button>
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
      <ToastProvider>
        <Toaster position="top" />
      </ToastProvider>,
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
    renderWithProvider(<AddButton title="Saved!" />)
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Saved!')).toBeInTheDocument()
  })

  it('dismiss() removes the toast', async () => {
    const user = userEvent.setup()
    renderWithProvider(<AddButton title="Bye" />)
    await user.click(screen.getByRole('button', { name: 'Add' }))
    const region = document.body.querySelector('.fc-toast-region')
    const dismissBtn = within(region as HTMLElement).getByRole('button', { name: 'Dismiss notification' })
    await user.click(dismissBtn)
    expect(screen.queryByText('Bye')).not.toBeInTheDocument()
  })

  it('dismissAll() removes all toasts', async () => {
    const user = userEvent.setup()
    function Controls() {
      const toast = useToast()
      return (
        <>
          <button onClick={() => { toast.add({ title: 'A' }); toast.add({ title: 'B' }) }}>Add Two</button>
          <button onClick={() => toast.dismissAll()}>Dismiss All</button>
        </>
      )
    }
    renderWithProvider(<Controls />)
    await user.click(screen.getByRole('button', { name: 'Add Two' }))
    expect(screen.getByText('A')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Dismiss All' }))
    expect(screen.queryByText('A')).not.toBeInTheDocument()
    expect(screen.queryByText('B')).not.toBeInTheDocument()
  })

  it('useToast().toasts reflects current state', async () => {
    const user = userEvent.setup()
    function CountDisplay() {
      const { toasts, add } = useToast()
      return (
        <>
          <button onClick={() => add({ title: 'X', duration: 0 })}>Add</button>
          <span data-testid="count">{toasts.length}</span>
        </>
      )
    }
    renderWithProvider(<CountDisplay />)
    expect(screen.getByTestId('count').textContent).toBe('0')
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByTestId('count').textContent).toBe('1')
  })
})

describe('ToastItem', () => {
  it('renders title', async () => {
    const user = userEvent.setup()
    renderWithProvider(<AddButton title="Item title" />)
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Item title')).toBeInTheDocument()
  })

  it('renders description when provided', async () => {
    const user = userEvent.setup()
    renderWithProvider(<AddButton title="T" description="Extra detail" />)
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Extra detail')).toBeInTheDocument()
  })

  it('does not render description when omitted', async () => {
    const user = userEvent.setup()
    renderWithProvider(<AddButton title="T" />)
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(document.querySelector('.fc-toast__description')).not.toBeInTheDocument()
  })

  it('renders action button when provided', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    renderWithProvider(
      <AddButton title="T" action={{ label: 'Undo', onClick: onAction }} />,
    )
    await user.click(screen.getByRole('button', { name: 'Add' }))
    const actionBtn = screen.getByRole('button', { name: 'Undo' })
    await user.click(actionBtn)
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('applies data-type attribute', async () => {
    const user = userEvent.setup()
    renderWithProvider(<AddButton title="T" type="error" />)
    await user.click(screen.getByRole('button', { name: 'Add' }))
    const region = document.body.querySelector('.fc-toast-region')
    const toast = (region as HTMLElement).querySelector('.fc-toast')
    expect(toast).toHaveAttribute('data-type', 'error')
  })
})

describe('ToastItem standalone', () => {
  it('renders inside a ToastProvider', () => {
    render(
      <ToastProvider>
        <Toaster />
        <ToastItem toast={{ id: 'x', title: 'Standalone' }} />
      </ToastProvider>,
    )
    expect(screen.getByText('Standalone')).toBeInTheDocument()
  })
})

describe('auto-dismiss', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('toast is removed after its duration', () => {
    renderWithProvider(<AddButton title="Bye" duration={1000} />)
    // fireEvent is synchronous — safe with fake timers (userEvent.click hangs)
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Add' })))
    expect(screen.getByText('Bye')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(1001))
    expect(screen.queryByText('Bye')).not.toBeInTheDocument()
  })
})

describe('ToastProvider outside error', () => {
  it('useToast throws when used outside provider', () => {
    function Bad() { useToast(); return null }
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Bad />)).toThrow('useToast must be used inside a ToastProvider')
    err.mockRestore()
  })
})
