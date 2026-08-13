import { defineComponent, h } from 'vue'
import { cx } from '../utils/cx'

export const Header = defineComponent({
  name: 'FcHeader',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'header',
        {
          ...attrs,
          class: cx('fc-header', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const HeaderBrand = defineComponent({
  name: 'FcHeaderBrand',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'a',
        {
          ...attrs,
          class: cx('fc-header__brand', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const HeaderNav = defineComponent({
  name: 'FcHeaderNav',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'nav',
        {
          ...attrs,
          class: cx('fc-header__nav', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const HeaderActions = defineComponent({
  name: 'FcHeaderActions',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: cx('fc-header__actions', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})
