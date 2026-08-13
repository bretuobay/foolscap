import { defineComponent, h, onBeforeUnmount, onMounted, ref } from 'vue'
import { createToggle } from '@web-loom/foolscap-core'
import { useMachine } from '../composables/useMachine'
import { cx } from '../utils/cx'

export interface ToggleProps {
  checked?: boolean
  defaultChecked?: boolean
  modelValue?: boolean
  label?: string
  disabled?: boolean
  id?: string
}

export const Toggle = defineComponent({
  name: 'FcToggle',
  inheritAttrs: false,
  props: {
    checked: { type: Boolean, default: undefined },
    defaultChecked: { type: Boolean, default: undefined },
    modelValue: { type: Boolean, default: undefined },
    label: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    id: { type: String, default: undefined },
  },
  emits: ['update:modelValue', 'checkedChange'],
  setup(props, { slots, attrs, emit }) {
    const machine = useMachine(() =>
      createToggle({
        checked: props.modelValue !== undefined ? props.modelValue : props.checked,
        defaultChecked: props.defaultChecked,
        onCheckedChange: (checked) => {
          emit('update:modelValue', checked)
          emit('checkedChange', checked)
        },
      }),
    )

    const inputEl = ref<HTMLInputElement | null>(null)

    onMounted(() => {
      machine.setRootEl(inputEl.value)
    })
    onBeforeUnmount(() => {
      machine.setRootEl(null)
    })

    return () => {
      const { class: className, ...inputAttrs } = attrs
      const inputId = props.id ?? (attrs.id as string | undefined)
      const isControlled = props.modelValue !== undefined || props.checked !== undefined
      const isChecked = isControlled
        ? Boolean(props.modelValue ?? props.checked)
        : machine.state.checked
      const labelContent = slots.label?.() ?? (props.label != null ? [props.label] : null)

      return h(
        'label',
        {
          class: cx('fc-toggle', props.disabled && 'fc-toggle--disabled', className as string | undefined),
          for: inputId,
        },
        [
          h('input', {
            ...inputAttrs,
            id: inputId,
            ref: inputEl,
            type: 'checkbox',
            role: 'switch',
            checked: isChecked,
            disabled: props.disabled,
            'aria-disabled': props.disabled || undefined,
            class: 'fc-toggle__input',
            onChange: (event: Event) => {
              const input = event.target as HTMLInputElement
              const next = input.checked
              machine.setChecked(next)
              const controlled = props.modelValue !== undefined || props.checked !== undefined
              if (controlled) {
                input.checked = Boolean(props.modelValue ?? props.checked)
              }
            },
          }),
          h('span', { class: 'fc-toggle__track', 'aria-hidden': 'true' }, [
            h('span', { class: 'fc-toggle__thumb' }),
          ]),
          labelContent ? h('span', { class: 'fc-toggle__label' }, labelContent) : null,
        ].filter((node) => node != null),
      )
    }
  },
})
