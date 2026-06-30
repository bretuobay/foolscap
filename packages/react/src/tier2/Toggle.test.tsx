import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Toggle } from './Toggle'

describe('Toggle', () => {
  it('renders a checkbox with role=switch', () => {
    render(<Toggle />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('is unchecked by default', () => {
    render(<Toggle />)
    expect(screen.getByRole('switch')).not.toBeChecked()
  })

  it('defaultChecked=true starts checked', () => {
    render(<Toggle defaultChecked />)
    expect(screen.getByRole('switch')).toBeChecked()
  })

  it('toggles on click', async () => {
    const user = userEvent.setup()
    render(<Toggle />)
    const input = screen.getByRole('switch')
    await user.click(input)
    expect(input).toBeChecked()
    await user.click(input)
    expect(input).not.toBeChecked()
  })

  it('calls onCheckedChange with new value on click', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Toggle onCheckedChange={onCheckedChange} />)
    await user.click(screen.getByRole('switch'))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('calls latest onCheckedChange after callback identity changes', async () => {
    const user = userEvent.setup()
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    const { rerender } = render(<Toggle onCheckedChange={fn1} />)
    rerender(<Toggle onCheckedChange={fn2} />)
    await user.click(screen.getByRole('switch'))
    expect(fn2).toHaveBeenCalledWith(true)
    expect(fn1).not.toHaveBeenCalled()
  })

  it('renders a label span when label prop is provided', () => {
    render(<Toggle label="Enable notifications" />)
    expect(screen.getByText('Enable notifications')).toBeInTheDocument()
  })

  it('does not render a label span when label is omitted', () => {
    const { container } = render(<Toggle />)
    expect(container.querySelector('.fc-toggle__label')).toBeNull()
  })

  it('renders the track span', () => {
    const { container } = render(<Toggle />)
    expect(container.querySelector('.fc-toggle__track')).toBeInTheDocument()
  })

  it('is disabled when disabled=true', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Toggle disabled onCheckedChange={onCheckedChange} />)
    const input = screen.getByRole('switch')
    expect(input).toBeDisabled()
    await user.click(input)
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it('adds fc-toggle--disabled class when disabled', () => {
    const { container } = render(<Toggle disabled />)
    expect(container.querySelector('.fc-toggle')).toHaveClass('fc-toggle--disabled')
  })

  it('merges className onto the label', () => {
    const { container } = render(<Toggle className="custom" />)
    expect(container.querySelector('.fc-toggle')).toHaveClass('custom')
  })

  it('forwards extra input props (aria-label)', () => {
    render(<Toggle aria-label="Dark mode" />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-label', 'Dark mode')
  })
})

describe('Toggle controlled', () => {
  it('reflects the controlled checked prop', () => {
    const { rerender } = render(<Toggle checked={false} />)
    expect(screen.getByRole('switch')).not.toBeChecked()
    rerender(<Toggle checked={true} />)
    expect(screen.getByRole('switch')).toBeChecked()
  })

  it('calls onCheckedChange but does not self-update in controlled mode', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Toggle checked={false} onCheckedChange={onCheckedChange} />)
    await user.click(screen.getByRole('switch'))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    // Remains false because controlled — parent hasn't updated the prop
    expect(screen.getByRole('switch')).not.toBeChecked()
  })

  it('works as a fully controlled toggle via useState', async () => {
    const user = userEvent.setup()
    function Wrapper() {
      const [on, setOn] = useState(false)
      return <Toggle checked={on} onCheckedChange={setOn} label={on ? 'On' : 'Off'} />
    }
    render(<Wrapper />)
    expect(screen.getByText('Off')).toBeInTheDocument()
    await user.click(screen.getByRole('switch'))
    expect(screen.getByText('On')).toBeInTheDocument()
  })
})
