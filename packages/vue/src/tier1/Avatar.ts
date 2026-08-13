import { defineComponent, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const Avatar = defineComponent({
  name: 'FcAvatar',
  inheritAttrs: false,
  props: {
    src: { type: String, default: undefined },
    alt: { type: String, default: '' },
    fallback: { type: String, default: undefined },
    size: { type: String as PropType<AvatarProps['size']>, default: 'md' },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'span',
        {
          ...attrs,
          'data-size': props.size,
          class: cx('fc-avatar', attrs.class as string | undefined),
        },
        [
          props.src ? h('img', { src: props.src, alt: props.alt }) : null,
          slots.fallback?.() ?? slots.default?.() ?? (props.fallback ? [props.fallback] : null),
        ].filter((node) => node != null),
      )
  },
})

export const AvatarGroup = defineComponent({
  name: 'FcAvatarGroup',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: cx('fc-avatar-group', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})
