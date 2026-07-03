import type { Meta, StoryObj } from '@storybook/react'
import { BreadcrumbItem, Breadcrumbs } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem>
        <a href="/">Home</a>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <a href="/projects">Projects</a>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <span aria-current="page">Atlas</span>
      </BreadcrumbItem>
    </Breadcrumbs>
  ),
}
