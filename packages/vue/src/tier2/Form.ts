import {
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowRef,
  triggerRef,
  type InjectionKey,
  type PropType,
} from 'vue'
import { createForm, type FieldConfig, type Form as FormMachine, type FormOptions } from '@web-loom/foolscap-core'
import { cx } from '../utils/cx'

export type { FieldConfig }

interface FormContextValue {
  machine: { value: FormMachine | null }
}

const FormKey: InjectionKey<FormContextValue> = Symbol('fc-form')

export function useFormContext(): FormContextValue {
  return inject(FormKey, { machine: { value: null } })
}

export interface FormRootProps {
  fields?: FormOptions['fields']
}

export const FormRoot = defineComponent({
  name: 'FcFormRoot',
  inheritAttrs: false,
  props: {
    fields: { type: Object as PropType<FormOptions['fields']>, default: undefined },
  },
  emits: ['submit', 'invalid'],
  setup(props, { slots, attrs, emit }) {
    const formEl = ref<HTMLFormElement | null>(null)
    const machine = shallowRef<FormMachine | null>(null)
    let unsubscribe: (() => void) | undefined

    onMounted(() => {
      const el = formEl.value
      if (!el) return

      const instance = createForm(el, {
        get fields() {
          return props.fields
        },
        onSubmit: (values) => emit('submit', values),
        onInvalid: (errors) => emit('invalid', errors),
      })
      machine.value = instance
      unsubscribe = instance.subscribe(() => triggerRef(machine))
    })

    onBeforeUnmount(() => {
      unsubscribe?.()
      machine.value?.destroy()
      machine.value = null
    })

    provide(FormKey, { machine })

    function handleSubmit(event: Event) {
      event.preventDefault()
      machine.value?.getFormProps().onSubmit(event as SubmitEvent)
    }

    return () => {
      const formProps = machine.value?.getFormProps()
      const state = machine.value?.state ?? { errors: {}, isSubmitting: false, touched: {} }

      return h(
        'form',
        {
          ...attrs,
          ref: formEl,
          noValidate: formProps?.noValidate ?? true,
          onSubmit: handleSubmit,
          'data-state': state.isSubmitting
            ? 'submitting'
            : Object.keys(state.errors).length > 0
              ? 'error'
              : 'idle',
          class: cx('fc-form', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
    }
  },
})

export interface FormErrorSummaryProps {
  heading?: string
}

export const FormErrorSummary = defineComponent({
  name: 'FcFormErrorSummary',
  inheritAttrs: false,
  props: {
    heading: { type: String, default: 'Please fix the following errors:' },
  },
  setup(props, { attrs }) {
    const { machine } = useFormContext()

    return () => {
      const errors = machine.value?.state.errors ?? {}
      const hasErrors = Object.keys(errors).length > 0

      return h(
        'div',
        {
          ...attrs,
          role: 'alert',
          hidden: !hasErrors,
          class: cx('fc-form__error-summary', attrs.class as string | undefined),
        },
        [
          h('p', null, props.heading),
          h(
            'ul',
            null,
            Object.entries(errors).map(([name, message]) =>
              h('li', { key: name }, [h('a', { href: `#${name}` }, message)]),
            ),
          ),
        ],
      )
    }
  },
})

export const FormFields = defineComponent({
  name: 'FcFormFields',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: cx('fc-form__fields', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const FormActions = defineComponent({
  name: 'FcFormActions',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: cx('fc-form__actions', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})
