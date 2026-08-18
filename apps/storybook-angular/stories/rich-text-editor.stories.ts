import { Component } from '@angular/core'
import type { Meta, StoryObj } from '@storybook/angular'
import { RichTextEditorRoot } from '@web-loom/foolscap-angular'

const rteImports = [RichTextEditorRoot]

const meta = {
  title: 'Tier 3/Rich Text Editor',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

@Component({
  selector: 'demo-rte-default',
  standalone: true,
  imports: rteImports,
  template: `<fc-rte defaultValue="<p>Start typing rich content.</p>" placeholder="Write content..."></fc-rte>`,
})
class DefaultDemo {
  readonly kind = 'default'
}

@Component({
  selector: 'demo-rte-prefilled',
  standalone: true,
  imports: rteImports,
  template: `<fc-rte [defaultValue]="html" placeholder="Write content..."></fc-rte>`,
})
class PrefilledDemo {
  html =
    '<h2>Release notes</h2><p><strong>Foolscap</strong> now includes a minimal rich text editor.</p><ul><li>Bold and italic</li><li>Lists and headings</li><li>Links</li></ul>'
}

@Component({
  selector: 'demo-rte-controlled',
  standalone: true,
  imports: rteImports,
  template: `
    <div style="display:grid;gap:1rem">
      <fc-rte [value]="html" (change)="html = $event" placeholder="Write content..."></fc-rte>
      <pre style="margin:0;white-space:pre-wrap">{{ html }}</pre>
    </div>
  `,
})
class ControlledDemo {
  html = '<p>Editable content</p>'
}

@Component({
  selector: 'demo-rte-disabled',
  standalone: true,
  imports: rteImports,
  template: `<fc-rte defaultValue="<p>This editor is disabled.</p>" [disabled]="true" placeholder="Write content..."></fc-rte>`,
})
class DisabledDemo {
  readonly kind = 'disabled'
}

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [DefaultDemo] },
    template: `<demo-rte-default></demo-rte-default>`,
  }),
}

export const Prefilled: Story = {
  render: () => ({
    moduleMetadata: { imports: [PrefilledDemo] },
    template: `<demo-rte-prefilled></demo-rte-prefilled>`,
  }),
}

export const Controlled: Story = {
  render: () => ({
    moduleMetadata: { imports: [ControlledDemo] },
    template: `<demo-rte-controlled></demo-rte-controlled>`,
  }),
}

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: [DisabledDemo] },
    template: `<demo-rte-disabled></demo-rte-disabled>`,
  }),
}
