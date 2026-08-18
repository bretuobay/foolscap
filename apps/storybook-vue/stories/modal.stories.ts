import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h, ref, type CSSProperties, type PropType } from 'vue'
import {
  Button,
  Modal,
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@web-loom/foolscap-vue'
import { renderStory } from './render'

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
  title: 'Tier 3/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { story: { height: '220px' } },
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof Modal>

const Demo = defineComponent({
  props: {
    variant: { type: String as PropType<'default' | 'alert'>, default: 'default' },
    size: { type: String as PropType<'sm' | 'md' | 'lg' | 'full'>, default: 'md' },
    title: { type: String, default: 'Delete project' },
    description: { type: String, default: 'Deleting this project cannot be undone.' },
    footerLabel: { type: String, default: 'Delete' },
  },
  setup(props) {
    const open = ref(false)

    return () => [
      h(Button, { onClick: () => { open.value = true } }, { default: () => 'Open modal' }),
      h(
        Modal,
        {
          open: open.value,
          onClose: () => {
            open.value = false
          },
          variant: props.variant,
          size: props.size,
        },
        {
          default: () => [
            h(ModalHeader, { style: headerStyle }, {
              default: () => [
                h('div', { style: { minWidth: 0 } }, [
                  h(
                    ModalTitle,
                    { style: { margin: 0, fontSize: '1.125rem', lineHeight: 1.25 } },
                    { default: () => props.title },
                  ),
                ]),
                h(ModalClose, { style: closeStyle, 'aria-label': 'Close modal' }, { default: () => '×' }),
              ],
            }),
            h(ModalBody, { style: bodyStyle }, {
              default: () => [
                h('p', { style: { margin: 0 } }, props.description),
                h(
                  'p',
                  { style: { margin: 0, color: 'var(--fc-ink-muted)' } },
                  'The modal uses the native dialog element, restores focus when it closes, and locks body scrolling while open.',
                ),
              ],
            }),
            h(ModalFooter, { style: footerStyle }, {
              default: () => [
                h(
                  Button,
                  {
                    variant: props.variant === 'alert' ? 'danger' : 'secondary',
                    onClick: () => {
                      open.value = false
                    },
                  },
                  { default: () => props.footerLabel },
                ),
                h(
                  Button,
                  {
                    variant: 'ghost',
                    onClick: () => {
                      open.value = false
                    },
                  },
                  { default: () => 'Cancel' },
                ),
              ],
            }),
          ],
        },
      ),
    ]
  },
})

export const Default: Story = {
  render: renderStory(() => h(Demo)),
}

export const Alert: Story = {
  render: renderStory(() =>
    h(Demo, {
      variant: 'alert',
      size: 'sm',
      title: 'Delete workspace?',
      description: 'This action removes the workspace and all of its members. There is no undo.',
      footerLabel: 'Delete workspace',
    }),
  ),
}

export const Fullscreen: Story = {
  render: renderStory(() =>
    h(Demo, {
      size: 'full',
      title: 'Editing drawer',
      description: 'Full-screen mode is useful for long, scrollable workflows on smaller displays.',
      footerLabel: 'Save changes',
    }),
  ),
}
