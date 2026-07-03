import type { Meta, StoryObj } from '@storybook/react'
import { Button, Header, HeaderActions, HeaderBrand, HeaderNav } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Header',
  component: Header,
  tags: ['autodocs'],
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Header>
      <HeaderBrand href="/">Foolscap</HeaderBrand>
      <HeaderNav aria-label="Primary">
        <a href="/docs" aria-current="page">Docs</a>
        <a href="/components">Components</a>
      </HeaderNav>
      <HeaderActions>
        <Button variant="secondary">Sign in</Button>
      </HeaderActions>
    </Header>
  ),
}
