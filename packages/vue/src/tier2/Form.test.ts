import { defineComponent, h, nextTick } from 'vue'
import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { FormActions, FormErrorSummary, FormFields, FormRoot } from './Form'

describe('Form', () => {
  it('renders a form with idle state', () => {
    const { container } = render(FormRoot, { attrs: { class: 'extra-form' } })
    const form = container.querySelector('form') as HTMLFormElement
    expect(form).toHaveClass('fc-form', 'extra-form')
    expect(form).toHaveAttribute('data-state', 'idle')
    expect(form).toHaveAttribute('novalidate')
  })

  it('emits invalid when required fields are empty', async () => {
    const onInvalid = vi.fn()
    const Fixture = defineComponent({
      setup() {
        return () =>
          h(
            FormRoot,
            { fields: { name: { required: true } }, onInvalid },
            {
              default: () => [
                h(FormErrorSummary, { heading: 'Fix these' }),
                h('input', { name: 'name' }),
              ],
            },
          )
      },
    })

    const { container } = render(Fixture)
    await nextTick()
    const form = container.querySelector('form') as HTMLFormElement
    await fireEvent.submit(form)
    await nextTick()
    expect(onInvalid).toHaveBeenCalledOnce()
    expect(form).toHaveAttribute('data-state', 'error')
    expect(screen.getByRole('alert')).toHaveClass('fc-form__error-summary')
    expect(screen.getByText('Fix these')).toBeInTheDocument()
  })

  it('renders field and action wrappers', () => {
    render(FormFields, { attrs: { class: 'extra-fields' }, slots: { default: 'fields' } })
    expect(screen.getByText('fields')).toHaveClass('fc-form__fields', 'extra-fields')
    render(FormActions, { attrs: { class: 'extra-actions' }, slots: { default: 'actions' } })
    expect(screen.getByText('actions')).toHaveClass('fc-form__actions', 'extra-actions')
    render(FormErrorSummary, { props: { heading: 'Fix these' } })
    expect(screen.getByRole('alert', { hidden: true })).toHaveClass('fc-form__error-summary')
  })
})
