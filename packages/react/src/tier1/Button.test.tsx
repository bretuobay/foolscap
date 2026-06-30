import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef } from 'react'
import { Button } from './Button'

describe('Button', () => {
  it('renders children inside the label span', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies default data-variant and data-size', () => {
    render(<Button>X</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('data-variant', 'primary')
    expect(btn).toHaveAttribute('data-size', 'md')
  })

  it('forwards variant and size props', () => {
    render(<Button variant="ghost" size="lg">X</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('data-variant', 'ghost')
    expect(btn).toHaveAttribute('data-size', 'lg')
  })

  it('sets data-state=loading when loading is true', () => {
    render(<Button loading>X</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'loading')
  })

  it('sets aria-disabled when loading', () => {
    render(<Button loading>X</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true')
  })

  it('merges className', () => {
    render(<Button className="extra">X</Button>)
    expect(screen.getByRole('button')).toHaveClass('fc-button', 'extra')
  })

  it('forwards extra HTML attributes', () => {
    render(<Button data-testid="my-btn">X</Button>)
    expect(screen.getByTestId('my-btn')).toBeInTheDocument()
  })

  it('fires onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>X</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>X</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders iconStart and iconEnd', () => {
    render(
      <Button iconStart={<span data-testid="icon-start" />} iconEnd={<span data-testid="icon-end" />}>
        Label
      </Button>,
    )
    expect(screen.getByTestId('icon-start')).toBeInTheDocument()
    expect(screen.getByTestId('icon-end')).toBeInTheDocument()
  })

  it('forwards ref to the button element', () => {
    function Wrapper() {
      const ref = useRef<HTMLButtonElement>(null)
      return <Button ref={ref} data-testid="btn">X</Button>
    }
    render(<Wrapper />)
    expect(screen.getByTestId('btn').tagName).toBe('BUTTON')
  })
})
