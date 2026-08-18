import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h, ref, type PropType } from 'vue'
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerBody,
  DrawerFooter,
  type DrawerSide,
} from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta: Meta<typeof Drawer> = {
  title: 'Tier 3/Drawer',
  component: Drawer,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Drawer>

const DrawerDemo = defineComponent({
  props: {
    side: { type: String as PropType<DrawerSide>, default: 'right' },
    size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: undefined },
    closeOnOverlayClick: { type: Boolean, default: true },
  },
  setup(props) {
    const open = ref(false)
    return () => [
      h('button', { type: 'button', onClick: () => { open.value = true } }, `Open ${props.side} drawer`),
      h(
        Drawer,
        {
          open: open.value,
          onOpenChange: (next: boolean) => {
            open.value = next
          },
          side: props.side,
          size: props.size,
          closeOnOverlayClick: props.closeOnOverlayClick,
        },
        {
          default: () => [
            h(DrawerHeader, null, {
              default: () => [h(DrawerTitle, null, { default: () => 'Drawer title' }), h(DrawerClose)],
            }),
            h(DrawerBody, null, {
              default: () => [
                h(
                  'p',
                  { style: { margin: 0 } },
                  'This is the drawer body. It scrolls independently when content overflows.',
                ),
                h(
                  'ul',
                  { style: { marginTop: '1rem', paddingLeft: '1.25rem' } },
                  Array.from({ length: 8 }, (_, i) =>
                    h('li', { key: i, style: { marginBottom: '0.5rem' } }, `List item ${i + 1}`),
                  ),
                ),
              ],
            }),
            h(DrawerFooter, null, {
              default: () => [
                h('button', { type: 'button', onClick: () => { open.value = false } }, 'Cancel'),
                h('button', { type: 'button', onClick: () => { open.value = false } }, 'Save changes'),
              ],
            }),
          ],
        },
      ),
    ]
  },
})

export const Default: Story = {
  render: renderStory(() => h(DrawerDemo, { side: 'right' })),
}

export const LeftSide: Story = {
  render: renderStory(() => h(DrawerDemo, { side: 'left' })),
}

export const TopSide: Story = {
  render: renderStory(() => h(DrawerDemo, { side: 'top' })),
}

export const BottomSide: Story = {
  render: renderStory(() => h(DrawerDemo, { side: 'bottom' })),
}

export const Small: Story = {
  render: renderStory(() => h(DrawerDemo, { side: 'right', size: 'sm' })),
  name: 'Size: sm',
}

export const Large: Story = {
  render: renderStory(() => h(DrawerDemo, { side: 'right', size: 'lg' })),
  name: 'Size: lg',
}

export const NoOverlayClose: Story = {
  render: renderStory(() => h(DrawerDemo, { side: 'right', closeOnOverlayClick: false })),
  name: 'No overlay click to close',
}

export const AllSides: Story = {
  render: renderStory(() => {
    const sides: DrawerSide[] = ['right', 'left', 'top', 'bottom']
    return h(
      'div',
      { style: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' } },
      sides.map((side) => h(DrawerDemo, { key: side, side })),
    )
  }),
}
