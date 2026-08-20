import type { Meta, StoryObj } from '@storybook/angular'
import {
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Checkbox,
  ColorPicker,
  DateInput,
  EmptyState,
  Fieldset,
  File,
  Footer,
  FooterBottom,
  FooterGrid,
  FooterLinks,
  FooterSectionTitle,
  Header,
  HeaderActions,
  HeaderBrand,
  HeaderNav,
  Heading,
  Hero,
  HeroActions,
  HeroDescription,
  HeroEyebrow,
  HeroTitle,
  Icon,
  Label,
  Link,
  List,
  ProgressBar,
  Quote,
  RadioButton,
  SearchInput,
  Separator,
  Skeleton,
  SkipLink,
  Slider,
  Spinner,
  Stack,
  Table,
  TextInput,
  Textarea,
  VisuallyHidden,
} from '@web-loom/foolscap-angular'

const primitives = [
  Avatar,
  Badge,
  Heading,
  Icon,
  Label,
  Link,
  Separator,
  Skeleton,
  Spinner,
  Stack,
  VisuallyHidden,
]

const formControls = [
  Checkbox,
  ColorPicker,
  DateInput,
  Fieldset,
  File,
  RadioButton,
  SearchInput,
  Slider,
  Stack,
  TextInput,
  Textarea,
]

const structure = [
  Button,
  ButtonGroup,
  EmptyState,
  List,
  ProgressBar,
  Quote,
  SkipLink,
  Stack,
  Table,
]

const chrome = [
  Button,
  Footer,
  FooterBottom,
  FooterGrid,
  FooterLinks,
  FooterSectionTitle,
  Header,
  HeaderActions,
  HeaderBrand,
  HeaderNav,
  Hero,
  HeroActions,
  HeroDescription,
  HeroEyebrow,
  HeroTitle,
  Link,
]

const meta = {
  title: 'Tier 1/Gallery',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const Primitives: Story = {
  name: 'Primitives',
  render: () => ({
    moduleMetadata: { imports: primitives },
    template: `
      <fc-stack gap="6">
        <h1 fc-heading>Foolscap Angular</h1>
        <fc-badge>Default</fc-badge>
        <fc-icon label="Star">★</fc-icon>
        <label fc-label required>Name</label>
        <a fc-link href="#">Open docs</a>
        <fc-separator></fc-separator>
        <fc-spinner label="Loading"></fc-spinner>
        <fc-skeleton></fc-skeleton>
        <fc-visually-hidden>Screen reader only</fc-visually-hidden>
        <fc-avatar fallback="AL"></fc-avatar>
      </fc-stack>
    `,
  }),
}

export const FormControls: Story = {
  render: () => ({
    moduleMetadata: { imports: formControls },
    template: `
      <fieldset fc-fieldset legend="Profile" hint="Native controls with Foolscap classes.">
        <fc-stack gap="4">
          <input fc-text-input aria-label="Full name" placeholder="Ada Lovelace" />
          <textarea fc-textarea aria-label="Bio" rows="3"></textarea>
          <fc-checkbox label="Subscribe"></fc-checkbox>
          <fc-radio-button label="Email" name="contact" value="email"></fc-radio-button>
          <fc-search-input aria-label="Search"></fc-search-input>
          <input fc-date-input aria-label="Start date" />
          <input fc-slider aria-label="Volume" min="0" max="100" value="40" />
          <fc-color-picker label="Brand color" defaultValue="#1a1a1a"></fc-color-picker>
          <fc-file label="Attachment"></fc-file>
        </fc-stack>
      </fieldset>
    `,
  }),
}

export const Structure: Story = {
  render: () => ({
    moduleMetadata: { imports: structure },
    template: `
      <fc-stack gap="6">
        <blockquote fc-quote citeText="Ada Lovelace">Make it simple, then make it paper.</blockquote>
        <ul fc-list>
          <li>Tokens</li>
          <li>CSS</li>
          <li>Adapters</li>
        </ul>
        <fc-progress-bar label="Upload" [value]="64"></fc-progress-bar>
        <a fc-skip-link href="#main">Skip to main content</a>
        <table fc-table>
          <thead><tr><th>Component</th><th>Tier</th></tr></thead>
          <tbody><tr><td>Button</td><td>1</td></tr></tbody>
        </table>
        <fc-empty-state title="Nothing here" description="Try another filter."></fc-empty-state>
        <fc-button-group>
          <button fc-button variant="secondary">One</button>
          <button fc-button variant="secondary">Two</button>
        </fc-button-group>
      </fc-stack>
    `,
  }),
}

export const Chrome: Story = {
  parameters: { layout: 'padded' },
  render: () => ({
    moduleMetadata: { imports: chrome },
    template: `
      <header fc-header>
        <a fc-header-brand href="/">Foolscap</a>
        <nav fc-header-nav aria-label="Primary">
          <a fc-link href="/docs">Docs</a>
        </nav>
        <fc-header-actions>
          <button fc-button size="sm">Sign in</button>
        </fc-header-actions>
      </header>
      <section fc-hero>
        <p fc-hero-eyebrow>Angular adapter</p>
        <h1 fc-hero-title>Paper-first components</h1>
        <p fc-hero-description>Standalone hosts over shared CSS and core machines.</p>
        <fc-hero-actions>
          <button fc-button>Get started</button>
        </fc-hero-actions>
      </section>
      <footer fc-footer>
        <fc-footer-grid>
          <h2 fc-footer-section-title>Product</h2>
          <ul fc-footer-links><li><a fc-link href="/docs">Docs</a></li></ul>
        </fc-footer-grid>
        <fc-footer-bottom>© Foolscap</fc-footer-bottom>
      </footer>
    `,
  }),
}
