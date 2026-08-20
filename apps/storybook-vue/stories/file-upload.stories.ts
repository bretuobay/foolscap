import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h, ref } from 'vue'
import { FileUpload, type FileUploadError } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 2/File Upload',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: renderStory(() =>
    h('div', { style: { maxWidth: '480px' } }, [
      h(FileUpload, { label: 'Drag files here or click to browse' }),
    ]),
  ),
}

export const WithHint: Story = {
  name: 'With hint',
  render: renderStory(() =>
    h('div', { style: { maxWidth: '480px' } }, [
      h(FileUpload, {
        accept: '.png,.jpg,.pdf',
        label: 'Upload your document',
        hint: 'PNG, JPG, or PDF · Max 10 MB',
      }),
    ]),
  ),
}

export const MultipleFiles: Story = {
  name: 'Multiple files',
  render: renderStory(() =>
    h('div', { style: { maxWidth: '480px' } }, [
      h(FileUpload, {
        multiple: true,
        label: 'Drag files here or click to browse',
        hint: 'Upload multiple files at once',
      }),
    ]),
  ),
}

const ErrorDemo = defineComponent({
  setup() {
    const error = ref<string | null>(null)

    const handleError = (err: FileUploadError) => {
      if (err.type === 'size') {
        error.value = `${err.file.name} exceeds the 1 MB limit.`
      } else {
        error.value = `${err.file.name} has an unsupported type.`
      }
    }

    return () =>
      h(
        'div',
        { style: { maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '0.75rem' } },
        [
          h(FileUpload, {
            accept: 'image/*',
            maxSize: 1024 * 1024,
            label: 'Images only, max 1 MB',
            hint: 'Try uploading a large or non-image file to trigger an error',
            onError: handleError,
          }),
          error.value
            ? h('p', { role: 'alert', style: { margin: 0, color: 'red', fontSize: '0.875rem' } }, error.value)
            : null,
        ],
      )
  },
})

export const WithErrorHandling: Story = {
  name: 'With error handling',
  render: renderStory(() => h(ErrorDemo)),
}
