import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@web-loom/foolscap-react'

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '1rem',
  padding: '1rem 1.5rem',
  borderBottom: '1px solid var(--fc-grey-200)',
}

const bodyStyle: CSSProperties = {
  padding: '1.5rem',
  display: 'grid',
  gap: '1rem',
}

const footerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.5rem',
  padding: '1rem 1.5rem',
  borderTop: '1px solid var(--fc-grey-200)',
}

const closeStyle: CSSProperties = {
  border: 0,
  background: 'transparent',
  color: 'var(--fc-ink-muted)',
  cursor: 'pointer',
  fontSize: '1.25rem',
  lineHeight: 1,
  padding: 0,
}

const meta = {
  title: 'React/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { story: { height: '220px' } },
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof Modal>

function Demo({
  variant = 'default',
  size = 'md',
  title = 'Delete project',
  description = 'Deleting this project cannot be undone.',
  footerLabel = 'Delete',
}: {
  variant?: 'default' | 'alert'
  size?: 'sm' | 'md' | 'lg' | 'full'
  title?: string
  description?: string
  footerLabel?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} variant={variant} size={size}>
        <ModalHeader style={headerStyle}>
          <div style={{ minWidth: 0 }}>
            <ModalTitle style={{ margin: 0, fontSize: '1.125rem', lineHeight: 1.25 }}>
              {title}
            </ModalTitle>
          </div>
          <ModalClose style={closeStyle} aria-label="Close modal">
            ×
          </ModalClose>
        </ModalHeader>
        <ModalBody style={bodyStyle}>
          <p style={{ margin: 0 }}>{description}</p>
          <p style={{ margin: 0, color: 'var(--fc-ink-muted)' }}>
            The modal uses the native dialog element, restores focus when it closes, and locks body
            scrolling while open.
          </p>
        </ModalBody>
        <ModalFooter style={footerStyle}>
          <Button
            variant={variant === 'alert' ? 'danger' : 'secondary'}
            onClick={() => setOpen(false)}
          >
            {footerLabel}
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export const Default: Story = {
  render: () => <Demo />,
}

export const Alert: Story = {
  render: () => (
    <Demo
      variant="alert"
      size="sm"
      title="Delete workspace?"
      description="This action removes the workspace and all of its members. There is no undo."
      footerLabel="Delete workspace"
    />
  ),
}

export const Fullscreen: Story = {
  render: () => (
    <Demo
      size="full"
      title="Editing drawer"
      description="Full-screen mode is useful for long, scrollable workflows on smaller displays."
      footerLabel="Save changes"
    />
  ),
}
