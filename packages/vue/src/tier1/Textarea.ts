import { defineComponent, h } from 'vue'
import { cx } from '../utils/cx'

export interface TextareaProps {
  invalid?: boolean
  modelValue?: string
}

export const Textarea = defineComponent({
  name: 'FcTextarea',
  inheritAttrs: false,
  props: {
    invalid: { type: Boolean, default: false },
    modelValue: { type: String, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    return () =>
      h('textarea', {
        ...attrs,
        value: props.modelValue !== undefined ? props.modelValue : attrs.value,
        'aria-invalid': props.invalid ? 'true' : attrs['aria-invalid'],
        'data-state': props.invalid ? 'error' : undefined,
        class: cx('fc-textarea', attrs.class as string | undefined),
        onInput: (event: Event) => {
          emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
          const onInput = attrs.onInput
          if (typeof onInput === 'function') onInput(event)
        },
      })
  },
})
