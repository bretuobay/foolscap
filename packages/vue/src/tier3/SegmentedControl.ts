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
  type VNode,
} from 'vue'
import {
  createSegmentedControl,
  type SegmentedControl as SegmentedControlMachine,
  type SegmentedControlItem,
  type SegmentedControlMode,
} from '@web-loom/foolscap-core'
import { useMachine } from '../composables/useMachine'
import { cx } from '../utils/cx'

export type { SegmentedControlItem, SegmentedControlMode }

interface SegmentedControlContextValue {
  machine: SegmentedControlMachine
  items: { value: SegmentedControlItem[] }
  injectItemEl: (value: string, el: HTMLElement | null) => void
}

const SegmentedControlKey: InjectionKey<SegmentedControlContextValue> = Symbol('fc-segmented-control')

function useSegmentedControlContext(): SegmentedControlContextValue {
  const ctx = inject(SegmentedControlKey, null)
  if (!ctx) throw new Error('SegmentedControl components must be used inside SegmentedControlRoot')
  return ctx
}

export interface SegmentedControlRootProps {
  items: SegmentedControlItem[]
  value?: string
  defaultValue?: string
  mode?: SegmentedControlMode
  name?: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export interface SegmentedControlItemProps {
  item: SegmentedControlItem
}

export const SegmentedControlRoot = defineComponent({
  name: 'FcSegmentedControlRoot',
  inheritAttrs: false,
  props: {
    items: { type: Array as PropType<SegmentedControlItem[]>, required: true },
    value: { type: String, default: undefined },
    modelValue: { type: String, default: undefined },
    defaultValue: { type: String, default: undefined },
    mode: { type: String as PropType<SegmentedControlMode>, default: 'radio' },
    name: { type: String, default: undefined },
    label: { type: String, default: 'Segmented control' },
    size: { type: String as PropType<SegmentedControlRootProps['size']>, default: undefined },
    fullWidth: { type: Boolean, default: false },
  },
  emits: ['valueChange', 'update:modelValue'],
  setup(props, { slots, attrs, emit }) {
    const defaultValue = props.defaultValue
    const machine = useMachine(() =>
      createSegmentedControl({
        get items() {
          return props.items
        },
        get value() {
          return props.modelValue !== undefined ? props.modelValue : props.value
        },
        defaultValue,
        mode: props.mode,
        get name() {
          return props.name
        },
        onValueChange: (value, prevValue) => {
          emit('update:modelValue', value)
          emit('valueChange', value, prevValue)
        },
      }),
    )

    provide(SegmentedControlKey, {
      machine,
      items: {
        get value() {
          return props.items
        },
      },
      injectItemEl: (value, el) => machine.setItemEl(value, el),
    })

    return () => {
      const rootProps = machine.getRootProps()
      const { class: className, 'aria-label': ariaLabel, ...rest } = attrs

      return h(
        'div',
        {
          ...rest,
          ref: (el: unknown) => machine.setRootEl(el instanceof HTMLElement ? el : null),
          role: rootProps.role,
          'aria-label': (ariaLabel as string | undefined) ?? props.label,
          'data-mode': rootProps['data-mode'],
          'data-size': props.size,
          'data-full-width': props.fullWidth ? '' : undefined,
          class: cx('fc-segmented-control', className as string | undefined),
        },
        [
          h(SegmentedControlIndicator),
          ...(slots.default?.() ??
            props.items.map((item) => h(SegmentedControlItemView, { key: item.value, item }))),
        ],
      )
    }
  },
})

export const SegmentedControlIndicator = defineComponent({
  name: 'FcSegmentedControlIndicator',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const { machine } = useSegmentedControlContext()

    return () => {
      void machine.state
      return h('span', {
        ...attrs,
        ...machine.getIndicatorProps(),
        class: cx('fc-segmented-control__indicator', attrs.class as string | undefined),
      })
    }
  },
})

export const SegmentedControlItemView = defineComponent({
  name: 'FcSegmentedControlItemView',
  inheritAttrs: false,
  props: {
    item: { type: Object as PropType<SegmentedControlItem>, required: true },
  },
  setup(props, { slots, attrs }) {
    const { machine, injectItemEl } = useSegmentedControlContext()
    const itemEl = ref<HTMLElement | null>(null)

    function handleKeyDown(event: KeyboardEvent) {
      machine.getItemProps(props.item.value).onKeyDown(event)
    }

    onMounted(() => {
      itemEl.value?.addEventListener('keydown', handleKeyDown)
    })
    onBeforeUnmount(() => {
      itemEl.value?.removeEventListener('keydown', handleKeyDown)
    })

    return () => {
      void machine.state
      const item = props.item
      const rootMode = machine.state.mode
      const itemProps = machine.getItemProps(item.value)
      const inputProps = machine.getInputProps(item.value)
      const icon = slots.icon?.() as VNode[] | undefined

      function syncRadios(event: Event) {
        inputProps.onChange()
        const input = event.target as HTMLInputElement
        const selected = machine.state.selectedValue
        document.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${input.name}"]`).forEach((el) => {
          el.checked = el.value === selected
        })
      }

      if (rootMode === 'tabs') {
        return h(
          'button',
          {
            ref: (el: unknown) => {
              const node = el instanceof HTMLElement ? el : null
              itemEl.value = node
              injectItemEl(item.value, node)
            },
            type: 'button',
            role: itemProps.role,
            id: itemProps.id,
            'aria-selected': itemProps['aria-selected'],
            'aria-disabled': itemProps['aria-disabled'],
            'aria-controls': itemProps['aria-controls'],
            tabIndex: itemProps.tabIndex,
            'data-state': itemProps['data-state'],
            disabled: item.disabled,
            onClick: itemProps.onClick,
            class: cx('fc-segmented-control__item', attrs.class as string | undefined),
          },
          [
            icon?.length
              ? h('span', { class: 'fc-segmented-control__icon', 'aria-hidden': 'true' }, icon)
              : null,
            h('span', { class: 'fc-segmented-control__label-text' }, item.label),
          ].filter((node) => node != null),
        )
      }

      return h(
        'label',
        {
          ref: (el: unknown) => {
            const node = el instanceof HTMLElement ? el : null
            itemEl.value = node
            injectItemEl(item.value, node)
          },
          'data-state': itemProps['data-state'],
          class: cx('fc-segmented-control__item', attrs.class as string | undefined),
        },
        [
          h('input', {
            class: 'fc-segmented-control__input',
            type: inputProps.type,
            name: inputProps.name,
            value: inputProps.value,
            checked: inputProps.checked,
            disabled: inputProps.disabled,
            onChange: syncRadios,
            onKeydown: handleKeyDown,
          }),
          icon?.length
            ? h('span', { class: 'fc-segmented-control__icon', 'aria-hidden': 'true' }, icon)
            : null,
          h('span', { class: 'fc-segmented-control__label-text' }, item.label),
        ].filter((node) => node != null),
      )
    }
  },
})
