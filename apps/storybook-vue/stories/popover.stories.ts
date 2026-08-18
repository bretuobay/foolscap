import type { Meta, StoryObj } from '@storybook/vue3'
import { h, type CSSProperties } from 'vue'
import { Button, PopoverClose, PopoverContent, PopoverRoot, PopoverTrigger } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 2/Popover',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { story: { height: '400px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

const stageStyle: CSSProperties = {
  height: '360px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const contentStyle: CSSProperties = {
  gap: '0.75rem',
}

function Demo(placement?: 'top' | 'bottom' | 'left' | 'right') {
  return h('div', { style: stageStyle }, [
    h(PopoverRoot, { placement: placement ?? 'bottom' }, {
      default: () => [
        h(PopoverTrigger, null, {
          default: () =>
            h(Button, { variant: 'secondary', size: 'sm' }, { default: () => 'Open popover' }),
        }),
        h(PopoverContent, { style: contentStyle, 'aria-label': 'Additional information' }, {
          default: () => [
            h('div', { style: { display: 'grid', gap: '0.25rem' } }, [
              h('strong', { style: { fontSize: '0.875rem' } }, 'Popover content'),
              h(
                'p',
                { style: { margin: 0, fontSize: '0.875rem', lineHeight: 1.5 } },
                'This popover can hold interactive controls, not just plain text.',
              ),
            ]),
            h('div', { style: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' } }, [
              h(PopoverClose, null, {
                default: () => h(Button, { size: 'sm' }, { default: () => 'Action' }),
              }),
              h(PopoverClose, null, {
                default: () =>
                  h(Button, { size: 'sm', variant: 'ghost' }, { default: () => 'Dismiss' }),
              }),
            ]),
          ],
        }),
      ],
    }),
  ])
}

export const Default: Story = {
  render: renderStory(() => Demo()),
}

export const PlacementTop: Story = {
  name: 'Placement — top',
  render: renderStory(() => Demo('top')),
}

export const PlacementLeft: Story = {
  name: 'Placement — left',
  render: renderStory(() => Demo('left')),
}

export const PlacementRight: Story = {
  name: 'Placement — right',
  render: renderStory(() => Demo('right')),
}
