import { createStore } from '@web-loom/store-core'
import { dispatch } from '../utils/events'

export interface FieldConfig {
  required?: boolean
  validate?: (value: string) => string | null
}

export interface FormOptions {
  fields?: Record<string, FieldConfig>
  onSubmit?: (values: Record<string, string>) => void | Promise<void>
  onInvalid?: (errors: Record<string, string>) => void
}

export interface FormState {
  errors: Record<string, string>
  isSubmitting: boolean
  touched: Record<string, boolean>
}

export interface Form {
  readonly state: FormState
  getFieldProps(name: string): {
    name: string
    'aria-invalid': boolean
    'aria-describedby': string
    onBlur(): void
  }
  getErrorProps(name: string): {
    id: string
    role: 'alert'
    hidden: boolean
  }
  getFormProps(): {
    noValidate: true
    onSubmit(e: SubmitEvent): void
  }
  setError(name: string, message: string): void
  clearError(name: string): void
  subscribe(listener: (s: FormState, prev: FormState) => void): () => void
  destroy(): void
}

export function createForm(formEl: HTMLFormElement, options: FormOptions = {}): Form {
  const store = createStore(
    { errors: {}, isSubmitting: false, touched: {} } as FormState,
    (set) => ({
      setError(name: string, message: string) {
        set((s) => ({ ...s, errors: { ...s.errors, [name]: message } }))
      },
      clearError(name: string) {
        set((s) => {
          const { [name]: _, ...rest } = s.errors
          return { ...s, errors: rest }
        })
      },
      touch(name: string) {
        set((s) => ({ ...s, touched: { ...s.touched, [name]: true } }))
      },
      setSubmitting(v: boolean) {
        set((s) => ({ ...s, isSubmitting: v }))
      },
    })
  )

  function validateField(name: string, value: string): string | null {
    const config = options.fields?.[name]
    if (!config) return null
    if (config.required && !value.trim()) return 'This field is required'
    return config.validate?.(value) ?? null
  }

  function getFormValues(): Record<string, string> {
    const data = new FormData(formEl)
    const values: Record<string, string> = {}
    data.forEach((v, k) => {
      values[k] = String(v)
    })
    return values
  }

  return {
    get state() {
      return store.getState()
    },

    getFieldProps(name) {
      const { errors } = store.getState()
      return {
        name,
        'aria-invalid': Boolean(errors[name]),
        'aria-describedby': `${name}-error`,
        onBlur() {
          store.actions.touch(name)
          const values = getFormValues()
          const err = validateField(name, values[name] ?? '')
          if (err) store.actions.setError(name, err)
          else store.actions.clearError(name)
        },
      }
    },

    getErrorProps(name) {
      const { errors } = store.getState()
      return {
        id: `${name}-error`,
        role: 'alert',
        hidden: !errors[name],
      }
    },

    getFormProps() {
      return {
        noValidate: true,
        onSubmit(e: SubmitEvent) {
          e.preventDefault()
          const values = getFormValues()
          const errors: Record<string, string> = {}
          if (options.fields) {
            for (const name of Object.keys(options.fields)) {
              const err = validateField(name, values[name] ?? '')
              if (err) errors[name] = err
            }
          }
          if (Object.keys(errors).length > 0) {
            for (const [name, msg] of Object.entries(errors)) {
              store.actions.setError(name, msg)
            }
            options.onInvalid?.(errors)
            dispatch(formEl, 'invalid', { errors })
            return
          }
          store.actions.setSubmitting(true)
          Promise.resolve(options.onSubmit?.(values)).then(() => {
            store.actions.setSubmitting(false)
            dispatch(formEl, 'submit', { values })
          })
        },
      }
    },

    setError: store.actions.setError,
    clearError: store.actions.clearError,
    subscribe: store.subscribe.bind(store),
    destroy: store.destroy.bind(store),
  }
}
