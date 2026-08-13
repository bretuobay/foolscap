import { defineComponent, h } from 'vue'
import { cx } from '../utils/cx'

export interface DateInputProps {
  modelValue?: string
}

export const DateInput = defineComponent({
  name: 'FcDateInput',
  inheritAttrs: false,
  props: {
    modelValue: { type: String, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    return () =>
      h('input', {
        ...attrs,
        type: 'date',
        value: props.modelValue !== undefined ? props.modelValue : attrs.value,
        class: cx('fc-date-input', attrs.class as string | undefined),
        onInput: (event: Event) => {
          emit('update:modelValue', (event.target as HTMLInputElement).value)
          const onInput = attrs.onInput
          if (typeof onInput === 'function') onInput(event)
        },
      })
  },
})
