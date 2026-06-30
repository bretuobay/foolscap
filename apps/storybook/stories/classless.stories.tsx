import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Foolscap/Classless HTML',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta

type Story = StoryObj

export const SemanticElements: Story = {
  render: () => (
    <main>
      <section>
        <h1>Foolscap</h1>
        <p>A paper-styled design system for semantic HTML, portable CSS, and framework adapters.</p>
        <p>
          <a href="https://component.gallery/components/">Browse the component catalogue</a>
        </p>
      </section>

      <section>
        <h2>Form controls</h2>
        <form>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" placeholder="you@example.com" type="email" />
          <button type="button">Submit</button>
        </form>
      </section>
    </main>
  ),
}

export const NativeDialog: Story = {
  name: 'Native dialog',
  render: () => (
    <main style={{ minHeight: '100vh', padding: '2rem', background: 'var(--fc-paper)' }}>
      <button type="button" aria-haspopup="dialog">
        Open dialog
      </button>

      <dialog
        open
        style={{
          margin: '2rem 0 0',
          width: 'min(32rem, calc(100vw - 2rem))',
          padding: 0,
          border: '1px solid var(--fc-ink)',
          borderRadius: 'var(--fc-radius-md)',
          background: 'var(--fc-paper-raised)',
          color: 'var(--fc-ink)',
          boxShadow: 'var(--fc-shadow-raised)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--fc-grey-200)',
          }}
        >
          <h2
            id="native-dialog-title"
            style={{ margin: 0, fontSize: '1.125rem', lineHeight: 1.25 }}
          >
            Modal title
          </h2>
          <button
            type="button"
            aria-label="Close dialog"
            style={{ border: 0, background: 'transparent' }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
          <p style={{ margin: 0 }}>This is the classless markup pattern from the spec.</p>
          <p style={{ margin: 0, color: 'var(--fc-ink-muted)' }}>
            The `dialog` element provides focus management and Escape handling without a wrapper.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem',
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--fc-grey-200)',
          }}
        >
          <button type="button">Confirm</button>
          <button type="button">Cancel</button>
        </div>
      </dialog>
    </main>
  ),
}
