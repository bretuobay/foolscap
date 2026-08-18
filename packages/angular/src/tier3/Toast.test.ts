import { Component, Input } from '@angular/core'
import { fireEvent, render, screen, within } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Toast } from '@web-loom/foolscap-core'
import { injectToast } from '../bindings/inject-toast'
import { ToastItem, ToastProvider, Toaster } from './Toast'

@Component({
  selector: 'demo-add-toast',
  standalone: true,
  template: `<button type="button" (click)="add()">Add</button>`,
})
class AddButton {
  private readonly toast = injectToast()

  @Input() title = 'Hello'
  @Input() description?: string
  @Input() type?: Toast['type']
  @Input() duration?: number
  @Input() action?: Toast['action']

  add(): void {
    this.toast.add({
      title: this.title,
      description: this.description,
      type: this.type,
      duration: this.duration,
      action: this.action,
    })
  }
}

const providerImports = [ToastProvider, Toaster, AddButton, ToastItem]

describe('ToastProvider + Toaster', () => {
  it('renders the toast region in document.body', async () => {
    await render(
      `<fc-toast-provider><fc-toaster></fc-toaster></fc-toast-provider>`,
      { imports: providerImports },
    )
    expect(document.body.querySelector('.fc-toast-region')).toBeInTheDocument()
  })

  it('region has role=region', async () => {
    await render(
      `<fc-toast-provider><fc-toaster></fc-toaster></fc-toast-provider>`,
      { imports: providerImports },
    )
    expect(screen.getByRole('region')).toBeInTheDocument()
  })

  it('applies position class', async () => {
    await render(
      `<fc-toast-provider><fc-toaster position="top"></fc-toaster></fc-toast-provider>`,
      { imports: providerImports },
    )
    expect(document.body.querySelector('.fc-toast-region--top')).toBeInTheDocument()
  })

  it('defaults to bottom-right position', async () => {
    await render(
      `<fc-toast-provider><fc-toaster></fc-toaster></fc-toast-provider>`,
      { imports: providerImports },
    )
    expect(document.body.querySelector('.fc-toast-region--bottom-right')).toBeInTheDocument()
  })
})

describe('useToast + Toaster rendering', () => {
  it('add() causes a toast to appear', async () => {
    const user = userEvent.setup()
    await render(
      `<fc-toast-provider>
        <fc-toaster></fc-toaster>
        <demo-add-toast title="Saved!"></demo-add-toast>
      </fc-toast-provider>`,
      { imports: providerImports },
    )
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Saved!')).toBeInTheDocument()
  })

  it('dismiss() removes the toast', async () => {
    const user = userEvent.setup()
    await render(
      `<fc-toast-provider>
        <fc-toaster></fc-toaster>
        <demo-add-toast title="Bye"></demo-add-toast>
      </fc-toast-provider>`,
      { imports: providerImports },
    )
    await user.click(screen.getByRole('button', { name: 'Add' }))
    const region = document.body.querySelector('.fc-toast-region')
    const dismissBtn = within(region as HTMLElement).getByRole('button', { name: 'Dismiss notification' })
    await user.click(dismissBtn)
    expect(screen.queryByText('Bye')).not.toBeInTheDocument()
  })

  it('dismissAll() removes all toasts', async () => {
    const user = userEvent.setup()

    @Component({
      selector: 'demo-toast-controls',
      standalone: true,
      template: `
        <button type="button" (click)="addTwo()">Add Two</button>
        <button type="button" (click)="dismissAll()">Dismiss All</button>
      `,
    })
    class Controls {
      private readonly toast = injectToast()
      addTwo(): void {
        this.toast.add({ title: 'A' })
        this.toast.add({ title: 'B' })
      }
      dismissAll(): void {
        this.toast.dismissAll()
      }
    }

    await render(
      `<fc-toast-provider>
        <fc-toaster></fc-toaster>
        <demo-toast-controls></demo-toast-controls>
      </fc-toast-provider>`,
      { imports: [...providerImports, Controls] },
    )
    await user.click(screen.getByRole('button', { name: 'Add Two' }))
    expect(screen.getByText('A')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Dismiss All' }))
    expect(screen.queryByText('A')).not.toBeInTheDocument()
    expect(screen.queryByText('B')).not.toBeInTheDocument()
  })

  it('useToast().toasts reflects current state', async () => {
    const user = userEvent.setup()

    @Component({
      selector: 'demo-toast-count',
      standalone: true,
      template: `
        <button type="button" (click)="add()">Add</button>
        <span data-testid="count">{{ toast.toasts.length }}</span>
      `,
    })
    class CountDisplay {
      readonly toast = injectToast()
      add(): void {
        this.toast.add({ title: 'X', duration: 0 })
      }
    }

    await render(
      `<fc-toast-provider>
        <fc-toaster></fc-toaster>
        <demo-toast-count></demo-toast-count>
      </fc-toast-provider>`,
      { imports: [...providerImports, CountDisplay] },
    )
    expect(screen.getByTestId('count').textContent).toBe('0')
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByTestId('count').textContent).toBe('1')
  })
})

describe('ToastItem', () => {
  it('renders title', async () => {
    const user = userEvent.setup()
    await render(
      `<fc-toast-provider>
        <fc-toaster></fc-toaster>
        <demo-add-toast title="Item title"></demo-add-toast>
      </fc-toast-provider>`,
      { imports: providerImports },
    )
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Item title')).toBeInTheDocument()
  })

  it('renders description when provided', async () => {
    const user = userEvent.setup()
    await render(
      `<fc-toast-provider>
        <fc-toaster></fc-toaster>
        <demo-add-toast title="T" description="Extra detail"></demo-add-toast>
      </fc-toast-provider>`,
      { imports: providerImports },
    )
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Extra detail')).toBeInTheDocument()
  })

  it('does not render description when omitted', async () => {
    const user = userEvent.setup()
    await render(
      `<fc-toast-provider>
        <fc-toaster></fc-toaster>
        <demo-add-toast title="T"></demo-add-toast>
      </fc-toast-provider>`,
      { imports: providerImports },
    )
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(document.querySelector('.fc-toast__description')).not.toBeInTheDocument()
  })

  it('renders action button when provided', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    await render(
      `<fc-toast-provider>
        <fc-toaster></fc-toaster>
        <demo-add-toast title="T" [action]="action"></demo-add-toast>
      </fc-toast-provider>`,
      {
        imports: providerImports,
        componentProperties: { action: { label: 'Undo', onClick: onAction } },
      },
    )
    await user.click(screen.getByRole('button', { name: 'Add' }))
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('applies data-type attribute', async () => {
    const user = userEvent.setup()
    await render(
      `<fc-toast-provider>
        <fc-toaster></fc-toaster>
        <demo-add-toast title="T" type="error"></demo-add-toast>
      </fc-toast-provider>`,
      { imports: providerImports },
    )
    await user.click(screen.getByRole('button', { name: 'Add' }))
    const region = document.body.querySelector('.fc-toast-region')
    const toast = (region as HTMLElement).querySelector('.fc-toast')
    expect(toast).toHaveAttribute('data-type', 'error')
  })
})

describe('ToastItem standalone', () => {
  it('renders inside a ToastProvider', async () => {
    await render(
      `<fc-toast-provider>
        <fc-toaster></fc-toaster>
        <fc-toast-item [toast]="toast"></fc-toast-item>
      </fc-toast-provider>`,
      {
        imports: providerImports,
        componentProperties: { toast: { id: 'x', title: 'Standalone' } },
      },
    )
    expect(screen.getByText('Standalone')).toBeInTheDocument()
  })
})

describe('auto-dismiss', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('toast is removed after its duration', async () => {
    const { fixture } = await render(
      `<fc-toast-provider>
        <fc-toaster></fc-toaster>
        <demo-add-toast title="Bye" [duration]="1000"></demo-add-toast>
      </fc-toast-provider>`,
      { imports: providerImports },
    )
    await fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Bye')).toBeInTheDocument()
    await vi.advanceTimersByTimeAsync(1001)
    fixture.detectChanges()
    expect(screen.queryByText('Bye')).not.toBeInTheDocument()
  })
})

describe('ToastProvider outside error', () => {
  it('useToast throws when used outside provider', async () => {
    @Component({
      standalone: true,
      selector: 'demo-bad-toast',
      template: '',
    })
    class Bad {
      readonly kind = 'outside'
      constructor() {
        injectToast()
      }
    }

    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await expect(render(Bad)).rejects.toThrow('useToast must be used inside a ToastProvider')
    err.mockRestore()
    warn.mockRestore()
  })
})
