import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardMedia,
  CardTitle,
} from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 1/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: renderStory(() =>
    h(Card, { style: { maxWidth: 360 } }, {
      default: () => [
        h(CardMedia, { style: { aspectRatio: '16 / 9', background: 'var(--fc-grey-100)' } }),
        h(CardBody, {}, {
          default: () => [
            h(Badge, { variant: 'subtle' }, { default: () => 'Design' }),
            h(CardTitle, {}, { default: () => 'Component audit' }),
            h(CardDescription, {}, {
              default: () => 'Review primitive coverage and ship the next wrapper batch.',
            }),
          ],
        }),
        h(CardFooter, {}, {
          default: () => h(Button, { variant: 'secondary' }, { default: () => 'Open' }),
        }),
      ],
    }),
  ),
}
