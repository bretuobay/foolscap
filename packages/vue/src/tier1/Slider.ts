import { defineComponent, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface SliderProps {
  modelValue?: string | number
}

export const Slider = defineComponent({
  name: 'FcSlider',
  inheritAttrs: false,
  props: {
    modelValue: { type: [String, Number] as PropType<string | number>, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    return () =>
      h('input', {
        ...attrs,
        type: 'range',
        value: props.modelValue !== undefined ? props.modelValue : attrs.value,
        class: cx('fc-slider', attrs.class as string | undefined),
        onInput: (event: Event) => {
          emit('update:modelValue', (event.target as HTMLInputElement).value)
          const onInput = attrs.onInput
          if (typeof onInput === 'function') onInput(event)
        },
      })
  },
})
