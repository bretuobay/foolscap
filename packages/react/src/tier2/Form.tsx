import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react'
import {
  createForm,
  type Form as FormMachine,
  type FieldConfig,
  type FormOptions,
} from '@web-loom/foolscap-core'
import { useCallbackRef } from '../utils/useCallbackRef'
import { cx } from '../utils/cx'

export type { FieldConfig }

// ─── Context ──────────────────────────────────────────────────────────────────

interface FormContextValue {
  machine: FormMachine | null
}

const FormContext = createContext<FormContextValue>({ machine: null })

export function useFormContext(): FormContextValue {
  return useContext(FormContext)
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export interface FormRootProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onInvalid'> {
  fields?: FormOptions['fields']
  onSubmit?: FormOptions['onSubmit']
  onInvalid?: FormOptions['onInvalid']
  className?: string
  children: React.ReactNode
}

export function FormRoot({
  fields,
  onSubmit,
  onInvalid,
  className,
  children,
  ...props
}: FormRootProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const machineRef = useRef<FormMachine | null>(null)
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)

  const stableOnSubmit = useCallbackRef(onSubmit)
  const stableOnInvalid = useCallbackRef(onInvalid)

  useEffect(() => {
    const el = formRef.current
    if (!el) return

    const machine = createForm(el, {
      fields,
      onSubmit: stableOnSubmit,
      onInvalid: stableOnInvalid,
    })
    machineRef.current = machine
    const unsubscribe = machine.subscribe(() => forceUpdate())

    return () => {
      unsubscribe()
      machine.destroy()
      machineRef.current = null
    }
  }, [])

  const formProps = machineRef.current?.getFormProps()
  const state = machineRef.current?.state ?? { errors: {}, isSubmitting: false, touched: {} }

  return (
    <FormContext.Provider value={{ machine: machineRef.current }}>
      <form
        ref={formRef}
        {...props}
        noValidate={formProps?.noValidate ?? true}
        onSubmit={
          formProps
            ? (e) => formProps.onSubmit(e.nativeEvent as SubmitEvent)
            : undefined
        }
        data-state={
          state.isSubmitting
            ? 'submitting'
            : Object.keys(state.errors).length > 0
              ? 'error'
              : 'idle'
        }
        className={cx('fc-form', className)}
      >
        {children}
      </form>
    </FormContext.Provider>
  )
}

// ─── Error summary ─────────────────────────────────────────────────────────────

export interface FormErrorSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string
  className?: string
}

export function FormErrorSummary({
  heading = 'Please fix the following errors:',
  className,
  ...props
}: FormErrorSummaryProps) {
  const { machine } = useFormContext()
  const errors = machine?.state.errors ?? {}
  const hasErrors = Object.keys(errors).length > 0

  return (
    <div
      role="alert"
      hidden={!hasErrors}
      className={cx('fc-form__error-summary', className)}
      {...props}
    >
      <p>{heading}</p>
      <ul>
        {Object.entries(errors).map(([name, message]) => (
          <li key={name}>
            <a href={`#${name}`}>{message}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Fields ────────────────────────────────────────────────────────────────────

export interface FormFieldsProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

export function FormFields({ className, children, ...props }: FormFieldsProps) {
  return (
    <div className={cx('fc-form__fields', className)} {...props}>
      {children}
    </div>
  )
}

// ─── Actions ───────────────────────────────────────────────────────────────────

export interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

export function FormActions({ className, children, ...props }: FormActionsProps) {
  return (
    <div className={cx('fc-form__actions', className)} {...props}>
      {children}
    </div>
  )
}
