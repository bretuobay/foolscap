import {
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  type InjectionKey,
  type PropType,
} from 'vue'
import { createStepper, type Stepper as StepperMachine } from '@web-loom/foolscap-core'
import { useMachine } from '../composables/useMachine'
import { cx } from '../utils/cx'

interface StepperContextValue {
  machine: StepperMachine
}

const StepperKey: InjectionKey<StepperContextValue> = Symbol('fc-stepper')

function useStepperContext(): StepperContextValue {
  const ctx = inject(StepperKey, null)
  if (!ctx) throw new Error('Stepper components must be used inside StepperRoot')
  return ctx
}

export interface StepperRootProps {
  label: string
  min?: number
  max?: number
  step?: number
  largeStep?: number
  value?: number
  defaultValue?: number
  name?: string
  disabled?: boolean
  editable?: boolean
  size?: 'sm' | 'md' | 'lg'
  formatValue?: (value: number) => string
}

export const StepperRoot = defineComponent({
  name: 'FcStepperRoot',
  inheritAttrs: false,
  props: {
    label: { type: String, required: true },
    min: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
    step: { type: Number, default: undefined },
    largeStep: { type: Number, default: undefined },
    value: { type: Number, default: undefined },
    modelValue: { type: Number, default: undefined },
    defaultValue: { type: Number, default: undefined },
    name: { type: String, default: undefined },
    disabled: { type: Boolean, default: undefined },
    editable: { type: Boolean, default: undefined },
    size: { type: String as PropType<StepperRootProps['size']>, default: undefined },
    formatValue: { type: Function as PropType<(value: number) => string>, default: undefined },
  },
  emits: ['valueChange', 'update:modelValue'],
  setup(props, { slots, attrs, emit }) {
    const defaultValue = props.defaultValue
    const machine = useMachine(() =>
      createStepper({
        get min() {
          return props.min
        },
        get max() {
          return props.max
        },
        get step() {
          return props.step
        },
        get largeStep() {
          return props.largeStep
        },
        get value() {
          return props.modelValue !== undefined ? props.modelValue : props.value
        },
        defaultValue,
        get name() {
          return props.name
        },
        get disabled() {
          return props.disabled
        },
        get editable() {
          return props.editable
        },
        get formatValue() {
          return props.formatValue
        },
        onValueChange: (value, prevValue) => {
          emit('update:modelValue', value)
          emit('valueChange', value, prevValue)
        },
      }),
    )

    provide(StepperKey, { machine })

    return () => {
      const rootProps = machine.getRootProps()
      const { class: className, ...rest } = attrs

      return h(
        'div',
        {
          ...rest,
          ref: (el: unknown) => machine.setRootEl(el instanceof HTMLDivElement ? el : null),
          role: rootProps.role,
          'aria-labelledby': rootProps['aria-labelledby'],
          'data-state': rootProps['data-state'],
          'data-size': props.size,
          class: cx('fc-stepper', className as string | undefined),
        },
        slots.default?.() ?? [
          h(StepperLabel, null, { default: () => props.label }),
          h('div', { class: 'fc-stepper__controls' }, [h(StepperDecrement), h(StepperInput), h(StepperIncrement)]),
          h(StepperHiddenInput),
        ],
      )
    }
  },
})

export const StepperLabel = defineComponent({
  name: 'FcStepperLabel',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const { machine } = useStepperContext()

    return () => {
      void machine.state
      const labelProps = machine.getLabelProps()
      return h(
        'label',
        {
          ...attrs,
          id: (attrs.id as string | undefined) ?? labelProps.id,
          for: (attrs.for as string | undefined) ?? labelProps.htmlFor,
          class: cx('fc-stepper__label', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
    }
  },
})

export const StepperDecrement = defineComponent({
  name: 'FcStepperDecrement',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const { machine } = useStepperContext()

    return () => {
      void machine.state
      const decrementProps = machine.getDecrementProps()
      const { class: className, 'aria-label': ariaLabel, disabled, ...rest } = attrs

      return h(
        'button',
        {
          ...rest,
          type: decrementProps.type,
          'aria-label': (ariaLabel as string | undefined) ?? decrementProps['aria-label'],
          'aria-controls': decrementProps['aria-controls'],
          'aria-disabled': decrementProps['aria-disabled'],
          disabled: (disabled as boolean | undefined) ?? decrementProps.disabled,
          onClick: decrementProps.onClick,
          onPointerdown: decrementProps.onPointerDown,
          onPointerup: decrementProps.onPointerUp,
          onPointercancel: decrementProps.onPointerCancel,
          onKeyup: decrementProps.onKeyUp,
          class: cx('fc-stepper__decrement', className as string | undefined),
        },
        slots.default?.() ?? '−',
      )
    }
  },
})

export const StepperInput = defineComponent({
  name: 'FcStepperInput',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const { machine } = useStepperContext()
    const inputEl = ref<HTMLDivElement | null>(null)

    function handleKeyDown(event: KeyboardEvent) {
      machine.getInputProps().onKeyDown(event)
    }

    onMounted(() => {
      inputEl.value?.addEventListener('keydown', handleKeyDown)
    })
    onBeforeUnmount(() => {
      inputEl.value?.removeEventListener('keydown', handleKeyDown)
    })

    return () => {
      void machine.state
      const inputProps = machine.getInputProps()
      const { class: className, id, ...rest } = attrs

      return h(
        'div',
        {
          ...rest,
          ref: inputEl,
          id: (id as string | undefined) ?? inputProps.id,
          role: inputProps.role,
          tabIndex: inputProps.tabIndex,
          'aria-labelledby': inputProps['aria-labelledby'],
          'aria-valuemin': inputProps['aria-valuemin'],
          'aria-valuemax': inputProps['aria-valuemax'],
          'aria-valuenow': inputProps['aria-valuenow'],
          'aria-valuetext': inputProps['aria-valuetext'],
          'aria-disabled': inputProps['aria-disabled'],
          contenteditable: inputProps.contentEditable,
          onInput: (event: Event) => inputProps.onInput((event.currentTarget as HTMLElement).textContent ?? ''),
          onBlur: (event: Event) => inputProps.onBlur((event.currentTarget as HTMLElement).textContent ?? ''),
          class: cx('fc-stepper__input', className as string | undefined),
        },
        inputProps.children,
      )
    }
  },
})

export const StepperIncrement = defineComponent({
  name: 'FcStepperIncrement',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const { machine } = useStepperContext()

    return () => {
      void machine.state
      const incrementProps = machine.getIncrementProps()
      const { class: className, 'aria-label': ariaLabel, disabled, ...rest } = attrs

      return h(
        'button',
        {
          ...rest,
          type: incrementProps.type,
          'aria-label': (ariaLabel as string | undefined) ?? incrementProps['aria-label'],
          'aria-controls': incrementProps['aria-controls'],
          'aria-disabled': incrementProps['aria-disabled'],
          disabled: (disabled as boolean | undefined) ?? incrementProps.disabled,
          onClick: incrementProps.onClick,
          onPointerdown: incrementProps.onPointerDown,
          onPointerup: incrementProps.onPointerUp,
          onPointercancel: incrementProps.onPointerCancel,
          onKeyup: incrementProps.onKeyUp,
          class: cx('fc-stepper__increment', className as string | undefined),
        },
        slots.default?.() ?? '+',
      )
    }
  },
})

export const StepperHiddenInput = defineComponent({
  name: 'FcStepperHiddenInput',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const { machine } = useStepperContext()

    return () => {
      void machine.state
      const inputProps = machine.getHiddenInputProps()
      if (!inputProps.name && !attrs.name) return null
      return h('input', {
        ...attrs,
        type: inputProps.type,
        name: (attrs.name as string | undefined) ?? inputProps.name,
        value: inputProps.value,
        readonly: true,
        class: cx('fc-stepper__hidden-input', attrs.class as string | undefined),
      })
    }
  },
})
