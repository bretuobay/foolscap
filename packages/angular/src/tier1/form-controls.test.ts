import { screen } from '@testing-library/angular'
import { describe, expect, it, vi } from 'vitest'
import { render } from '../test-helpers'
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
  it('renders text input and textarea with invalid state mapping', async () => {
    await render(`<input fc-text-input aria-label="Name" class="extra-input" [invalid]="true" size="lg" />`, {
      imports: [TextInput],
    })
    const name = screen.getByRole('textbox', { name: 'Name' })
    expect(name).toHaveClass('fc-text-input', 'extra-input')
    expect(name).toHaveAttribute('aria-invalid', 'true')
    expect(name).toHaveAttribute('data-size', 'lg')
    expect(name).toHaveAttribute('data-state', 'error')

    await render(`<textarea fc-textarea aria-label="Message" class="extra-area" [invalid]="true"></textarea>`, {
      imports: [Textarea],
    })
    const message = screen.getByRole('textbox', { name: 'Message' })
    expect(message).toHaveClass('fc-textarea', 'extra-area')
    expect(message).toHaveAttribute('data-state', 'error')
  })

  it('associates checkbox and radio labels with native inputs', async () => {
    await render(
      `<fc-checkbox label="Accept terms" name="terms" id="terms" inputClass="extra-check" />`,
      { imports: [Checkbox] },
    )
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toHaveClass('fc-checkbox__input', 'extra-check')

    await render(
      `<fc-radio-button label="Email" name="contact" value="email" id="contact-email" inputClass="extra-radio" />`,
      { imports: [RadioButton] },
    )
    expect(screen.getByRole('radio', { name: 'Email' })).toHaveClass('fc-radio-button__input', 'extra-radio')
  })

  it('syncs checkbox indeterminate state onto the native input', async () => {
    await render(`<fc-checkbox label="Select all" [indeterminate]="true" />`, { imports: [Checkbox] })
    const checkbox = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement
    expect(checkbox.indeterminate).toBe(true)
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
  })

  it('renders search input with clear action', async () => {
    const onClear = vi.fn()
    await render(
      `<fc-search-input aria-label="Search projects" inputClass="extra-search" (clear)="onClear()" />`,
      {
        imports: [SearchInput],
        componentProperties: { onClear },
      },
    )
    expect(screen.getByRole('searchbox', { name: 'Search projects' })).toHaveClass(
      'fc-search-input__field',
      'extra-search',
    )
    screen.getByRole('button', { name: 'Clear search' }).click()
    expect(onClear).toHaveBeenCalledOnce()
  })

  it('renders date input and slider using native input types', async () => {
    await render(`<input fc-date-input aria-label="Due date" class="extra-date" />`, { imports: [DateInput] })
    expect(screen.getByLabelText('Due date')).toHaveAttribute('type', 'date')
    expect(screen.getByLabelText('Due date')).toHaveClass('fc-date-input', 'extra-date')

    await render(`<input fc-slider aria-label="Volume" min="0" max="100" value="40" class="extra-slider" />`, {
      imports: [Slider],
    })
    expect(screen.getByRole('slider', { name: 'Volume' })).toHaveClass('fc-slider', 'extra-slider')
  })

  it('renders color picker with a labelled native color input and value display', async () => {
    await render(`<fc-color-picker label="Brand color" defaultValue="#123456" />`, { imports: [ColorPicker] })
    expect(screen.getByLabelText('Brand color')).toHaveAttribute('type', 'color')
    expect(screen.getByText('#123456')).toHaveClass('fc-color-picker__value')
  })

  it('renders file and fieldset with class contracts', async () => {
    await render(`<fc-file label="Upload" class="extra-file" />`, { imports: [File] })
    expect(document.querySelector('.fc-file')).toHaveClass('fc-file', 'extra-file')

    await render(`<fieldset fc-fieldset legend="Account" class="extra-fieldset">Body</fieldset>`, {
      imports: [Fieldset],
    })
    expect(screen.getByRole('group', { name: 'Account' })).toHaveClass('fc-fieldset', 'extra-fieldset')
  })
})
