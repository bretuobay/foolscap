import { defineComponent, h, nextTick } from 'vue'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { SelectListbox, SelectRoot, SelectTrigger } from './Select'

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

const SelectFixture = defineComponent({
  props: {
    name: { type: String, default: undefined },
    defaultValue: { type: String, default: undefined },
    placeholder: { type: String, default: 'Pick fruit' },
  },
  setup(props) {
    return () =>
      h(SelectRoot, {
        options: OPTIONS,
        name: props.name,
        defaultValue: props.defaultValue,
        placeholder: props.placeholder,
      }, {
        default: () => [h(SelectTrigger), h(SelectListbox)],
      })
  },
})

describe('Select', () => {
  it('renders a combobox trigger with placeholder text', () => {
    render(SelectFixture)
    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveClass('fc-select__trigger')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveTextContent('Pick fruit')
  })

  it('opens the listbox on click and shows options', async () => {
    render(SelectFixture)
    await nextTick()
    await fireEvent.click(screen.getByRole('combobox'))
    await waitFor(() => {
      expect(screen.getByRole('listbox')).not.toHaveAttribute('hidden')
    })
    expect(screen.getByRole('option', { name: /Apple/ })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Banana/ })).toBeInTheDocument()
  })

  it('selects an option and updates the trigger label', async () => {
    render(SelectFixture)
    await nextTick()
    await fireEvent.click(screen.getByRole('combobox'))
    await waitFor(() => expect(screen.getByRole('listbox')).not.toHaveAttribute('hidden'))
    await fireEvent.click(screen.getByRole('option', { name: /Banana/ }))
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveTextContent('Banana')
      expect(screen.getByRole('listbox', { hidden: true })).toHaveAttribute('hidden')
    })
  })

  it('serializes the selected value into FormData via the hidden native select', async () => {
    const { container } = render(
      defineComponent({
        setup() {
          return () =>
            h('form', null, [
              h(SelectRoot, { options: OPTIONS, name: 'fruit', defaultValue: 'apple' }, {
                default: () => [h(SelectTrigger), h(SelectListbox)],
              }),
            ])
        },
      }),
    )
    const form = container.querySelector('form') as HTMLFormElement
    expect(new FormData(form).get('fruit')).toBe('apple')
  })
})
