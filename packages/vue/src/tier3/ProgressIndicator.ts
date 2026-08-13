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
import {
  createProgressIndicator,
  type ProgressIndicator as ProgressIndicatorMachine,
  type ProgressIndicatorOrientation,
  type ProgressIndicatorStep,
} from '@web-loom/foolscap-core'
import { useMachine } from '../composables/useMachine'
import { cx } from '../utils/cx'

export type { ProgressIndicatorStep, ProgressIndicatorOrientation }

interface ProgressIndicatorContextValue {
  machine: ProgressIndicatorMachine
  steps: { value: ProgressIndicatorStep[] }
  injectIndicatorEl: (index: number, el: HTMLDivElement | null) => void
}

const ProgressIndicatorKey: InjectionKey<ProgressIndicatorContextValue> = Symbol('fc-progress-indicator')

function useProgressIndicatorContext(): ProgressIndicatorContextValue {
  const ctx = inject(ProgressIndicatorKey, null)
  if (!ctx) throw new Error('ProgressIndicator components must be used inside ProgressIndicatorRoot')
  return ctx
}

export interface ProgressIndicatorRootProps {
  steps: ProgressIndicatorStep[]
  step?: number
  defaultStep?: number
  linear?: boolean
  orientation?: ProgressIndicatorOrientation
  label?: string
}

export interface ProgressIndicatorStepProps {
  index: number
}

export const ProgressIndicatorRoot = defineComponent({
  name: 'FcProgressIndicatorRoot',
  inheritAttrs: false,
  props: {
    steps: { type: Array as PropType<ProgressIndicatorStep[]>, required: true },
    step: { type: Number, default: undefined },
    modelValue: { type: Number, default: undefined },
    defaultStep: { type: Number, default: undefined },
    linear: { type: Boolean, default: true },
    orientation: { type: String as PropType<ProgressIndicatorOrientation>, default: 'horizontal' },
    label: { type: String, default: 'Progress' },
  },
  emits: ['stepChange', 'update:modelValue'],
  setup(props, { slots, attrs, emit }) {
    const defaultStep = props.defaultStep
    const machine = useMachine(() =>
      createProgressIndicator({
        get steps() {
          return props.steps
        },
        get step() {
          return props.modelValue !== undefined ? props.modelValue : props.step
        },
        defaultStep,
        get linear() {
          return props.linear
        },
        get orientation() {
          return props.orientation
        },
        onStepChange: (step, prevStep, direction) => {
          emit('update:modelValue', step)
          emit('stepChange', step, prevStep, direction)
        },
      }),
    )

    provide(ProgressIndicatorKey, {
      machine,
      steps: {
        get value() {
          return props.steps
        },
      },
      injectIndicatorEl: (index, el) => machine.setStepIndicatorEl(index, el),
    })

    return () => {
      const rootProps = machine.getRootProps()
      const { class: className, 'aria-label': ariaLabel, ...rest } = attrs

      return h(
        'ol',
        {
          ...rest,
          ref: (el: unknown) => machine.setRootEl(el instanceof HTMLOListElement ? el : null),
          'aria-label': (ariaLabel as string | undefined) ?? props.label ?? rootProps['aria-label'],
          'data-orientation': rootProps['data-orientation'],
          'data-linear': rootProps['data-linear'],
          class: cx('fc-progress-indicator', className as string | undefined),
        },
        slots.default?.() ??
          props.steps.map((item, index) =>
            h(ProgressIndicatorStepView, { key: `${item.label}-${index}`, index }),
          ),
      )
    }
  },
})

export const ProgressIndicatorStepView = defineComponent({
  name: 'FcProgressIndicatorStepView',
  inheritAttrs: false,
  props: {
    index: { type: Number, required: true },
  },
  setup(props, { slots, attrs }) {
    const { machine, steps } = useProgressIndicatorContext()

    return () => {
      void machine.state
      const step = steps.value[props.index]
      const stepProps = machine.getStepProps(props.index)

      return h(
        'li',
        {
          ...attrs,
          id: (attrs.id as string | undefined) ?? stepProps.id,
          'data-state': stepProps['data-state'],
          'aria-current': stepProps['aria-current'],
          class: cx('fc-progress-indicator__step', attrs.class as string | undefined),
        },
        slots.default?.() ?? [
          h(ProgressIndicatorStepIndicator, { index: props.index }),
          h('span', { class: 'fc-progress-indicator__content' }, [
            h(ProgressIndicatorStepLabel, { index: props.index }, { default: () => step?.label }),
            step?.description
              ? h(
                  ProgressIndicatorStepDescription,
                  { index: props.index },
                  { default: () => step.description },
                )
              : null,
          ].filter((node) => node != null)),
          h(ProgressIndicatorStepSrStatus, { index: props.index }),
        ],
      )
    }
  },
})

export const ProgressIndicatorStepIndicator = defineComponent({
  name: 'FcProgressIndicatorStepIndicator',
  inheritAttrs: false,
  props: {
    index: { type: Number, required: true },
  },
  setup(props, { slots, attrs }) {
    const { machine, injectIndicatorEl } = useProgressIndicatorContext()
    const indicatorEl = ref<HTMLDivElement | null>(null)

    function handleKeyDown(event: KeyboardEvent) {
      machine.getStepIndicatorProps(props.index).onKeyDown(event)
    }

    onMounted(() => {
      indicatorEl.value?.addEventListener('keydown', handleKeyDown)
    })
    onBeforeUnmount(() => {
      indicatorEl.value?.removeEventListener('keydown', handleKeyDown)
    })

    return () => {
      void machine.state
      const indicatorProps = machine.getStepIndicatorProps(props.index)
      const state = machine.getStepProps(props.index)['data-state']

      return h(
        'div',
        {
          ...attrs,
          ref: (el: unknown) => {
            const node = el instanceof HTMLDivElement ? el : null
            indicatorEl.value = node
            injectIndicatorEl(props.index, node)
          },
          role: indicatorProps.role,
          tabIndex: indicatorProps.tabIndex,
          'aria-label': indicatorProps['aria-label'],
          'aria-disabled': indicatorProps['aria-disabled'],
          'data-disabled': indicatorProps['data-disabled'],
          onClick: indicatorProps.onClick,
          class: cx('fc-progress-indicator__step-indicator', attrs.class as string | undefined),
        },
        slots.default?.() ?? (state === 'complete' ? '✓' : props.index + 1),
      )
    }
  },
})

export const ProgressIndicatorStepLabel = defineComponent({
  name: 'FcProgressIndicatorStepLabel',
  inheritAttrs: false,
  props: {
    index: { type: Number, required: true },
  },
  setup(props, { slots, attrs }) {
    const { machine } = useProgressIndicatorContext()

    return () => {
      void machine.state
      return h(
        'span',
        {
          ...attrs,
          id: (attrs.id as string | undefined) ?? machine.getStepLabelProps(props.index).id,
          class: cx('fc-progress-indicator__step-label', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
    }
  },
})

export const ProgressIndicatorStepDescription = defineComponent({
  name: 'FcProgressIndicatorStepDescription',
  inheritAttrs: false,
  props: {
    index: { type: Number, required: true },
  },
  setup(props, { slots, attrs }) {
    const { machine } = useProgressIndicatorContext()

    return () => {
      void machine.state
      return h(
        'span',
        {
          ...attrs,
          id: (attrs.id as string | undefined) ?? machine.getStepDescriptionProps(props.index).id,
          class: cx('fc-progress-indicator__step-description', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
    }
  },
})

export const ProgressIndicatorStepSrStatus = defineComponent({
  name: 'FcProgressIndicatorStepSrStatus',
  inheritAttrs: false,
  props: {
    index: { type: Number, required: true },
  },
  setup(props, { slots, attrs }) {
    const { machine } = useProgressIndicatorContext()

    return () => {
      void machine.state
      const statusProps = machine.getStepSrStatusProps(props.index)
      return h(
        'span',
        {
          ...attrs,
          class: cx('fc-progress-indicator__step-sr-status', attrs.class as string | undefined),
        },
        slots.default?.() ?? statusProps.children,
      )
    }
  },
})
