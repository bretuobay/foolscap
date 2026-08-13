import { defineComponent, h, useId, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface FileProps {
  variant?: 'default' | 'dropzone'
  label?: string
  rootClassName?: string
}

export const File = defineComponent({
  name: 'FcFile',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<FileProps['variant']>, default: 'default' },
    label: { type: String, default: undefined },
    rootClassName: { type: String, default: undefined },
  },
  setup(props, { attrs, slots }) {
    const generatedId = useId()

    return () => {
      const inputId = (attrs.id as string | undefined) ?? generatedId
      const labelContent = slots.label?.() ?? (props.label ? [props.label] : null)

      return h(
        'div',
        {
          class: cx('fc-file', props.rootClassName),
          'data-variant': props.variant === 'default' ? undefined : props.variant,
        },
        [
          labelContent ? h('label', { for: inputId }, labelContent) : null,
          h('input', {
            ...attrs,
            id: inputId,
            type: 'file',
            class: cx('fc-file__input', attrs.class as string | undefined),
          }),
        ].filter((node) => node != null),
      )
    }
  },
})
