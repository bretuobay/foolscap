import { h } from 'vue'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders default slot inside the label span', () => {
    render(Button, { slots: { default: 'Click me' } })
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies default data-variant and data-size', () => {
    render(Button, { slots: { default: 'X' } })
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('data-variant', 'primary')
    expect(btn).toHaveAttribute('data-size', 'md')
  })

  it('forwards variant and size props', () => {
    render(Button, { props: { variant: 'ghost', size: 'lg' }, slots: { default: 'X' } })
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('data-variant', 'ghost')
    expect(btn).toHaveAttribute('data-size', 'lg')
  })

  it('sets data-state=loading when loading is true', () => {
    render(Button, { props: { loading: true }, slots: { default: 'X' } })
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'loading')
  })

  it('sets aria-disabled when loading', () => {
    render(Button, { props: { loading: true }, slots: { default: 'X' } })
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true')
  })

  it('merges class', () => {
    render(Button, { attrs: { class: 'extra' }, slots: { default: 'X' } })
    expect(screen.getByRole('button')).toHaveClass('fc-button', 'extra')
  })

  it('forwards extra HTML attributes', () => {
    render(Button, { attrs: { 'data-testid': 'my-btn' }, slots: { default: 'X' } })
    expect(screen.getByTestId('my-btn')).toBeInTheDocument()
  })

  it('fires onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(Button, { attrs: { onClick }, slots: { default: 'X' } })
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(Button, { props: { disabled: true }, attrs: { onClick }, slots: { default: 'X' } })
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders iconStart and iconEnd slots', () => {
    render(Button, {
      slots: {
        default: 'Label',
        iconStart: () => h('span', { 'data-testid': 'icon-start' }),
        iconEnd: () => h('span', { 'data-testid': 'icon-end' }),
      },
    })
    expect(screen.getByTestId('icon-start')).toBeInTheDocument()
    expect(screen.getByTestId('icon-end')).toBeInTheDocument()
  })

  it('matches the primary variant snapshot', () => {
    const { container } = render(Button, { slots: { default: 'Save' } })
    expect(container.firstChild).toMatchInlineSnapshot(`
      <button
        class="fc-button"
        data-size="md"
        data-variant="primary"
        type="button"
      >
        <span
          class="fc-button__label"
        >
          Save
        </span>
      </button>
    `)
  })
})
