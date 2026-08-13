import { defineComponent, h } from 'vue'
import { cx } from '../utils/cx'

export interface FieldsetProps {
  legend?: string
  hint?: string
}

export const Fieldset = defineComponent({
  name: 'FcFieldset',
  inheritAttrs: false,
  props: {
    legend: { type: String, default: undefined },
    hint: { type: String, default: undefined },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const legendContent = slots.legend?.() ?? (props.legend ? [props.legend] : null)
      const hintContent = slots.hint?.() ?? (props.hint ? [props.hint] : null)

      return h(
        'fieldset',
        {
          ...attrs,
          class: cx('fc-fieldset', attrs.class as string | undefined),
        },
        [
          legendContent ? h('legend', { class: 'fc-fieldset__legend' }, legendContent) : null,
          hintContent ? h('p', { class: 'fc-fieldset__hint' }, hintContent) : null,
          h('div', { class: 'fc-fieldset__body' }, slots.default?.()),
        ].filter((node) => node != null),
      )
    }
  },
})
