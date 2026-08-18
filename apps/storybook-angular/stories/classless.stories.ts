import type { Meta, StoryObj } from '@storybook/angular'

const meta = {
  title: 'Foolscap/Classless HTML',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const SemanticElements: Story = {
  render: () => ({
    template: `
      <main>
        <section>
          <h1>Foolscap</h1>
          <p>A paper-styled design system for semantic HTML, portable CSS, and framework adapters.</p>
        </section>
        <section>
          <h2>Form controls</h2>
          <form>
            <label for="email">Email</label>
            <input id="email" name="email" placeholder="you@example.com" type="email" />
            <button type="button">Submit</button>
          </form>
        </section>
      </main>
    `,
  }),
}
