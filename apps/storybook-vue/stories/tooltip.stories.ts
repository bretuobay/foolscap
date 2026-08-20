import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h, type PropType, type VNode } from 'vue'
import { Button, TooltipContent, TooltipRoot, TooltipTrigger } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 3/Tooltip',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { story: { height: '200px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

const Demo = defineComponent({
  props: {
    placement: { type: String as PropType<'top' | 'bottom' | 'left' | 'right'>, default: undefined },
  },
  setup(props) {
    return () =>
      h(TooltipRoot, { openDelay: 0, closeDelay: 0, placement: props.placement }, {
        default: () => [
          h(TooltipTrigger, null, {
            default: () =>
              h(
                Button,
                {
                  variant: 'secondary',
                  onVnodeMounted: (vnode: VNode) => {
                    const el = vnode.el
                    window.setTimeout(() => {
                      if (el instanceof HTMLElement) el.focus()
                    }, 50)
                  },
                },
                { default: () => 'Save' },
              ),
          }),
          h(TooltipContent, null, {
            default: () => [
              'Save your changes',
              h('span', { class: 'fc-tooltip__arrow', 'aria-hidden': 'true' }),
            ],
          }),
        ],
      })
  },
})

export const Default: Story = {
  render: renderStory(() => h(Demo)),
}

export const PlacementBottom: Story = {
  name: 'Placement — bottom',
  render: renderStory(() => h(Demo, { placement: 'bottom' })),
}
