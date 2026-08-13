import { defineComponent, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface TextInputProps {
  size?: 'sm' | 'md' | 'lg'
  invalid?: boolean
  modelValue?: string | number
}

export const TextInput = defineComponent({
  name: 'FcTextInput',
  inheritAttrs: false,
  props: {
    size: { type: String as PropType<TextInputProps['size']>, default: 'md' },
    invalid: { type: Boolean, default: false },
    modelValue: { type: [String, Number] as PropType<string | number>, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    return () =>
      h('input', {
        ...attrs,
        value: props.modelValue !== undefined ? props.modelValue : attrs.value,
        'aria-invalid': props.invalid ? 'true' : attrs['aria-invalid'],
        'data-size': props.size === 'md' ? undefined : props.size,
        'data-state': props.invalid ? 'error' : undefined,
        class: cx('fc-text-input', attrs.class as string | undefined),
        onInput: (event: Event) => {
          emit('update:modelValue', (event.target as HTMLInputElement).value)
          const onInput = attrs.onInput
          if (typeof onInput === 'function') onInput(event)
        },
      })
  },
})
