import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { renderStory } from './render'

const meta = {
  title: 'Foolscap/Classless HTML',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta

type Story = StoryObj

export const SemanticElements: Story = {
  render: renderStory(() =>
    h('main', [
      h('section', [
        h('h1', 'Foolscap'),
        h('p', 'A paper-styled design system for semantic HTML, portable CSS, and framework adapters.'),
        h('p', [h('a', { href: 'https://component.gallery/components/' }, 'Browse the component catalogue')]),
      ]),
      h('section', [
        h('h2', 'Form controls'),
        h('form', [
          h('label', { for: 'email' }, 'Email'),
          h('input', { id: 'email', name: 'email', placeholder: 'you@example.com', type: 'email' }),
          h('button', { type: 'button' }, 'Submit'),
        ]),
      ]),
    ]),
  ),
}

export const NativeDialog: Story = {
  name: 'Native dialog',
  render: renderStory(() =>
    h('main', { style: { minHeight: '100vh', padding: '2rem', background: 'var(--fc-paper)' } }, [
      h('button', { type: 'button', 'aria-haspopup': 'dialog' }, 'Open dialog'),
      h(
        'dialog',
        {
          open: true,
          style: {
            margin: '2rem 0 0',
            width: 'min(32rem, calc(100vw - 2rem))',
            padding: 0,
            border: '1px solid var(--fc-ink)',
            borderRadius: 'var(--fc-radius-md)',
            background: 'var(--fc-paper-raised)',
            color: 'var(--fc-ink)',
            boxShadow: 'var(--fc-shadow-raised)',
          },
        },
        [
          h(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--fc-grey-200)',
              },
            },
            [
              h(
                'h2',
                {
                  id: 'native-dialog-title',
                  style: { margin: 0, fontSize: '1.125rem', lineHeight: 1.25 },
                },
                'Modal title',
              ),
              h(
                'button',
                {
                  type: 'button',
                  'aria-label': 'Close dialog',
                  style: { border: 0, background: 'transparent' },
                },
                '×',
              ),
            ],
          ),
          h('div', { style: { padding: '1.5rem', display: 'grid', gap: '1rem' } }, [
            h('p', { style: { margin: 0 } }, 'This is the classless markup pattern from the spec.'),
            h(
              'p',
              { style: { margin: 0, color: 'var(--fc-ink-muted)' } },
              'The `dialog` element provides focus management and Escape handling without a wrapper.',
            ),
          ]),
          h(
            'div',
            {
              style: {
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.5rem',
                padding: '1rem 1.5rem',
                borderTop: '1px solid var(--fc-grey-200)',
              },
            },
            [
              h('button', { type: 'button' }, 'Confirm'),
              h('button', { type: 'button' }, 'Cancel'),
            ],
          ),
        ],
      ),
    ]),
  ),
}

export const NativeTooltip: Story = {
  name: 'Native tooltip',
  render: renderStory(() =>
    h('main', { style: { minHeight: '100vh', padding: '2rem', background: 'var(--fc-paper)' } }, [
      h('button', { type: 'button', title: 'Save your changes' }, 'Save'),
    ]),
  ),
}
