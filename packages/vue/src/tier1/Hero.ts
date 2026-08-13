import { defineComponent, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface HeroProps {
  variant?: 'default' | 'split'
}

export const Hero = defineComponent({
  name: 'FcHero',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<HeroProps['variant']>, default: 'default' },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'section',
        {
          ...attrs,
          'data-variant': props.variant === 'default' ? undefined : props.variant,
          class: cx('fc-hero', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const HeroEyebrow = defineComponent({
  name: 'FcHeroEyebrow',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'p',
        {
          ...attrs,
          class: cx('fc-hero__eyebrow', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const HeroTitle = defineComponent({
  name: 'FcHeroTitle',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'h1',
        {
          ...attrs,
          class: cx('fc-hero__title', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const HeroDescription = defineComponent({
  name: 'FcHeroDescription',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'p',
        {
          ...attrs,
          class: cx('fc-hero__description', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const HeroActions = defineComponent({
  name: 'FcHeroActions',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: cx('fc-hero__actions', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})
