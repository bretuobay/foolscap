import {
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  watch,
  type InjectionKey,
  type PropType,
} from 'vue'
import {
  createRichTextEditor,
  type RichTextEditor as RichTextEditorMachine,
  type RichTextEditorCommand,
} from '@web-loom/foolscap-core'
import { useMachine } from '../composables/useMachine'
import { cx } from '../utils/cx'

export type { RichTextEditorCommand }

interface RichTextEditorContextValue {
  machine: RichTextEditorMachine
  injectEditorEl: (el: HTMLDivElement | null) => void
  injectToolbarButtonEl: (key: string, el: HTMLButtonElement | null) => void
}

const RichTextEditorKey: InjectionKey<RichTextEditorContextValue> = Symbol('fc-rte')

function useRichTextEditorContext(): RichTextEditorContextValue {
  const ctx = inject(RichTextEditorKey, null)
  if (!ctx) throw new Error('RichTextEditor components must be used inside RichTextEditorRoot')
  return ctx
}

export interface RichTextEditorRootProps {
  defaultValue?: string
  value?: string
  placeholder?: string
  disabled?: boolean
}

export interface RichTextEditorToolbarGroupProps {
  label: string
}

export interface RichTextEditorButtonProps {
  command: RichTextEditorCommand
  value?: string
}

export const RichTextEditorRoot = defineComponent({
  name: 'FcRichTextEditorRoot',
  inheritAttrs: false,
  props: {
    defaultValue: { type: String, default: undefined },
    value: { type: String, default: undefined },
    modelValue: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
    disabled: { type: Boolean, default: undefined },
  },
  emits: ['change', 'selectionChange', 'update:modelValue'],
  setup(props, { slots, attrs, emit }) {
    const defaultValue = props.defaultValue
    const machine = useMachine(() =>
      createRichTextEditor({
        defaultValue,
        get value() {
          return props.modelValue !== undefined ? props.modelValue : props.value
        },
        get placeholder() {
          return props.placeholder
        },
        get disabled() {
          return props.disabled
        },
        onChange: (html) => {
          emit('update:modelValue', html)
          emit('change', html)
        },
        onSelectionChange: (activeFormats) => emit('selectionChange', activeFormats),
      }),
    )

    provide(RichTextEditorKey, {
      machine,
      injectEditorEl: (el) => machine.setEditorEl(el),
      injectToolbarButtonEl: (key, el) => machine.setToolbarButtonEl(key, el),
    })

    return () => {
      const rootProps = machine.getRootProps()
      const { class: className, ...rest } = attrs

      return h(
        'div',
        {
          ...rest,
          ref: (el: unknown) => machine.setRootEl(el instanceof HTMLDivElement ? el : null),
          'data-state': rootProps['data-state'],
          class: cx('fc-rte', className as string | undefined),
        },
        slots.default?.() ?? [h(RichTextEditorToolbar), h(RichTextEditorLinkForm), h(RichTextEditorEditor)],
      )
    }
  },
})

export const RichTextEditorToolbar = defineComponent({
  name: 'FcRichTextEditorToolbar',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const { machine } = useRichTextEditorContext()
    const toolbarEl = ref<HTMLDivElement | null>(null)

    function handleKeyDown(event: KeyboardEvent) {
      const { onKeyDown } = attrs
      if (typeof onKeyDown === 'function') onKeyDown(event)
      if (!event.defaultPrevented) machine.getToolbarProps().onKeyDown(event)
    }

    onMounted(() => {
      toolbarEl.value?.addEventListener('keydown', handleKeyDown)
    })
    onBeforeUnmount(() => {
      toolbarEl.value?.removeEventListener('keydown', handleKeyDown)
    })

    return () => {
      void machine.state
      const toolbarProps = machine.getToolbarProps()
      const { class: className, 'aria-label': ariaLabel, ...rest } = attrs

      return h(
        'div',
        {
          ...rest,
          ref: toolbarEl,
          role: toolbarProps.role,
          'aria-label': (ariaLabel as string | undefined) ?? toolbarProps['aria-label'],
          'aria-controls': toolbarProps['aria-controls'],
          class: cx('fc-rte__toolbar', className as string | undefined),
        },
        slots.default?.() ?? [
          h(RichTextEditorToolbarGroup, { label: 'Text style' }, {
            default: () => [
              h(RichTextEditorButton, { command: 'bold' }, { default: () => h('strong', null, 'B') }),
              h(RichTextEditorButton, { command: 'italic' }, { default: () => h('em', null, 'I') }),
            ],
          }),
          h(RichTextEditorToolbarGroup, { label: 'Lists' }, {
            default: () => [
              h(RichTextEditorButton, { command: 'insertUnorderedList' }, { default: () => '•' }),
              h(RichTextEditorButton, { command: 'insertOrderedList' }, { default: () => '1.' }),
            ],
          }),
          h(RichTextEditorToolbarGroup, { label: 'Headings' }, {
            default: () => [
              h(RichTextEditorButton, { command: 'formatBlock', value: 'p' }, { default: () => 'P' }),
              h(RichTextEditorButton, { command: 'formatBlock', value: 'h1' }, { default: () => 'H1' }),
              h(RichTextEditorButton, { command: 'formatBlock', value: 'h2' }, { default: () => 'H2' }),
              h(RichTextEditorButton, { command: 'formatBlock', value: 'h3' }, { default: () => 'H3' }),
            ],
          }),
          h(RichTextEditorToolbarGroup, { label: 'Insert' }, {
            default: () => [h(RichTextEditorButton, { command: 'createLink' }, { default: () => 'Link' })],
          }),
        ],
      )
    }
  },
})

export const RichTextEditorToolbarGroup = defineComponent({
  name: 'FcRichTextEditorToolbarGroup',
  inheritAttrs: false,
  props: {
    label: { type: String, required: true },
  },
  setup(props, { slots, attrs }) {
    const { machine } = useRichTextEditorContext()

    return () => {
      void machine.state
      const groupProps = machine.getToolbarGroupProps(props.label)
      return h(
        'div',
        {
          ...attrs,
          role: groupProps.role,
          'aria-label': (attrs['aria-label'] as string | undefined) ?? groupProps['aria-label'],
          class: cx('fc-rte__toolbar-group', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
    }
  },
})

export const RichTextEditorButton = defineComponent({
  name: 'FcRichTextEditorButton',
  inheritAttrs: false,
  props: {
    command: { type: String as PropType<RichTextEditorCommand>, required: true },
    value: { type: String, default: undefined },
  },
  setup(props, { slots, attrs }) {
    const { machine, injectToolbarButtonEl } = useRichTextEditorContext()
    const buttonEl = ref<HTMLButtonElement | null>(null)

    function handleKeyDown(event: KeyboardEvent) {
      const { onKeyDown } = attrs
      if (typeof onKeyDown === 'function') onKeyDown(event)
      if (!event.defaultPrevented) machine.getToolbarButtonProps(props.command, props.value).onKeyDown(event)
    }

    onMounted(() => {
      buttonEl.value?.addEventListener('keydown', handleKeyDown)
    })
    onBeforeUnmount(() => {
      buttonEl.value?.removeEventListener('keydown', handleKeyDown)
    })

    return () => {
      void machine.state
      const buttonProps = machine.getToolbarButtonProps(props.command, props.value)
      const key = props.value ? `${props.command}:${props.value}` : props.command
      const { class: className, onClick, onMousedown, 'aria-label': ariaLabel, ...rest } = attrs

      return h(
        'button',
        {
          ...rest,
          ref: (el: unknown) => {
            const node = el instanceof HTMLButtonElement ? el : null
            buttonEl.value = node
            injectToolbarButtonEl(key, node)
          },
          type: buttonProps.type,
          'aria-label': (ariaLabel as string | undefined) ?? buttonProps['aria-label'],
          'aria-pressed': buttonProps['aria-pressed'],
          'data-state': buttonProps['data-state'],
          'data-command': buttonProps['data-command'],
          'data-value': buttonProps['data-value'],
          disabled: buttonProps.disabled,
          onMousedown: (event: MouseEvent) => {
            if (typeof onMousedown === 'function') onMousedown(event)
            if (!event.defaultPrevented) buttonProps.onMouseDown(event)
          },
          onClick: (event: Event) => {
            if (typeof onClick === 'function') onClick(event)
            if (!event.defaultPrevented) buttonProps.onClick()
          },
          class: cx('fc-rte__toolbar-button', className as string | undefined),
        },
        slots.default?.() ?? buttonProps['aria-label'],
      )
    }
  },
})

export const RichTextEditorEditor = defineComponent({
  name: 'FcRichTextEditorEditor',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const { machine, injectEditorEl } = useRichTextEditorContext()
    const editorEl = ref<HTMLDivElement | null>(null)

    function handleKeyDown(event: KeyboardEvent) {
      const { onKeyDown } = attrs
      if (typeof onKeyDown === 'function') onKeyDown(event)
      if (!event.defaultPrevented) machine.getEditorProps().onKeyDown(event)
    }

    function handleFocus() {
      machine.getEditorProps().onFocus()
    }

    function syncHtml() {
      const editor = editorEl.value
      if (!editor) return
      if (document.activeElement === editor) return
      const value = machine.getValue()
      if (editor.innerHTML !== value) editor.innerHTML = value
    }

    onMounted(() => {
      editorEl.value?.addEventListener('keydown', handleKeyDown)
      editorEl.value?.addEventListener('focus', handleFocus)
      syncHtml()
    })
    onBeforeUnmount(() => {
      editorEl.value?.removeEventListener('keydown', handleKeyDown)
      editorEl.value?.removeEventListener('focus', handleFocus)
    })

    watch(() => machine.getValue(), syncHtml)

    return () => {
      void machine.state
      const editorProps = machine.getEditorProps()
      const { class: className, onInput, onFocus, onBlur, id, 'aria-label': ariaLabel, ...rest } = attrs

      return h('div', {
        ...rest,
        ref: (el: unknown) => {
          if (editorEl.value) {
            editorEl.value.removeEventListener('keydown', handleKeyDown)
            editorEl.value.removeEventListener('focus', handleFocus)
          }
          const node = el instanceof HTMLDivElement ? el : null
          editorEl.value = node
          injectEditorEl(node)
          node?.addEventListener('keydown', handleKeyDown)
          node?.addEventListener('focus', handleFocus)
        },
        id: (id as string | undefined) ?? editorProps.id,
        contenteditable: editorProps.contentEditable,
        role: editorProps.role,
        'aria-multiline': editorProps['aria-multiline'],
        'aria-label': (ariaLabel as string | undefined) ?? editorProps['aria-label'],
        'aria-disabled': editorProps['aria-disabled'],
        'data-placeholder': editorProps['data-placeholder'],
        'data-state': editorProps['data-state'],
        spellcheck: editorProps.spellcheck,
        onInput: (event: Event) => {
          if (typeof onInput === 'function') onInput(event)
          if (!event.defaultPrevented) editorProps.onInput()
        },
        onFocus: (event: Event) => {
          if (typeof onFocus === 'function') onFocus(event)
          if (!event.defaultPrevented) editorProps.onFocus()
        },
        onBlur: (event: Event) => {
          if (typeof onBlur === 'function') onBlur(event)
          if (!event.defaultPrevented) editorProps.onBlur()
        },
        class: cx('fc-rte__editor', className as string | undefined),
      })
    }
  },
})

export const RichTextEditorLinkForm = defineComponent({
  name: 'FcRichTextEditorLinkForm',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const { machine } = useRichTextEditorContext()

    return () => {
      void machine.state
      const formProps = machine.getLinkFormProps()
      const inputProps = machine.getLinkInputProps()
      const { class: className, onSubmit, ...rest } = attrs

      return h(
        'form',
        {
          ...rest,
          hidden: formProps.hidden,
          onSubmit: (event: Event) => {
            if (typeof onSubmit === 'function') onSubmit(event)
            const prevented = event.defaultPrevented
            event.preventDefault()
            if (!prevented) formProps.onSubmit()
          },
          class: cx('fc-rte__link-form', className as string | undefined),
        },
        [
          h('input', {
            class: 'fc-rte__link-input',
            type: inputProps.type,
            value: inputProps.value,
            placeholder: inputProps.placeholder,
            disabled: inputProps.disabled,
            'aria-label': 'Link URL',
            onInput: (event: Event) => inputProps.onInput((event.currentTarget as HTMLInputElement).value),
            onKeydown: (event: KeyboardEvent) => inputProps.onKeyDown(event),
          }),
          h(
            'button',
            { class: 'fc-rte__link-apply', type: 'submit', disabled: inputProps.disabled },
            'Apply',
          ),
          h(
            'button',
            {
              class: 'fc-rte__link-cancel',
              type: 'button',
              onClick: formProps.onCancel,
              disabled: inputProps.disabled,
            },
            'Cancel',
          ),
        ],
      )
    }
  },
})
