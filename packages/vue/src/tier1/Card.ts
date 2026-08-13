import { defineComponent, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface CardProps {
  variant?: 'default' | 'flat' | 'elevated'
  as?: 'article' | 'div' | 'section'
}

export const Card = defineComponent({
  name: 'FcCard',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<CardProps['variant']>, default: 'default' },
    as: { type: String as PropType<CardProps['as']>, default: 'article' },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        props.as,
        {
          ...attrs,
          'data-variant': props.variant === 'default' ? undefined : props.variant,
          class: cx('fc-card', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const CardMedia = defineComponent({
  name: 'FcCardMedia',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h('div', { ...attrs, class: cx('fc-card__media', attrs.class as string | undefined) }, slots.default?.())
  },
})

export const CardBody = defineComponent({
  name: 'FcCardBody',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h('div', { ...attrs, class: cx('fc-card__body', attrs.class as string | undefined) }, slots.default?.())
  },
})

export const CardTitle = defineComponent({
  name: 'FcCardTitle',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h('h3', { ...attrs, class: cx('fc-card__title', attrs.class as string | undefined) }, slots.default?.())
  },
})

export const CardDescription = defineComponent({
  name: 'FcCardDescription',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h('p', { ...attrs, class: cx('fc-card__description', attrs.class as string | undefined) }, slots.default?.())
  },
})

export const CardFooter = defineComponent({
  name: 'FcCardFooter',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h('div', { ...attrs, class: cx('fc-card__footer', attrs.class as string | undefined) }, slots.default?.())
  },
})
