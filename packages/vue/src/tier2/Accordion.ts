import {
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  watch,
  type InjectionKey,
  type PropType,
} from 'vue'
import { createAccordion, type Accordion } from '@web-loom/foolscap-core'
import { useMachine } from '../composables/useMachine'
import { cx } from '../utils/cx'

interface AccordionContextValue {
  machine: Accordion
}

const AccordionKey: InjectionKey<AccordionContextValue> = Symbol('fc-accordion')

export interface AccordionRootProps {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
}

export const AccordionRoot = defineComponent({
  name: 'FcAccordionRoot',
  inheritAttrs: false,
  props: {
    type: { type: String as PropType<'single' | 'multiple'>, default: 'single' },
    defaultValue: { type: [String, Array] as PropType<string | string[]>, default: undefined },
  },
  emits: ['valueChange'],
  setup(props, { slots, attrs, emit }) {
    const machine = useMachine(() =>
      createAccordion({
        type: props.type,
        defaultValue: props.defaultValue,
        onValueChange: (value) => emit('valueChange', value),
      }),
    )

    provide(AccordionKey, { machine })

    return () =>
      h(
        'div',
        {
          class: cx('fc-accordion', attrs.class as string | undefined),
          'data-type': props.type,
        },
        slots.default?.(),
      )
  },
})

function useAccordionContext(): AccordionContextValue {
  const ctx = inject(AccordionKey, null)
  if (!ctx) throw new Error('AccordionItem must be used inside AccordionRoot')
  return ctx
}

export interface AccordionItemProps {
  value: string
}

export const AccordionItem = defineComponent({
  name: 'FcAccordionItem',
  inheritAttrs: false,
  props: {
    value: { type: String, required: true },
  },
  setup(props, { slots, attrs }) {
    const { machine } = useAccordionContext()
    const detailsEl = ref<HTMLDetailsElement | null>(null)
    let unregister: (() => void) | undefined

    function register() {
      unregister?.()
      if (!detailsEl.value) return
      unregister = machine.register({ value: props.value, detailsEl: detailsEl.value })
    }

    onMounted(register)
    watch(() => props.value, register)
    onBeforeUnmount(() => unregister?.())

    return () => {
      const stateValue = machine.state.value
      const isOpen = Array.isArray(stateValue)
        ? stateValue.includes(props.value)
        : stateValue === props.value

      return h(
        'details',
        {
          ref: detailsEl,
          class: cx('fc-accordion__item', attrs.class as string | undefined),
          'data-state': isOpen ? 'open' : 'closed',
        },
        slots.default?.(),
      )
    }
  },
})

export const AccordionTrigger = defineComponent({
  name: 'FcAccordionTrigger',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'summary',
        {
          ...attrs,
          class: cx('fc-accordion__trigger', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const AccordionPanel = defineComponent({
  name: 'FcAccordionPanel',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          class: cx('fc-accordion__panel', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})
