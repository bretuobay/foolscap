import { render, screen } from '@testing-library/angular'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders projected text inside the label span', async () => {
    await render(`<button fc-button>Click me</button>`, { imports: [Button] })
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies default data-variant and data-size', async () => {
    await render(`<button fc-button>X</button>`, { imports: [Button] })
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('data-variant', 'primary')
    expect(btn).toHaveAttribute('data-size', 'md')
  })

  it('sets data-state=loading when loading is true', async () => {
    await render(`<button fc-button [loading]="true">X</button>`, { imports: [Button] })
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'loading')
  })

  it('matches the primary variant snapshot', async () => {
    const { container } = await render(`<button fc-button>Save</button>`, { imports: [Button] })
    expect(container.querySelector('button')).toMatchInlineSnapshot(`
      <button
        class="fc-button"
        data-size="md"
        data-variant="primary"
        fc-button=""
        type="button"
      >
        <span
          class="fc-button__icon-start"
          aria-hidden="true"
        />
        <span
          class="fc-button__label"
        >
          Save
        </span>
        <span
          class="fc-button__icon-end"
          aria-hidden="true"
        />
      </button>
    `)
  })
})
