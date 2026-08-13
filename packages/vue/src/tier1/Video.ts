import { defineComponent, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface VideoProps {
  variant?: 'default' | 'bordered'
}

export const Video = defineComponent({
  name: 'FcVideo',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<VideoProps['variant']>, default: 'default' },
  },
  setup(props, { attrs }) {
    return () =>
      h('video', {
        ...attrs,
        'data-variant': props.variant === 'default' ? undefined : props.variant,
        class: cx('fc-video', attrs.class as string | undefined),
      })
  },
})

export const VideoEmbed = defineComponent({
  name: 'FcVideoEmbed',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: cx('fc-video-embed', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})
