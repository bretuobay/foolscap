import { defineComponent, h } from 'vue'
import { cx } from '../utils/cx'

export const Footer = defineComponent({
  name: 'FcFooter',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'footer',
        {
          ...attrs,
          class: cx('fc-footer', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const FooterGrid = defineComponent({
  name: 'FcFooterGrid',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: cx('fc-footer__grid', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const FooterSectionTitle = defineComponent({
  name: 'FcFooterSectionTitle',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'h2',
        {
          ...attrs,
          class: cx('fc-footer__section-title', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const FooterLinks = defineComponent({
  name: 'FcFooterLinks',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'ul',
        {
          ...attrs,
          class: cx('fc-footer__links', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const FooterBottom = defineComponent({
  name: 'FcFooterBottom',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: cx('fc-footer__bottom', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})
