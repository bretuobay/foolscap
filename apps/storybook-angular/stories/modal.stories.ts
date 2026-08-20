import { Component, Input } from '@angular/core'
import type { Meta, StoryObj } from '@storybook/angular'
import {
  Button,
  Modal,
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@web-loom/foolscap-angular'

@Component({
  selector: 'demo-modal',
  standalone: true,
  imports: [Button, Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, ModalClose],
  template: `
    <button fc-button (click)="open = true">Open modal</button>
    <dialog
      fc-modal
      [open]="open"
      [variant]="variant"
      [size]="size"
      (close)="open = false"
    >
      <div fc-modal-header style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;padding:1rem 1.5rem;border-bottom:1px solid var(--fc-grey-200)">
        <h2 fc-modal-title>{{ title }}</h2>
        <button fc-modal-close style="border:0;background:transparent;cursor:pointer;font-size:1.25rem">×</button>
      </div>
      <div fc-modal-body style="padding:1.5rem">{{ description }}</div>
      <div fc-modal-footer style="display:flex;justify-content:flex-end;gap:0.5rem;padding:1rem 1.5rem;border-top:1px solid var(--fc-grey-200)">
        <button fc-button variant="ghost" (click)="open = false">Cancel</button>
        <button fc-button [variant]="variant === 'alert' ? 'danger' : 'primary'" (click)="open = false">
          {{ footerLabel }}
        </button>
      </div>
    </dialog>
  `,
})
class DemoModal {
  open = false
  @Input() variant: 'default' | 'alert' = 'default'
  @Input() size: 'sm' | 'md' | 'lg' | 'full' = 'md'
  @Input() title = 'Delete project'
  @Input() description = 'Deleting this project cannot be undone.'
  @Input() footerLabel = 'Delete'
}

const meta = {
  title: 'Tier 3/Modal',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { story: { height: '220px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [DemoModal] },
    template: `<demo-modal></demo-modal>`,
  }),
}

export const Alert: Story = {
  render: () => ({
    moduleMetadata: { imports: [DemoModal] },
    template: `<demo-modal variant="alert"></demo-modal>`,
  }),
}
