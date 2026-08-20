import type { Meta, StoryObj } from '@storybook/angular'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardMedia,
  CardTitle,
} from '@web-loom/foolscap-angular'

const meta = {
  title: 'Tier 1/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [Card, CardMedia, CardBody, CardTitle, CardDescription, CardFooter, Badge, Button],
    },
    template: `
      <article fc-card style="max-width:360px">
        <fc-card-media style="aspect-ratio:16/9;background:var(--fc-grey-100)"></fc-card-media>
        <fc-card-body>
          <fc-badge variant="subtle">Design</fc-badge>
          <h3 fc-card-title>Component audit</h3>
          <p fc-card-description>Review primitive coverage and ship the next wrapper batch.</p>
        </fc-card-body>
        <fc-card-footer>
          <button fc-button variant="secondary">Open</button>
        </fc-card-footer>
      </article>
    `,
  }),
}
