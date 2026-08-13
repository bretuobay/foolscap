import {
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  type InjectionKey,
  type VNode,
} from 'vue'
import { createRating, type Rating as RatingMachine } from '@web-loom/foolscap-core'
import { useMachine } from '../composables/useMachine'
import { cx } from '../utils/cx'

interface RatingContextValue {
  machine: RatingMachine
  icon: { value: string | VNode }
}

const RatingKey: InjectionKey<RatingContextValue> = Symbol('fc-rating')

function useRatingContext(): RatingContextValue {
  const ctx = inject(RatingKey, null)
  if (!ctx) throw new Error('Rating components must be used inside RatingRoot')
  return ctx
}

export interface RatingRootProps {
  max?: number
  value?: number
  defaultValue?: number
  readOnly?: boolean
  disabled?: boolean
  name?: string
  icon?: string
}

export interface RatingItemProps {
  value: number
}

export const RatingRoot = defineComponent({
  name: 'FcRatingRoot',
  inheritAttrs: false,
  props: {
    max: { type: Number, default: 5 },
    value: { type: Number, default: undefined },
    modelValue: { type: Number, default: undefined },
    defaultValue: { type: Number, default: undefined },
    readOnly: { type: Boolean, default: undefined },
    disabled: { type: Boolean, default: undefined },
    name: { type: String, default: undefined },
    icon: { type: String, default: '★' },
  },
  emits: ['valueChange', 'hoverChange', 'update:modelValue'],
  setup(props, { slots, attrs, emit }) {
    const defaultValue = props.defaultValue
    const machine = useMachine(() =>
      createRating({
        get max() {
          return props.max
        },
        get value() {
          return props.modelValue !== undefined ? props.modelValue : props.value
        },
        defaultValue,
        get readOnly() {
          return props.readOnly
        },
        get disabled() {
          return props.disabled
        },
        get name() {
          return props.name
        },
        onValueChange: (value) => {
          emit('update:modelValue', value)
          emit('valueChange', value)
        },
        onHoverChange: (value) => emit('hoverChange', value),
      }),
    )

    provide(RatingKey, {
      machine,
      icon: {
        get value() {
          return (slots.icon?.()?.[0] as VNode | undefined) ?? props.icon
        },
      },
    })

    return () => {
      const rootProps = machine.getRootProps()
      const { class: className, 'aria-label': ariaLabel, ...rest } = attrs

      return h(
        'div',
        {
          ...rest,
          ref: (el: unknown) => machine.setRootEl(el instanceof HTMLDivElement ? el : null),
          role: rootProps.role,
          'aria-label': (ariaLabel as string | undefined) ?? rootProps['aria-label'],
          'aria-required': rootProps['aria-required'],
          'data-state': rootProps['data-state'],
          onMouseleave: rootProps.onMouseLeave,
          class: cx('fc-rating', className as string | undefined),
        },
        slots.default?.() ?? [h(RatingItems)],
      )
    }
  },
})

export const RatingItems = defineComponent({
  name: 'FcRatingItems',
  setup() {
    const { machine } = useRatingContext()

    return () => {
      void machine.state
      const { max, isReadOnly } = machine.state
      const values = Array.from({ length: max }, (_, index) => index + 1)

      return [
        !isReadOnly ? h(RatingValueLabel) : null,
        ...values.map((value) =>
          isReadOnly
            ? h(RatingReadOnlyIcon, { key: value, value })
            : h(RatingItem, { key: value, value }),
        ),
      ].filter((node) => node != null)
    }
  },
})

export const RatingValueLabel = defineComponent({
  name: 'FcRatingValueLabel',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const { machine } = useRatingContext()

    return () => {
      void machine.state
      const { selectedValue, max } = machine.state
      const labelProps = machine.getValueLabelProps()
      return h(
        'span',
        {
          ...attrs,
          'aria-live': labelProps['aria-live'],
          class: cx('fc-rating__value-label', attrs.class as string | undefined),
        },
        `${selectedValue} out of ${max} ${max === 1 ? 'star' : 'stars'}`,
      )
    }
  },
})

export const RatingItem = defineComponent({
  name: 'FcRatingItem',
  inheritAttrs: false,
  props: {
    value: { type: Number, required: true },
  },
  setup(props, { attrs }) {
    const { machine, icon } = useRatingContext()
    const inputEl = ref<HTMLInputElement | null>(null)

    function handleKeyDown(event: KeyboardEvent) {
      machine.getInputProps(props.value).onKeyDown(event)
    }

    onMounted(() => {
      inputEl.value?.addEventListener('keydown', handleKeyDown)
    })
    onBeforeUnmount(() => {
      inputEl.value?.removeEventListener('keydown', handleKeyDown)
    })

    return () => {
      void machine.state
      const itemProps = machine.getItemProps(props.value)
      const inputProps = machine.getInputProps(props.value)
      const iconProps = machine.getIconProps(props.value)

      return h(
        'label',
        {
          'data-state': itemProps['data-state'],
          onMouseenter: itemProps.onMouseEnter,
          class: cx('fc-rating__item', attrs.class as string | undefined),
        },
        [
          h('input', {
            ref: inputEl,
            class: 'fc-rating__input',
            type: inputProps.type,
            name: inputProps.name,
            value: inputProps.value,
            checked: inputProps.checked,
            disabled: inputProps.disabled,
            'aria-label': inputProps['aria-label'],
            onChange: (event: Event) => {
              inputProps.onChange()
              const input = event.target as HTMLInputElement
              const selected = machine.state.selectedValue
              document.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${input.name}"]`).forEach((el) => {
                el.checked = Number(el.value) === selected
              })
            },
          }),
          h('span', { class: 'fc-rating__icon', 'aria-hidden': iconProps['aria-hidden'] }, icon.value),
        ],
      )
    }
  },
})

export const RatingReadOnlyIcon = defineComponent({
  name: 'FcRatingReadOnlyIcon',
  inheritAttrs: false,
  props: {
    value: { type: Number, required: true },
  },
  setup(props, { attrs }) {
    const { machine, icon } = useRatingContext()

    return () => {
      void machine.state
      const itemProps = machine.getItemProps(props.value)
      const iconProps = machine.getIconProps(props.value)

      return h('span', { 'data-state': itemProps['data-state'], class: cx('fc-rating__item', attrs.class as string | undefined) }, [
        h('span', { class: 'fc-rating__icon', 'aria-hidden': iconProps['aria-hidden'] }, icon.value),
      ])
    }
  },
})
