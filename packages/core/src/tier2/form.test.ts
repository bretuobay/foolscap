import { describe, it, expect, afterEach } from 'vitest'
import { createForm } from './form'
import { fixture } from '../utils/test-helpers'

describe('createForm', () => {
  let cleanup: () => void
  afterEach(() => cleanup?.())

  function setup(html = '<form><input name="email" /><button type="submit">Go</button></form>') {
    const { container, cleanup: c } = fixture(html)
    cleanup = c
    const formEl = container.querySelector<HTMLFormElement>('form')!
    return { container, formEl }
  }

  it('initial state has no errors', () => {
    const { formEl } = setup()
    const f = createForm(formEl)
    expect(f.state.errors).toEqual({})
    f.destroy()
  })

  it('aria-invalid is false initially', () => {
    const { formEl } = setup()
    const f = createForm(formEl)
    expect(f.getFieldProps('email')['aria-invalid']).toBe(false)
    f.destroy()
  })

  it('setError sets aria-invalid to true', () => {
    const { formEl } = setup()
    const f = createForm(formEl)
    f.setError('email', 'Required')
    expect(f.getFieldProps('email')['aria-invalid']).toBe(true)
    f.destroy()
  })

  it('clearError removes the error', () => {
    const { formEl } = setup()
    const f = createForm(formEl)
    f.setError('email', 'Required')
    f.clearError('email')
    expect(f.getFieldProps('email')['aria-invalid']).toBe(false)
    f.destroy()
  })

  it('getErrorProps hidden is true when no error', () => {
    const { formEl } = setup()
    const f = createForm(formEl)
    expect(f.getErrorProps('email').hidden).toBe(true)
    f.destroy()
  })

  it('getErrorProps hidden is false when error exists', () => {
    const { formEl } = setup()
    const f = createForm(formEl)
    f.setError('email', 'bad')
    expect(f.getErrorProps('email').hidden).toBe(false)
    f.destroy()
  })

  it('required field fails validation on submit', () => {
    const { formEl } = setup()
    const errors: Record<string, string>[] = []
    const f = createForm(formEl, {
      fields: { email: { required: true } },
      onInvalid: (e) => errors.push(e),
    })
    const formProps = f.getFormProps()
    formProps.onSubmit(new SubmitEvent('submit'))
    expect(errors[0]).toHaveProperty('email')
    f.destroy()
  })

  it('fc:invalid fires on invalid submit', () => {
    const { formEl } = setup()
    let fired = false
    formEl.addEventListener('fc:invalid', () => {
      fired = true
    })
    const f = createForm(formEl, { fields: { email: { required: true } } })
    f.getFormProps().onSubmit(new SubmitEvent('submit'))
    expect(fired).toBe(true)
    f.destroy()
  })

  it('onSubmit called and fc:submit fires when valid', async () => {
    const { formEl } = setup()
    let submitted = false
    formEl.addEventListener('fc:submit', () => {
      submitted = true
    })
    const f = createForm(formEl, { onSubmit: async () => {} })
    f.getFormProps().onSubmit(new SubmitEvent('submit'))
    await new Promise((r) => setTimeout(r, 50))
    expect(submitted).toBe(true)
    f.destroy()
  })
})
