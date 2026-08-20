import { fireEvent, render, screen, waitFor } from '@testing-library/angular'
import { describe, expect, it } from 'vitest'
import { SelectListbox, SelectRoot, SelectTrigger } from './Select'

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

const selectImports = [SelectRoot, SelectTrigger, SelectListbox]

const selectTemplate = `
  <fc-select [options]="options" [name]="name" [defaultValue]="defaultValue" placeholder="Pick fruit">
    <button fc-select-trigger></button>
    <div fc-select-listbox></div>
  </fc-select>
`

describe('Select', () => {
  it('renders a combobox trigger with placeholder text', async () => {
    await render(selectTemplate, {
      imports: selectImports,
      componentProperties: { options: OPTIONS },
    })
    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveClass('fc-select__trigger')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveTextContent('Pick fruit')
  })

  it('opens the listbox on click and shows options', async () => {
    await render(selectTemplate, {
      imports: selectImports,
      componentProperties: { options: OPTIONS },
    })
    await fireEvent.click(screen.getByRole('combobox'))
    await waitFor(() => {
      expect(screen.getByRole('listbox')).not.toHaveAttribute('hidden')
    })
    expect(screen.getByRole('option', { name: /Apple/ })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Banana/ })).toBeInTheDocument()
  })

  it('selects an option and updates the trigger label', async () => {
    await render(selectTemplate, {
      imports: selectImports,
      componentProperties: { options: OPTIONS },
    })
    await fireEvent.click(screen.getByRole('combobox'))
    await waitFor(() => expect(screen.getByRole('listbox')).not.toHaveAttribute('hidden'))
    await fireEvent.click(screen.getByRole('option', { name: /Banana/ }))
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveTextContent('Banana')
      expect(screen.getByRole('listbox', { hidden: true })).toHaveAttribute('hidden')
    })
  })

  it('serializes the selected value into FormData via the hidden native select', async () => {
    const { container } = await render(
      `
        <form>
          <fc-select [options]="options" name="fruit" defaultValue="apple">
            <button fc-select-trigger></button>
            <div fc-select-listbox></div>
          </fc-select>
        </form>
      `,
      {
        imports: selectImports,
        componentProperties: { options: OPTIONS },
      },
    )
    const form = container.querySelector('form') as HTMLFormElement
    expect(new FormData(form).get('fruit')).toBe('apple')
  })
})
