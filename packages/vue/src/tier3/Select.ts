import { defineComponent, h, inject, provide, Teleport, type InjectionKey, type PropType } from 'vue'
import { createSelect, type Select as SelectMachine, type SelectOption } from '@web-loom/foolscap-core'
import { useMachine } from '../composables/useMachine'
import { cx } from '../utils/cx'

export type { SelectOption }

interface SelectContextValue {
  machine: SelectMachine
  options: { value: SelectOption[] }
  placeholder: { value: string }
  injectTriggerEl: (el: HTMLButtonElement | null) => void
  injectListboxEl: (el: HTMLDivElement | null) => void
}

const SelectKey: InjectionKey<SelectContextValue> = Symbol('fc-select')

function useSelectContext(): SelectContextValue {
  const ctx = inject(SelectKey, null)
  if (!ctx) throw new Error('SelectTrigger and SelectListbox must be used inside SelectRoot')
  return ctx
}

export interface SelectRootProps {
  options: SelectOption[]
  value?: string
  modelValue?: string
  defaultValue?: string
  placeholder?: string
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  disabled?: boolean
  name?: string
  size?: 'sm' | 'md' | 'lg'
}

export interface SelectTriggerProps {
  placeholder?: string
  disabled?: boolean
}

export const SelectRoot = defineComponent({
  name: 'FcSelectRoot',
  inheritAttrs: false,
  props: {
    options: { type: Array as PropType<SelectOption[]>, required: true },
    value: { type: String, default: undefined },
    modelValue: { type: String, default: undefined },
    defaultValue: { type: String, default: undefined },
    placeholder: { type: String, default: '' },
    placement: { type: String as PropType<SelectRootProps['placement']>, default: undefined },
    disabled: { type: Boolean, default: false },
    name: { type: String, default: undefined },
    size: { type: String as PropType<SelectRootProps['size']>, default: undefined },
  },
  emits: ['update:modelValue', 'valueChange', 'openChange'],
  setup(props, { slots, attrs, emit }) {
    const defaultValue = props.defaultValue
    const machine = useMachine(() =>
      createSelect({
        get options() {
          return props.options
        },
        get value() {
          return props.modelValue !== undefined ? props.modelValue : props.value
        },
        defaultValue,
        onValueChange: (value) => {
          emit('update:modelValue', value)
          emit('valueChange', value)
        },
        onOpenChange: (open) => emit('openChange', open),
        get placement() {
          return props.placement
        },
      }),
    )

    provide(SelectKey, {
      machine,
      options: {
        get value() {
          return props.options
        },
      },
      placeholder: {
        get value() {
          return props.placeholder
        },
      },
      injectTriggerEl: (el) => machine.setTriggerEl(el),
      injectListboxEl: (el) => machine.setListboxEl(el),
    })

    return () => {
      const state = machine.state
      return h(
        'div',
        {
          class: cx('fc-select', attrs.class as string | undefined),
          'data-state': state.open ? 'open' : 'closed',
          'data-size': props.size,
          'data-disabled': props.disabled ? '' : undefined,
        },
        [
          props.name
            ? h(
                'select',
                {
                  class: 'fc-select__native',
                  name: props.name,
                  'aria-hidden': 'true',
                  tabIndex: -1,
                  value: state.value,
                  onChange: () => {
                    /* value synced by machine */
                  },
                },
                [
                  h('option', { value: '' }),
                  ...props.options.map((opt) =>
                    h('option', { key: opt.value, value: opt.value, disabled: opt.disabled }, opt.label),
                  ),
                ],
              )
            : null,
          slots.default?.(),
        ].filter((node) => node != null),
      )
    }
  },
})

export const SelectTrigger = defineComponent({
  name: 'FcSelectTrigger',
  inheritAttrs: false,
  props: {
    placeholder: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { attrs }) {
    const { machine, options, placeholder, injectTriggerEl } = useSelectContext()
    const setTriggerEl = (el: unknown) => {
      injectTriggerEl(el instanceof HTMLButtonElement ? el : null)
    }

    return () => {
      const triggerProps = machine.getTriggerProps()
      const state = machine.state
      const selectedLabel = options.value.find((o) => o.value === state.value)?.label
      const effectivePlaceholder = props.placeholder ?? placeholder.value
      const displayText = selectedLabel ?? effectivePlaceholder
      const isEmpty = !selectedLabel
      const { class: className, ...rest } = attrs

      return h(
        'button',
        {
          ...rest,
          type: 'button',
          disabled: props.disabled,
          role: triggerProps.role,
          tabIndex: triggerProps.tabIndex,
          'aria-expanded': triggerProps['aria-expanded'],
          'aria-haspopup': triggerProps['aria-haspopup'],
          'aria-controls': triggerProps['aria-controls'],
          'aria-activedescendant': triggerProps['aria-activedescendant'],
          onClick: triggerProps.onClick,
          onKeyDown: (event: Event) => triggerProps.onKeyDown(event as KeyboardEvent),
          ref: setTriggerEl,
          class: cx('fc-select__trigger', className as string | undefined),
        },
        [
          h(
            'span',
            {
              class: cx('fc-select__trigger-value', isEmpty && 'fc-select__trigger-value--placeholder'),
            },
            displayText,
          ),
          h('span', { class: 'fc-select__trigger-icon', 'aria-hidden': 'true' }, '▾'),
        ],
      )
    }
  },
})

export const SelectListbox = defineComponent({
  name: 'FcSelectListbox',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const { machine, options, injectListboxEl } = useSelectContext()
    const setListboxEl = (el: unknown) => {
      injectListboxEl(el instanceof HTMLDivElement ? el : null)
    }

    return () => {
      const listboxProps = machine.getListboxProps()
      const state = machine.state
      const { class: className, style, 'aria-label': ariaLabel, ...rest } = attrs
      const incomingStyle = typeof style === 'object' && style ? { ...style } : {}
      delete (incomingStyle as { display?: string }).display

      const listbox = h(
        'div',
        {
          ...rest,
          id: listboxProps.id,
          role: listboxProps.role,
          hidden: listboxProps.hidden,
          onKeyDown: (event: Event) => listboxProps.onKeyDown(event as KeyboardEvent),
          ref: setListboxEl,
          style: incomingStyle,
          'aria-label': (ariaLabel as string | undefined) ?? listboxProps['aria-label'],
          class: cx('fc-select__listbox', className as string | undefined),
        },
        options.value.map((opt, index) => {
          const optProps = machine.getOptionProps(opt.value, index)
          return h(
            'div',
            {
              key: opt.value,
              id: optProps.id,
              role: optProps.role,
              'aria-selected': optProps['aria-selected'],
              'aria-disabled': optProps['aria-disabled'],
              'data-highlighted': optProps['data-highlighted'] ? '' : undefined,
              'data-value': opt.value,
              onClick: optProps.onClick,
              onMouseMove: optProps.onMouseMove,
              class: 'fc-select__option',
            },
            [
              h('span', { class: 'fc-select__option-label' }, opt.label),
              h('span', { class: 'fc-select__option-check', 'aria-hidden': 'true' }, state.value === opt.value ? '✓' : ''),
            ],
          )
        }),
      )

      if (typeof document === 'undefined') return listbox
      return h(Teleport, { to: 'body' }, [listbox])
    }
  },
})
