import { fireEvent, render, screen, waitFor } from '@testing-library/angular'
import { describe, expect, it } from 'vitest'
import { ComboboxInput, ComboboxListbox, ComboboxRoot } from './Combobox'

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
]

const comboboxImports = [ComboboxRoot, ComboboxInput, ComboboxListbox]

const comboboxTemplate = `
  <fc-combobox [options]="options">
    <fc-combobox-input label="Fruit" placeholder="Search fruit"></fc-combobox-input>
    <ul fc-combobox-listbox></ul>
  </fc-combobox>
`

describe('Combobox', () => {
  it('renders a labelled combobox input', async () => {
    await render(comboboxTemplate, {
      imports: comboboxImports,
      componentProperties: { options: OPTIONS },
    })
    const input = screen.getByRole('combobox', { name: 'Fruit' })
    expect(input).toHaveClass('fc-combobox__input')
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens the listbox on toggle and filters as the user types', async () => {
    await render(comboboxTemplate, {
      imports: comboboxImports,
      componentProperties: { options: OPTIONS },
    })
    await fireEvent.click(screen.getByRole('button', { name: 'Toggle options' }))
    await waitFor(() => expect(screen.getByRole('listbox')).not.toHaveAttribute('hidden'))
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument()

    await fireEvent.input(screen.getByRole('combobox'), { target: { value: 'ap' } })
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Apricot' })).toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Banana' })).not.toBeInTheDocument()
    })
  })
})
