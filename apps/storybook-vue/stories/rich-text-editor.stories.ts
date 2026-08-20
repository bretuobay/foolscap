import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h, ref } from 'vue'
import { RichTextEditorRoot } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 3/Rich Text Editor',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: renderStory(() =>
    h(RichTextEditorRoot, {
      defaultValue: '<p>Start typing rich content.</p>',
      placeholder: 'Write content...',
    }),
  ),
}

export const Prefilled: Story = {
  render: renderStory(() =>
    h(RichTextEditorRoot, {
      defaultValue:
        '<h2>Release notes</h2><p><strong>Foolscap</strong> now includes a minimal rich text editor.</p><ul><li>Bold and italic</li><li>Lists and headings</li><li>Links</li></ul>',
      placeholder: 'Write content...',
    }),
  ),
}

const ControlledRichTextEditor = defineComponent({
  setup() {
    const html = ref('<p>Editable content</p>')
    return () =>
      h('div', { style: { display: 'grid', gap: '1rem' } }, [
        h(RichTextEditorRoot, {
          value: html.value,
          onChange: (next: string) => {
            html.value = next
          },
          placeholder: 'Write content...',
        }),
        h('pre', { style: { margin: 0, whiteSpace: 'pre-wrap' } }, html.value),
      ])
  },
})

export const Controlled: Story = {
  render: renderStory(() => h(ControlledRichTextEditor)),
}

export const Disabled: Story = {
  render: renderStory(() =>
    h(RichTextEditorRoot, {
      defaultValue: '<p>This editor is disabled.</p>',
      disabled: true,
      placeholder: 'Write content...',
    }),
  ),
}
