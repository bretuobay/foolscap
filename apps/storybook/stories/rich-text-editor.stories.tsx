import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RichTextEditorRoot } from '@web-loom/foolscap-react'

const meta = {
  title: 'React/Rich Text Editor',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <RichTextEditorRoot
      defaultValue="<p>Start typing rich content.</p>"
      placeholder="Write content..."
    />
  ),
}

export const Prefilled: Story = {
  render: () => (
    <RichTextEditorRoot
      defaultValue="<h2>Release notes</h2><p><strong>Foolscap</strong> now includes a minimal rich text editor.</p><ul><li>Bold and italic</li><li>Lists and headings</li><li>Links</li></ul>"
      placeholder="Write content..."
    />
  ),
}

export const Controlled: Story = {
  render: function ControlledRichTextEditor() {
    const [html, setHtml] = useState('<p>Editable content</p>')
    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <RichTextEditorRoot value={html} onChange={setHtml} placeholder="Write content..." />
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{html}</pre>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <RichTextEditorRoot
      defaultValue="<p>This editor is disabled.</p>"
      disabled
      placeholder="Write content..."
    />
  ),
}
