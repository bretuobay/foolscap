import type { Meta, StoryObj } from '@storybook/react'
import { Badge, Button, Card, CardBody, CardDescription, CardFooter, CardMedia, CardTitle } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 360 }}>
      <CardMedia style={{ aspectRatio: '16 / 9', background: 'var(--fc-grey-100)' }} />
      <CardBody>
        <Badge variant="subtle">Design</Badge>
        <CardTitle>Component audit</CardTitle>
        <CardDescription>Review primitive coverage and ship the next wrapper batch.</CardDescription>
      </CardBody>
      <CardFooter>
        <Button variant="secondary">Open</Button>
      </CardFooter>
    </Card>
  ),
}
