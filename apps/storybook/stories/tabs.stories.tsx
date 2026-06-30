import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { TabsRoot, TabsList, Tab, TabPanel } from '@web-loom/foolscap-react'

const meta = {
  title: 'React/Tabs',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj

function Demo(props: Omit<React.ComponentProps<typeof TabsRoot>, 'children'>) {
  return (
    <div style={{ maxWidth: '480px' }}>
      <TabsRoot {...props}>
        <TabsList>
          <Tab value="overview">Overview</Tab>
          <Tab value="specs">Specifications</Tab>
          <Tab value="reviews">Reviews</Tab>
        </TabsList>
        <TabPanel value="overview">
          <p>A complete overview of the product, including key features and benefits.</p>
        </TabPanel>
        <TabPanel value="specs">
          <ul>
            <li>Weight: 1.2 kg</li>
            <li>Dimensions: 30 x 20 x 5 cm</li>
            <li>Material: Recycled aluminium</li>
          </ul>
        </TabPanel>
        <TabPanel value="reviews">
          <p>⭐⭐⭐⭐⭐ - "Exactly what I needed." - Alex M.</p>
        </TabPanel>
      </TabsRoot>
    </div>
  )
}

export const Default: Story = {
  render: () => <Demo defaultValue="overview" />,
}

export const Underline: Story = {
  render: () => <Demo defaultValue="overview" variant="underline" />,
}

export const Contained: Story = {
  render: () => <Demo defaultValue="overview" variant="contained" />,
}

export const Vertical: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <TabsRoot defaultValue="overview" orientation="vertical">
        <TabsList>
          <Tab value="overview">Overview</Tab>
          <Tab value="specs">Specifications</Tab>
          <Tab value="reviews">Reviews</Tab>
        </TabsList>
        <TabPanel value="overview">Overview content</TabPanel>
        <TabPanel value="specs">Specs content</TabPanel>
        <TabPanel value="reviews">Reviews content</TabPanel>
      </TabsRoot>
    </div>
  ),
}

export const Controlled: Story = {
  render: function ControlledDemo() {
    const [tab, setTab] = useState('overview')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Demo value={tab} onValueChange={setTab} />
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--fc-color-text-muted, #666)' }}>
          Active: <strong>{tab}</strong>
        </p>
      </div>
    )
  },
}
