import { Component, Input } from '@angular/core'
import type { Meta, StoryObj } from '@storybook/angular'
import { injectToast, ToastProvider, Toaster } from '@web-loom/foolscap-angular'

@Component({
  selector: 'demo-toast-actions',
  standalone: true,
  template: `
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
      <button type="button" (click)="success()">Success</button>
      <button type="button" (click)="error()">Error</button>
      <button type="button" (click)="withAction()">With description + action</button>
      <button type="button" (click)="warning()">Warning</button>
      <button type="button" (click)="toast.dismissAll()">Dismiss all</button>
    </div>
  `,
})
class DemoToastActions {
  readonly toast = injectToast()

  success(): void {
    this.toast.add({ title: 'Saved successfully', type: 'success' })
  }

  error(): void {
    this.toast.add({ title: 'Something went wrong', type: 'error' })
  }

  withAction(): void {
    this.toast.add({
      title: 'File uploaded',
      description: 'profile-photo.jpg has been saved.',
      type: 'info',
      action: { label: 'Undo', onClick: () => this.toast.dismissAll() },
    })
  }

  warning(): void {
    this.toast.add({ title: 'Heads up', type: 'warning' })
  }
}

@Component({
  selector: 'demo-toast',
  standalone: true,
  imports: [ToastProvider, Toaster, DemoToastActions],
  template: `
    <fc-toast-provider [defaultDuration]="4000">
      <fc-toaster [position]="position"></fc-toaster>
      <demo-toast-actions></demo-toast-actions>
    </fc-toast-provider>
  `,
})
class DemoToast {
  @Input() position: 'top' | 'top-right' | 'bottom-right' | 'bottom' = 'bottom-right'
}

const meta = {
  title: 'Tier 3/Toast',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { story: { height: '120px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const BottomRight: Story = {
  render: () => ({
    moduleMetadata: { imports: [DemoToast] },
    template: `<demo-toast position="bottom-right"></demo-toast>`,
  }),
}

export const TopRight: Story = {
  render: () => ({
    moduleMetadata: { imports: [DemoToast] },
    template: `<demo-toast position="top-right"></demo-toast>`,
  }),
}
