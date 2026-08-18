import { Component } from '@angular/core'
import type { Meta, StoryObj } from '@storybook/angular'
import { PaginationRoot } from '@web-loom/foolscap-angular'

const paginationImports = [PaginationRoot]

const meta = {
  title: 'Tier 3/Pagination',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

@Component({
  selector: 'demo-pagination-default',
  standalone: true,
  imports: paginationImports,
  template: `<nav fc-pagination [totalPages]="10" [defaultPage]="1"></nav>`,
})
class DefaultDemo {
  readonly kind = 'default'
}

@Component({
  selector: 'demo-pagination-controlled',
  standalone: true,
  imports: paginationImports,
  template: `
    <div style="display:flex;flex-direction:column;gap:1rem;align-items:flex-start">
      <nav fc-pagination [totalPages]="20" [page]="page" (pageChange)="page = $event"></nav>
      <p style="margin:0;font-size:0.875rem;color:var(--fc-ink-muted, rgb(26 26 26 / 0.6))">
        Current page: <strong>{{ page }}</strong>
      </p>
    </div>
  `,
})
class ControlledDemo {
  page = 5
}

@Component({
  selector: 'demo-pagination-links',
  standalone: true,
  imports: paginationImports,
  template: `<nav fc-pagination [totalPages]="10" [defaultPage]="2" [getPageHref]="getPageHref"></nav>`,
})
class LinkModeDemo {
  getPageHref = (page: number) => `?page=${page}`
}

@Component({
  selector: 'demo-pagination-sizes',
  standalone: true,
  imports: paginationImports,
  template: `
    <div style="display:flex;flex-direction:column;gap:1rem;align-items:flex-start">
      <nav fc-pagination [totalPages]="5" [defaultPage]="2" size="sm"></nav>
      <nav fc-pagination [totalPages]="5" [defaultPage]="2"></nav>
      <nav fc-pagination [totalPages]="5" [defaultPage]="2" size="lg"></nav>
    </div>
  `,
})
class SizesDemo {
  readonly kind = 'sizes'
}

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [DefaultDemo] },
    template: `<demo-pagination-default></demo-pagination-default>`,
  }),
}

export const Controlled: Story = {
  render: () => ({
    moduleMetadata: { imports: [ControlledDemo] },
    template: `<demo-pagination-controlled></demo-pagination-controlled>`,
  }),
}

export const LinkMode: Story = {
  name: 'Link mode',
  render: () => ({
    moduleMetadata: { imports: [LinkModeDemo] },
    template: `<demo-pagination-links></demo-pagination-links>`,
  }),
}

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: [SizesDemo] },
    template: `<demo-pagination-sizes></demo-pagination-sizes>`,
  }),
}
