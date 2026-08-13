import { defineComponent, h } from 'vue'
import { cx } from '../utils/cx'

export interface BreadcrumbsProps {
  label?: string
}

export const Breadcrumbs = defineComponent({
  name: 'FcBreadcrumbs',
  inheritAttrs: false,
  props: {
    label: { type: String, default: 'Breadcrumb' },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h('nav', { 'aria-label': props.label }, [
        h(
          'ol',
          {
            ...attrs,
            class: cx('fc-breadcrumbs', attrs.class as string | undefined),
          },
          slots.default?.(),
        ),
      ])
  },
})

export const BreadcrumbItem = defineComponent({
  name: 'FcBreadcrumbItem',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () => h('li', { ...attrs }, slots.default?.())
  },
})
