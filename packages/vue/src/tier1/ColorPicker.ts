import { defineComponent, h, ref, useId } from 'vue'
import { cx } from '../utils/cx'

export interface ColorPickerProps {
  label?: string
  rootClassName?: string
  showValue?: boolean
  defaultValue?: string
  modelValue?: string
}

export const ColorPicker = defineComponent({
  name: 'FcColorPicker',
  inheritAttrs: false,
  props: {
    label: { type: String, default: undefined },
    rootClassName: { type: String, default: undefined },
    showValue: { type: Boolean, default: true },
    defaultValue: { type: String, default: '#000000' },
    modelValue: { type: String, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, slots, emit }) {
    const generatedId = useId()
    const uncontrolled = ref(props.defaultValue)

    return () => {
      const inputId = (attrs.id as string | undefined) ?? generatedId
      const isControlled = props.modelValue !== undefined || attrs.value !== undefined
      const displayValue = String(props.modelValue ?? attrs.value ?? uncontrolled.value)
      const labelContent = slots.label?.() ?? (props.label ? [props.label] : null)

      return h('div', { class: cx('fc-color-picker', props.rootClassName) }, [
        labelContent
          ? h('label', { class: 'fc-color-picker__label', for: inputId }, labelContent)
          : null,
        h('span', { class: 'fc-color-picker__swatch', style: { backgroundColor: displayValue } }, [
          h('input', {
            ...attrs,
            id: inputId,
            type: 'color',
            value: displayValue,
            class: cx('fc-color-picker__input', attrs.class as string | undefined),
            onChange: (event: Event) => {
              const next = (event.target as HTMLInputElement).value
              if (!isControlled) uncontrolled.value = next
              emit('update:modelValue', next)
              const onChange = attrs.onChange
              if (typeof onChange === 'function') onChange(event)
            },
          }),
        ]),
        props.showValue ? h('span', { class: 'fc-color-picker__value' }, displayValue) : null,
      ].filter((node) => node != null))
    }
  },
})
