import { Component } from '@angular/core'
import { render, screen } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Toggle } from './Toggle'

describe('Toggle', () => {
  it('renders a checkbox with role=switch', async () => {
    await render(`<label fc-toggle></label>`, { imports: [Toggle] })
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('is unchecked by default', async () => {
    await render(`<label fc-toggle></label>`, { imports: [Toggle] })
    expect(screen.getByRole('switch')).not.toBeChecked()
  })

  it('defaultChecked=true starts checked', async () => {
    await render(`<label fc-toggle [defaultChecked]="true"></label>`, { imports: [Toggle] })
    expect(screen.getByRole('switch')).toBeChecked()
  })

  it('toggles on click', async () => {
    const user = userEvent.setup()
    await render(`<label fc-toggle></label>`, { imports: [Toggle] })
    const input = screen.getByRole('switch')
    await user.click(input)
    expect(input).toBeChecked()
    await user.click(input)
    expect(input).not.toBeChecked()
  })

  it('calls onCheckedChange with new value on click', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    await render(`<label fc-toggle (checkedChange)="onCheckedChange($event)"></label>`, {
      imports: [Toggle],
      componentProperties: { onCheckedChange },
    })
    await user.click(screen.getByRole('switch'))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('calls latest onCheckedChange after callback identity changes', async () => {
    const user = userEvent.setup()
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    let current = fn1
    await render(`<label fc-toggle (checkedChange)="onCheckedChange($event)"></label>`, {
      imports: [Toggle],
      componentProperties: { onCheckedChange: (value: boolean) => current(value) },
    })
    current = fn2
    await user.click(screen.getByRole('switch'))
    expect(fn2).toHaveBeenCalledWith(true)
    expect(fn1).not.toHaveBeenCalled()
  })

  it('renders a label span when label prop is provided', async () => {
    await render(`<label fc-toggle label="Enable notifications"></label>`, { imports: [Toggle] })
    expect(screen.getByText('Enable notifications')).toBeInTheDocument()
  })

  it('does not render a label span when label is omitted', async () => {
    const { container } = await render(`<label fc-toggle></label>`, { imports: [Toggle] })
    expect(container.querySelector('.fc-toggle__label')).toBeNull()
  })

  it('renders the track span', async () => {
    const { container } = await render(`<label fc-toggle></label>`, { imports: [Toggle] })
    expect(container.querySelector('.fc-toggle__track')).toBeInTheDocument()
  })

  it('is disabled when disabled=true', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    await render(`<label fc-toggle [disabled]="true" (checkedChange)="onCheckedChange($event)"></label>`, {
      imports: [Toggle],
      componentProperties: { onCheckedChange },
    })
    const input = screen.getByRole('switch')
    expect(input).toBeDisabled()
    await user.click(input)
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it('adds fc-toggle--disabled class when disabled', async () => {
    const { container } = await render(`<label fc-toggle [disabled]="true"></label>`, { imports: [Toggle] })
    expect(container.querySelector('.fc-toggle')).toHaveClass('fc-toggle--disabled')
  })

  it('merges class onto the label', async () => {
    const { container } = await render(`<label fc-toggle class="custom"></label>`, { imports: [Toggle] })
    expect(container.querySelector('.fc-toggle')).toHaveClass('custom')
  })

  it('forwards extra input props (aria-label)', async () => {
    await render(`<label fc-toggle aria-label="Dark mode"></label>`, { imports: [Toggle] })
    expect(screen.getByRole('switch')).toHaveAttribute('aria-label', 'Dark mode')
  })
})

describe('Toggle controlled', () => {
  it('reflects the controlled checked prop', async () => {
    const { rerender } = await render(`<label fc-toggle [checked]="checked"></label>`, {
      imports: [Toggle],
      componentProperties: { checked: false },
    })
    expect(screen.getByRole('switch')).not.toBeChecked()
    await rerender({ componentProperties: { checked: true } })
    expect(screen.getByRole('switch')).toBeChecked()
  })

  it('calls onCheckedChange but does not self-update in controlled mode', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    await render(`<label fc-toggle [checked]="false" (checkedChange)="onCheckedChange($event)"></label>`, {
      imports: [Toggle],
      componentProperties: { onCheckedChange },
    })
    await user.click(screen.getByRole('switch'))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('switch')).not.toBeChecked()
  })

  it('works as a fully controlled toggle', async () => {
    const user = userEvent.setup()

    @Component({
      standalone: true,
      imports: [Toggle],
      template: `<label fc-toggle [checked]="on" (checkedChange)="on = $event" [label]="on ? 'On' : 'Off'"></label>`,
    })
    class Wrapper {
      on = false
    }

    await render(Wrapper)
    expect(screen.getByText('Off')).toBeInTheDocument()
    await user.click(screen.getByRole('switch'))
    expect(screen.getByText('On')).toBeInTheDocument()
  })
})
