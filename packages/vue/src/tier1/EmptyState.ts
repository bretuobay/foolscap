import { defineComponent, h } from 'vue'
import { cx } from '../utils/cx'

export interface EmptyStateProps {
  title?: string
  description?: string
}

export const EmptyState = defineComponent({
  name: 'FcEmptyState',
  inheritAttrs: false,
  props: {
    title: { type: String, default: undefined },
    description: { type: String, default: undefined },
  },
  setup(props, { slots, attrs }) {
    return () => {
      const iconContent = slots.icon?.()
      const titleContent = slots.title?.() ?? (props.title ? [props.title] : null)
      const descriptionContent = slots.description?.() ?? (props.description ? [props.description] : null)
      const actionContent = slots.action?.()

      return h(
        'div',
        {
          ...attrs,
          class: cx('fc-empty-state', attrs.class as string | undefined),
        },
        [
          iconContent ? h('div', { class: 'fc-empty-state__icon' }, iconContent) : null,
          titleContent ? h('div', { class: 'fc-empty-state__title' }, titleContent) : null,
          descriptionContent ? h('div', { class: 'fc-empty-state__description' }, descriptionContent) : null,
          slots.default?.() ?? null,
          actionContent ? h('div', { class: 'fc-empty-state__action' }, actionContent) : null,
        ].filter((node) => node != null),
      )
    }
  },
})
