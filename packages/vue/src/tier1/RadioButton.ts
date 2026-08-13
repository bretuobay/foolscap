import { defineComponent, h, useId } from 'vue'
import { cx } from '../utils/cx'

export interface RadioButtonProps {
  label?: string
  rootClassName?: string
}

export const RadioButton = defineComponent({
  name: 'FcRadioButton',
  inheritAttrs: false,
  props: {
    label: { type: String, default: undefined },
    rootClassName: { type: String, default: undefined },
  },
  setup(props, { attrs, slots }) {
    const generatedId = useId()

    return () => {
      const inputId = (attrs.id as string | undefined) ?? generatedId
      const labelContent = slots.label?.() ?? (props.label ? [props.label] : null)

      return h('div', { class: cx('fc-radio-button', props.rootClassName) }, [
        h('input', {
          ...attrs,
          id: inputId,
          type: 'radio',
          class: cx('fc-radio-button__input', attrs.class as string | undefined),
        }),
        h('span', { class: 'fc-radio-button__control', 'aria-hidden': 'true' }),
        labelContent
          ? h('label', { class: 'fc-radio-button__label', for: inputId }, labelContent)
          : null,
      ].filter((node) => node != null))
    }
  },
})
