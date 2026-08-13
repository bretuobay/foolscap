import { defineComponent, h, nextTick } from 'vue'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { ComboboxInput, ComboboxListbox, ComboboxRoot } from './Combobox'

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
]

const ComboboxFixture = defineComponent({
  setup() {
    return () =>
      h(ComboboxRoot, { options: OPTIONS }, {
        default: () => [
          h(ComboboxInput, { label: 'Fruit', placeholder: 'Search fruit' }),
          h(ComboboxListbox),
        ],
      })
  },
})

describe('Combobox', () => {
  it('renders a labelled combobox input', () => {
    render(ComboboxFixture)
    const input = screen.getByRole('combobox', { name: 'Fruit' })
    expect(input).toHaveClass('fc-combobox__input')
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens the listbox on toggle and filters as the user types', async () => {
    render(ComboboxFixture)
    await nextTick()
    await fireEvent.click(screen.getByRole('button', { name: 'Toggle options' }))
    await waitFor(() => expect(screen.getByRole('listbox')).not.toHaveAttribute('hidden'))
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument()

    await fireEvent.update(screen.getByRole('combobox'), 'ap')
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Apricot' })).toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Banana' })).not.toBeInTheDocument()
    })
  })
})
