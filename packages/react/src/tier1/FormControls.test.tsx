import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import {
  Checkbox,
  ColorPicker,
  DateInput,
  RadioButton,
  SearchInput,
  Slider,
  Textarea,
  TextInput,
} from '../index'

describe('tier 1 form controls', () => {
  it('renders text input and textarea with invalid state mapping', () => {
    render(
      <>
        <TextInput aria-label="Name" invalid size="lg" />
        <Textarea aria-label="Message" invalid />
      </>
    )
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveClass('fc-text-input')
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute('data-size', 'lg')
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveClass('fc-textarea')
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveAttribute('data-state', 'error')
  })

  it('associates checkbox and radio labels with native inputs', () => {
    render(
      <>
        <Checkbox label="Accept terms" name="terms" />
        <RadioButton label="Email" name="contact" value="email" />
      </>
    )
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toHaveClass('fc-checkbox__input')
    expect(screen.getByRole('radio', { name: 'Email' })).toHaveClass('fc-radio-button__input')
  })

  it('syncs checkbox indeterminate state onto the native input', () => {
    render(<Checkbox label="Select all" indeterminate />)
    const checkbox = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement
    expect(checkbox.indeterminate).toBe(true)
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
  })

  it('renders search input with clear action', () => {
    const onClear = vi.fn()
    render(<SearchInput aria-label="Search projects" onClear={onClear} />)
    expect(screen.getByRole('searchbox', { name: 'Search projects' })).toHaveClass('fc-search-input__field')
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(onClear).toHaveBeenCalledOnce()
  })

  it('renders date input and slider using native input types', () => {
    render(
      <>
        <DateInput aria-label="Due date" />
        <Slider aria-label="Volume" min={0} max={100} defaultValue={40} />
      </>
    )
    expect(screen.getByLabelText('Due date')).toHaveAttribute('type', 'date')
    expect(screen.getByRole('slider', { name: 'Volume' })).toHaveClass('fc-slider')
  })

  it('renders color picker with a labelled native color input and value display', () => {
    render(<ColorPicker label="Brand color" defaultValue="#123456" />)
    expect(screen.getByLabelText('Brand color')).toHaveAttribute('type', 'color')
    expect(screen.getByText('#123456')).toHaveClass('fc-color-picker__value')
  })
})
