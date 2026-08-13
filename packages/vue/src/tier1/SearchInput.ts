import { defineComponent, getCurrentInstance, h } from 'vue'
import { cx } from '../utils/cx'

export interface SearchInputProps {
  rootClassName?: string
  clearLabel?: string
  modelValue?: string
}

export const SearchInput = defineComponent({
  name: 'FcSearchInput',
  inheritAttrs: false,
  props: {
    rootClassName: { type: String, default: undefined },
    clearLabel: { type: String, default: 'Clear search' },
    modelValue: { type: String, default: undefined },
  },
  emits: ['update:modelValue', 'clear'],
  setup(props, { attrs, slots, emit }) {
    const instance = getCurrentInstance()

    return () => {
      const hasClear = typeof instance?.vnode.props?.onClear === 'function'

      return h('span', { class: cx('fc-search-input', props.rootClassName) }, [
        h(
          'span',
          { class: 'fc-search-input__icon', 'aria-hidden': 'true' },
          slots.icon?.() ?? ['Search'],
        ),
        h('input', {
          ...attrs,
          type: 'search',
          value: props.modelValue !== undefined ? props.modelValue : attrs.value,
          class: cx('fc-search-input__field', attrs.class as string | undefined),
          onInput: (event: Event) => {
            emit('update:modelValue', (event.target as HTMLInputElement).value)
            const onInput = attrs.onInput
            if (typeof onInput === 'function') onInput(event)
          },
        }),
        hasClear
          ? h(
              'button',
              {
                class: 'fc-search-input__clear',
                type: 'button',
                'aria-label': props.clearLabel,
                onClick: () => emit('clear'),
              },
              'x',
            )
          : null,
      ].filter((node) => node != null))
    }
  },
})
