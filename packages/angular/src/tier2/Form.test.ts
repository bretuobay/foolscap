import { fireEvent, screen } from '@testing-library/angular'
import { describe, expect, it, vi } from 'vitest'
import { render } from '../test-helpers'
import { FormActions, FormErrorSummary, FormFields, FormRoot } from './Form'

describe('Form', () => {
  it('renders a form with idle state', async () => {
    const { container } = await render(`<form fc-form class="extra-form"></form>`, { imports: [FormRoot] })
    const form = container.querySelector('form') as HTMLFormElement
    expect(form).toHaveClass('fc-form', 'extra-form')
    expect(form).toHaveAttribute('data-state', 'idle')
    expect(form).toHaveAttribute('novalidate')
  })

  it('emits invalid when required fields are empty', async () => {
    const onInvalid = vi.fn()
    const { container, fixture } = await render(
      `
        <form fc-form [fields]="fields" (invalid)="onInvalid($event)">
          <div fc-form-error-summary heading="Fix these"></div>
          <input name="name" />
        </form>
      `,
      {
        imports: [FormRoot, FormErrorSummary],
        componentProperties: {
          fields: { name: { required: true } },
          onInvalid,
        },
      },
    )
    const form = container.querySelector('form') as HTMLFormElement
    await fireEvent.submit(form)
    fixture.detectChanges()
    expect(onInvalid).toHaveBeenCalledOnce()
    expect(form).toHaveAttribute('data-state', 'error')
    expect(screen.getByRole('alert')).toHaveClass('fc-form__error-summary')
    expect(screen.getByText('Fix these')).toBeInTheDocument()
  })

  it('renders field and action wrappers', async () => {
    await render(
      `
        <div>
          <div fc-form-fields class="extra-fields">fields</div>
          <div fc-form-actions class="extra-actions">actions</div>
          <div fc-form-error-summary heading="Fix these"></div>
        </div>
      `,
      { imports: [FormFields, FormActions, FormErrorSummary] },
    )
    expect(screen.getByText('fields')).toHaveClass('fc-form__fields', 'extra-fields')
    expect(screen.getByText('actions')).toHaveClass('fc-form__actions', 'extra-actions')
    expect(screen.getByRole('alert', { hidden: true })).toHaveClass('fc-form__error-summary')
  })
})
