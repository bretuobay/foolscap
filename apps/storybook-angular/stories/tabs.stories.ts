import { Component } from '@angular/core'
import type { Meta, StoryObj } from '@storybook/angular'
import { Tab, TabPanel, TabsList, TabsRoot } from '@web-loom/foolscap-angular'

const tabsImports = [TabsRoot, TabsList, Tab, TabPanel]

const meta = {
  title: 'Tier 3/Tabs',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { story: { height: '220px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

function tabsTemplate(extra = '') {
  return `
    <div style="max-width:480px">
      <fc-tabs defaultValue="overview" ${extra}>
        <div fc-tabs-list>
          <button fc-tab value="overview">Overview</button>
          <button fc-tab value="specs">Specifications</button>
          <button fc-tab value="reviews">Reviews</button>
        </div>
        <div fc-tab-panel value="overview">
          <p>A complete overview of the product, including key features and benefits.</p>
        </div>
        <div fc-tab-panel value="specs">
          <ul>
            <li>Weight: 1.2 kg</li>
            <li>Dimensions: 30 x 20 x 5 cm</li>
            <li>Material: Recycled aluminium</li>
          </ul>
        </div>
        <div fc-tab-panel value="reviews">
          <p>⭐⭐⭐⭐⭐ - "Exactly what I needed." - Alex M.</p>
        </div>
      </fc-tabs>
    </div>
  `
}

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: tabsImports },
    template: tabsTemplate(),
  }),
}

export const Underline: Story = {
  render: () => ({
    moduleMetadata: { imports: tabsImports },
    template: tabsTemplate('variant="underline"'),
  }),
}

export const Contained: Story = {
  render: () => ({
    moduleMetadata: { imports: tabsImports },
    template: tabsTemplate('variant="contained"'),
  }),
}

export const Vertical: Story = {
  render: () => ({
    moduleMetadata: { imports: tabsImports },
    template: tabsTemplate('orientation="vertical"'),
  }),
}

@Component({
  selector: 'demo-tabs-controlled',
  standalone: true,
  imports: tabsImports,
  template: `
    <div style="max-width:480px">
      <fc-tabs [value]="value" (valueChange)="value = $event">
        <div fc-tabs-list>
          <button fc-tab value="overview">Overview</button>
          <button fc-tab value="specs">Specifications</button>
          <button fc-tab value="reviews">Reviews</button>
        </div>
        <div fc-tab-panel value="overview">Overview content</div>
        <div fc-tab-panel value="specs">Specs content</div>
        <div fc-tab-panel value="reviews">Reviews content</div>
      </fc-tabs>
    </div>
  `,
})
class ControlledDemo {
  value = 'overview'
}

export const Controlled: Story = {
  render: () => ({
    moduleMetadata: { imports: [ControlledDemo] },
    template: `<demo-tabs-controlled></demo-tabs-controlled>`,
  }),
}
