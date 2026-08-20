import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h, type PropType } from 'vue'
import { ToastProvider, Toaster, useToast } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

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

const Demo = defineComponent({
  props: {
    position: {
      type: String as PropType<'top' | 'top-right' | 'bottom-right' | 'bottom'>,
      default: 'bottom-right',
    },
  },
  setup(props) {
    const toast = useToast()
    return () =>
      h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' } }, [
        h(Toaster, { position: props.position }),
        h(
          'button',
          {
            type: 'button',
            onClick: () => toast.add({ title: 'Saved successfully', type: 'success' }),
          },
          'Success',
        ),
        h(
          'button',
          {
            type: 'button',
            onClick: () => toast.add({ title: 'Something went wrong', type: 'error' }),
          },
          'Error',
        ),
        h(
          'button',
          {
            type: 'button',
            onClick: () =>
              toast.add({
                title: 'File uploaded',
                description: 'profile-photo.jpg has been saved.',
                type: 'info',
                action: { label: 'Undo', onClick: () => toast.dismissAll() },
              }),
          },
          'With description + action',
        ),
        h(
          'button',
          {
            type: 'button',
            onClick: () => toast.add({ title: 'Heads up', type: 'warning' }),
          },
          'Warning',
        ),
        h('button', { type: 'button', onClick: () => toast.dismissAll() }, 'Dismiss all'),
      ])
  },
})

export const BottomRight: Story = {
  render: renderStory(() =>
    h(ToastProvider, { defaultDuration: 4000 }, { default: () => h(Demo, { position: 'bottom-right' }) }),
  ),
}

export const TopRight: Story = {
  render: renderStory(() =>
    h(ToastProvider, { defaultDuration: 4000 }, { default: () => h(Demo, { position: 'top-right' }) }),
  ),
}

export const NoDismiss: Story = {
  name: 'Persistent (no auto-dismiss)',
  render: renderStory(() => h(ToastProvider, { defaultDuration: 0 }, { default: () => h(Demo) })),
}
