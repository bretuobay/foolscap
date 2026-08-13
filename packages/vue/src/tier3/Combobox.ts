import { defineComponent, h, inject, provide, Teleport, useId, type InjectionKey, type PropType } from 'vue'
import {
  createCombobox,
  type Combobox as ComboboxMachine,
  type SelectOption,
} from '@web-loom/foolscap-core'
import { useMachine } from '../composables/useMachine'
import { cx } from '../utils/cx'

interface ComboboxContextValue {
  machine: ComboboxMachine
  injectInputEl: (el: HTMLInputElement | null) => void
  injectListboxEl: (el: HTMLElement | null) => void
  inputId: string
  labelId: string
}

const ComboboxKey: InjectionKey<ComboboxContextValue> = Symbol('fc-combobox')

function useComboboxContext(): ComboboxContextValue {
  const ctx = inject(ComboboxKey, null)
  if (!ctx) throw new Error('ComboboxInput and ComboboxListbox must be used inside ComboboxRoot')
  return ctx
}

export interface ComboboxRootProps {
  options: SelectOption[]
  value?: string
  modelValue?: string
  defaultValue?: string
  filterFn?: (option: SelectOption, inputValue: string) => boolean
  loading?: boolean
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
}

export interface ComboboxInputProps {
  label?: string
  placeholder?: string
  disabled?: boolean
}

export interface ComboboxListboxProps {
  emptyText?: string
}

export const ComboboxRoot = defineComponent({
  name: 'FcComboboxRoot',
  inheritAttrs: false,
  props: {
    options: { type: Array as PropType<SelectOption[]>, required: true },
    value: { type: String, default: undefined },
    modelValue: { type: String, default: undefined },
    defaultValue: { type: String, default: undefined },
    filterFn: { type: Function as PropType<ComboboxRootProps['filterFn']>, default: undefined },
    loading: { type: Boolean, default: false },
    placement: { type: String as PropType<ComboboxRootProps['placement']>, default: undefined },
  },
  emits: ['update:modelValue', 'valueChange', 'openChange'],
  setup(props, { slots, attrs, emit }) {
    const defaultValue = props.defaultValue
    const machine = useMachine(() =>
      createCombobox({
        get options() {
          return props.options
        },
        get value() {
          return props.modelValue !== undefined ? props.modelValue : props.value
        },
        defaultValue,
        get filterFn() {
          return props.filterFn
        },
        get loading() {
          return props.loading
        },
        get placement() {
          return props.placement
        },
        onValueChange: (value) => {
          emit('update:modelValue', value)
          emit('valueChange', value)
        },
        onOpenChange: (open) => emit('openChange', open),
      }),
    )

    const reactId = useId().replace(/:/g, '')
    const inputId = `fc-combobox-input-${reactId}`
    const labelId = `fc-combobox-label-${reactId}`

    provide(ComboboxKey, {
      machine,
      injectInputEl: (el) => machine.setInputEl(el),
      injectListboxEl: (el) => machine.setListboxEl(el),
      inputId,
      labelId,
    })

    return () => {
      const state = machine.state
      return h(
        'div',
        {
          class: cx('fc-combobox', attrs.class as string | undefined),
          'data-state': state.open ? 'open' : 'closed',
        },
        slots.default?.(),
      )
    }
  },
})

export const ComboboxInput = defineComponent({
  name: 'FcComboboxInput',
  inheritAttrs: false,
  props: {
    label: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { attrs }) {
    const { machine, injectInputEl, inputId, labelId } = useComboboxContext()
    const setInputEl = (el: unknown) => {
      injectInputEl(el instanceof HTMLInputElement ? el : null)
    }

    return () => {
      const state = machine.state
      const inputProps = machine.getInputProps()

      return [
        props.label
          ? h('label', { id: labelId, for: inputId, class: 'fc-combobox__label' }, props.label)
          : null,
        h('div', { class: cx('fc-combobox__input-wrapper', attrs.class as string | undefined) }, [
          h('input', {
            id: inputId,
            role: inputProps.role,
            'aria-expanded': inputProps['aria-expanded'],
            'aria-haspopup': inputProps['aria-haspopup'],
            'aria-controls': inputProps['aria-controls'],
            'aria-activedescendant': inputProps['aria-activedescendant'],
            'aria-autocomplete': inputProps['aria-autocomplete'],
            'aria-labelledby': props.label ? labelId : undefined,
            value: inputProps.value,
            placeholder: props.placeholder,
            disabled: props.disabled,
            autocomplete: 'off',
            class: 'fc-combobox__input',
            ref: setInputEl,
            onInput: (event: Event) => machine.setInputValue((event.target as HTMLInputElement).value),
            onKeyDown: (event: Event) => inputProps.onKeyDown(event as KeyboardEvent),
            onFocus: () => inputProps.onFocus(),
            onBlur: () => inputProps.onBlur(),
          }),
          h(
            'button',
            {
              type: 'button',
              tabIndex: -1,
              'aria-label': 'Toggle options',
              class: 'fc-combobox__toggle',
              onClick: () => (state.open ? machine.closeMenu() : machine.openMenu()),
            },
            '▾',
          ),
        ]),
      ].filter((node) => node != null)
    }
  },
})

export const ComboboxListbox = defineComponent({
  name: 'FcComboboxListbox',
  inheritAttrs: false,
  props: {
    emptyText: { type: String, default: 'No options found' },
  },
  setup(props, { attrs }) {
    const { machine, injectListboxEl } = useComboboxContext()
    const setListboxEl = (el: unknown) => {
      injectListboxEl(el instanceof HTMLElement ? el : null)
    }

    return () => {
      const state = machine.state
      const listboxProps = machine.getListboxProps()
      const { class: className, style, ...rest } = attrs
      const incomingStyle = typeof style === 'object' && style ? { ...style } : {}
      delete (incomingStyle as { display?: string }).display

      const listbox = h(
        'ul',
        {
          ...rest,
          id: listboxProps.id,
          role: listboxProps.role,
          hidden: listboxProps.hidden,
          'aria-busy': listboxProps['aria-busy'],
          style: incomingStyle,
          class: cx('fc-combobox__listbox', className as string | undefined),
          ref: setListboxEl,
        },
        state.filteredOptions.length === 0
          ? [h('li', { class: 'fc-combobox__empty' }, props.emptyText)]
          : state.filteredOptions.map((opt, index) => {
              const optProps = machine.getOptionProps(opt.value, index)
              return h(
                'li',
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
                  class: 'fc-combobox__option',
                },
                opt.label,
              )
            }),
      )

      if (typeof document === 'undefined') return listbox
      return h(Teleport, { to: 'body' }, [listbox])
    }
  },
})
