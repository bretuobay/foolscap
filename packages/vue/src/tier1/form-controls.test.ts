import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from './Checkbox'
import { ColorPicker } from './ColorPicker'
import { DateInput } from './DateInput'
import { Fieldset } from './Fieldset'
import { File } from './File'
import { RadioButton } from './RadioButton'
import { SearchInput } from './SearchInput'
import { Slider } from './Slider'
import { Textarea } from './Textarea'
import { TextInput } from './TextInput'

describe('tier 1 form controls (wave 1B)', () => {
  it('renders text input and textarea with invalid state mapping', () => {
    render(TextInput, { props: { invalid: true, size: 'lg' }, attrs: { 'aria-label': 'Name', class: 'extra-input' } })
    const name = screen.getByRole('textbox', { name: 'Name' })
    expect(name).toHaveClass('fc-text-input', 'extra-input')
    expect(name).toHaveAttribute('aria-invalid', 'true')
    expect(name).toHaveAttribute('data-size', 'lg')
    expect(name).toHaveAttribute('data-state', 'error')

    render(Textarea, { props: { invalid: true }, attrs: { 'aria-label': 'Message', class: 'extra-area' } })
    const message = screen.getByRole('textbox', { name: 'Message' })
    expect(message).toHaveClass('fc-textarea', 'extra-area')
    expect(message).toHaveAttribute('data-state', 'error')
  })

  it('associates checkbox and radio labels with native inputs', () => {
    render(Checkbox, {
      props: { label: 'Accept terms' },
      attrs: { name: 'terms', id: 'terms', class: 'extra-check' },
    })
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toHaveClass('fc-checkbox__input', 'extra-check')

    render(RadioButton, {
      props: { label: 'Email' },
      attrs: { name: 'contact', value: 'email', id: 'contact-email', class: 'extra-radio' },
    })
    expect(screen.getByRole('radio', { name: 'Email' })).toHaveClass('fc-radio-button__input', 'extra-radio')
  })

  it('syncs checkbox indeterminate state onto the native input', () => {
    render(Checkbox, { props: { label: 'Select all', indeterminate: true } })
    const checkbox = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement
    expect(checkbox.indeterminate).toBe(true)
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
  })

  it('renders search input with clear action', async () => {
    const onClear = vi.fn()
    render(SearchInput, {
      props: { onClear },
      attrs: { 'aria-label': 'Search projects', class: 'extra-search' },
    })
    expect(screen.getByRole('searchbox', { name: 'Search projects' })).toHaveClass(
      'fc-search-input__field',
      'extra-search',
    )
    await fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(onClear).toHaveBeenCalledOnce()
  })

  it('renders date input and slider using native input types', () => {
    render(DateInput, { attrs: { 'aria-label': 'Due date', class: 'extra-date' } })
    expect(screen.getByLabelText('Due date')).toHaveAttribute('type', 'date')
    expect(screen.getByLabelText('Due date')).toHaveClass('fc-date-input', 'extra-date')

    render(Slider, { attrs: { 'aria-label': 'Volume', min: 0, max: 100, value: 40, class: 'extra-slider' } })
    expect(screen.getByRole('slider', { name: 'Volume' })).toHaveClass('fc-slider', 'extra-slider')
  })

  it('renders color picker with a labelled native color input and value display', () => {
    render(ColorPicker, { props: { label: 'Brand color', defaultValue: '#123456' } })
    expect(screen.getByLabelText('Brand color')).toHaveAttribute('type', 'color')
    expect(screen.getByText('#123456')).toHaveClass('fc-color-picker__value')
  })

  it('renders file and fieldset with class contracts', () => {
    render(File, {
      props: { label: 'Resume', variant: 'dropzone', rootClassName: 'extra-root' },
      attrs: { class: 'extra-file', 'data-testid': 'file-input' },
    })
    expect(screen.getByLabelText('Resume')).toHaveClass('fc-file__input', 'extra-file')
    expect(screen.getByLabelText('Resume').parentElement).toHaveClass('fc-file', 'extra-root')
    expect(screen.getByLabelText('Resume').parentElement).toHaveAttribute('data-variant', 'dropzone')

    render(Fieldset, {
      props: { legend: 'Contact', hint: 'Optional' },
      attrs: { class: 'extra-fieldset' },
      slots: { default: 'Fields' },
    })
    const fieldset = screen.getByRole('group', { name: 'Contact' })
    expect(fieldset).toHaveClass('fc-fieldset', 'extra-fieldset')
    expect(screen.getByText('Optional')).toHaveClass('fc-fieldset__hint')
    expect(screen.getByText('Fields')).toHaveClass('fc-fieldset__body')
  })
})
