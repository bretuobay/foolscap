import { defineComponent, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface ProgressBarProps {
  value?: number
  min?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  label: string
}

export const ProgressBar = defineComponent({
  name: 'FcProgressBar',
  inheritAttrs: false,
  props: {
    value: { type: Number, default: undefined },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    size: { type: String as PropType<ProgressBarProps['size']>, default: 'md' },
    label: { type: String, required: true },
  },
  setup(props, { attrs }) {
    return () => {
      const isIndeterminate = props.value == null
      const clampedValue = isIndeterminate ? undefined : Math.min(Math.max(props.value, props.min), props.max)
      const percent = clampedValue == null ? 0 : ((clampedValue - props.min) / (props.max - props.min)) * 100
      const incomingStyle = typeof attrs.style === 'object' && attrs.style ? attrs.style : {}

      return h(
        'div',
        {
          ...attrs,
          role: 'progressbar',
          'aria-label': props.label,
          'aria-valuemin': isIndeterminate ? undefined : props.min,
          'aria-valuemax': isIndeterminate ? undefined : props.max,
          'aria-valuenow': clampedValue,
          'data-size': props.size,
          'data-state': isIndeterminate ? 'indeterminate' : undefined,
          style: { ...incomingStyle, '--fc-progress-value': `${percent}%` },
          class: cx('fc-progress-bar', attrs.class as string | undefined),
        },
        [h('div', { class: 'fc-progress-bar__fill' })],
      )
    }
  },
})
