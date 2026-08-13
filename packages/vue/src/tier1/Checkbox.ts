import { defineComponent, h, onMounted, ref, useId, watch } from 'vue'
import { cx } from '../utils/cx'

export interface CheckboxProps {
  label?: string
  hint?: string
  indeterminate?: boolean
  rootClassName?: string
  modelValue?: boolean
}

export const Checkbox = defineComponent({
  name: 'FcCheckbox',
  inheritAttrs: false,
  props: {
    label: { type: String, default: undefined },
    hint: { type: String, default: undefined },
    indeterminate: { type: Boolean, default: false },
    rootClassName: { type: String, default: undefined },
    modelValue: { type: Boolean, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, slots, emit }) {
    const generatedId = useId()
    const inputEl = ref<HTMLInputElement | null>(null)

    function syncIndeterminate() {
      if (inputEl.value) inputEl.value.indeterminate = Boolean(props.indeterminate)
    }

    onMounted(syncIndeterminate)
    watch(() => props.indeterminate, syncIndeterminate)

    return () => {
      const inputId = (attrs.id as string | undefined) ?? generatedId
      const labelContent = slots.label?.() ?? (props.label ? [props.label] : null)
      const hintContent = slots.hint?.() ?? (props.hint ? [props.hint] : null)

      return h(
        'div',
        {
          class: cx('fc-checkbox', props.rootClassName),
          'data-state': props.indeterminate ? 'indeterminate' : undefined,
        },
        [
          h('input', {
            ...attrs,
            id: inputId,
            ref: inputEl,
            type: 'checkbox',
            checked: props.modelValue !== undefined ? props.modelValue : attrs.checked,
            'aria-checked': props.indeterminate ? 'mixed' : attrs['aria-checked'],
            class: cx('fc-checkbox__input', attrs.class as string | undefined),
            onChange: (event: Event) => {
              emit('update:modelValue', (event.target as HTMLInputElement).checked)
              const onChange = attrs.onChange
              if (typeof onChange === 'function') onChange(event)
            },
          }),
          h('span', { class: 'fc-checkbox__control', 'aria-hidden': 'true' }),
          labelContent
            ? h('label', { class: 'fc-checkbox__label', for: inputId }, labelContent)
            : null,
          hintContent ? h('p', { class: 'fc-checkbox__hint' }, hintContent) : null,
        ].filter((node) => node != null),
      )
    }
  },
})
