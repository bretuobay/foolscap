import { screen } from '@testing-library/angular'
import { describe, expect, it } from 'vitest'
import { render } from '../test-helpers'
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
    const btn = container.querySelector('button')
    expect(btn).toHaveClass('fc-button')
    expect(btn).toHaveAttribute('data-variant', 'primary')
    expect(btn).toHaveAttribute('data-size', 'md')
    expect(btn).toHaveAttribute('type', 'button')
    expect(btn?.querySelector('.fc-button__label')?.textContent).toBe('Save')
  })
})
