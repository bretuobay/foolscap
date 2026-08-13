import { defineComponent, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface QuoteProps {
  variant?: 'default' | 'pull'
  citeText?: string
}

export const Quote = defineComponent({
  name: 'FcQuote',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<QuoteProps['variant']>, default: 'default' },
    citeText: { type: String, default: undefined },
  },
  setup(props, { slots, attrs }) {
    return () => {
      const citeContent = slots.cite?.() ?? (props.citeText ? [props.citeText] : null)

      return h(
        'blockquote',
        {
          ...attrs,
          'data-variant': props.variant === 'default' ? undefined : props.variant,
          class: cx('fc-quote', attrs.class as string | undefined),
        },
        [slots.default?.(), citeContent ? h('cite', { class: 'fc-quote__cite' }, citeContent) : null].filter(
          (node) => node != null,
        ),
      )
    }
  },
})
