import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { FileUpload } from '@web-loom/foolscap-react'
import type { FileUploadError } from '@web-loom/foolscap-react'

const meta = {
  title: 'React/FileUpload',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: '480px' }}>
      <FileUpload label="Drag files here or click to browse" />
    </div>
  ),
}

// ─── With hint and accept ─────────────────────────────────────────────────────

export const WithHint: Story = {
  name: 'With hint',
  render: () => (
    <div style={{ maxWidth: '480px' }}>
      <FileUpload
        accept=".png,.jpg,.pdf"
        label="Upload your document"
        hint="PNG, JPG, or PDF · Max 10 MB"
      />
    </div>
  ),
}

// ─── Multiple files ───────────────────────────────────────────────────────────

export const MultipleFiles: Story = {
  name: 'Multiple files',
  render: () => (
    <div style={{ maxWidth: '480px' }}>
      <FileUpload
        multiple
        label="Drag files here or click to browse"
        hint="Upload multiple files at once"
      />
    </div>
  ),
}

// ─── With error handling ──────────────────────────────────────────────────────

export const WithErrorHandling: Story = {
  name: 'With error handling',
  render: function ErrorDemo() {
    const [error, setError] = useState<string | null>(null)

    const handleError = (err: FileUploadError) => {
      if (err.type === 'size') {
        setError(`${err.file.name} exceeds the 1 MB limit.`)
      } else {
        setError(`${err.file.name} has an unsupported type.`)
      }
    }

    return (
      <div style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <FileUpload
          accept="image/*"
          maxSize={1024 * 1024}
          label="Images only, max 1 MB"
          hint="Try uploading a large or non-image file to trigger an error"
          onError={handleError}
        />
        {error && (
          <p role="alert" style={{ margin: 0, color: 'red', fontSize: '0.875rem' }}>
            {error}
          </p>
        )}
      </div>
    )
  },
}
