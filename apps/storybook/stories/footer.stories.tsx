import type { Meta, StoryObj } from '@storybook/react'
import { Footer, FooterBottom, FooterGrid, FooterLinks, FooterSectionTitle } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Footer',
  component: Footer,
  tags: ['autodocs'],
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Footer>
      <FooterGrid>
        <section>
          <FooterSectionTitle>Product</FooterSectionTitle>
          <FooterLinks>
            <li><a href="/components">Components</a></li>
            <li><a href="/tokens">Tokens</a></li>
          </FooterLinks>
        </section>
        <section>
          <FooterSectionTitle>Company</FooterSectionTitle>
          <FooterLinks>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </FooterLinks>
        </section>
      </FooterGrid>
      <FooterBottom>Foolscap components</FooterBottom>
    </Footer>
  ),
}
