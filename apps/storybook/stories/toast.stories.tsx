import type { Meta, StoryObj } from '@storybook/react'
import { ToastProvider, Toaster, useToast } from '@web-loom/foolscap-react'

const meta = {
  title: 'React/Toast',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { story: { height: '120px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

function Demo({
  position = 'bottom-right',
}: {
  position?: React.ComponentProps<typeof Toaster>['position']
}) {
  const toast = useToast()
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      <Toaster position={position} />
      <button type="button" onClick={() => toast.add({ title: 'Saved successfully', type: 'success' })}>
        Success
      </button>
      <button type="button" onClick={() => toast.add({ title: 'Something went wrong', type: 'error' })}>
        Error
      </button>
      <button type="button" onClick={() =>
        toast.add({
          title: 'File uploaded',
          description: 'profile-photo.jpg has been saved.',
          type: 'info',
          action: { label: 'Undo', onClick: () => toast.dismissAll() },
        })
      }>
        With description + action
      </button>
      <button type="button" onClick={() => toast.add({ title: 'Heads up', type: 'warning' })}>
        Warning
      </button>
      <button type="button" onClick={() => toast.dismissAll()}>
        Dismiss all
      </button>
    </div>
  )
}

export const BottomRight: Story = {
  render: () => (
    <ToastProvider defaultDuration={4000}>
      <Demo position="bottom-right" />
    </ToastProvider>
  ),
}

export const TopRight: Story = {
  render: () => (
    <ToastProvider defaultDuration={4000}>
      <Demo position="top-right" />
    </ToastProvider>
  ),
}

export const NoDismiss: Story = {
  name: 'Persistent (no auto-dismiss)',
  render: () => (
    <ToastProvider defaultDuration={0}>
      <Demo />
    </ToastProvider>
  ),
}
