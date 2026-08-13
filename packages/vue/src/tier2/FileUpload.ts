import { defineComponent, h, onBeforeUnmount, onMounted, ref, shallowRef, triggerRef, useId } from 'vue'
import { createFileUpload, type FileUpload as FileUploadMachine, type FileUploadError } from '@web-loom/foolscap-core'
import { cx } from '../utils/cx'

export type { FileUploadError }

export interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number
  label?: string
  hint?: string
  disabled?: boolean
  id?: string
}

export const FileUpload = defineComponent({
  name: 'FcFileUpload',
  inheritAttrs: false,
  props: {
    accept: { type: String, default: undefined },
    multiple: { type: Boolean, default: false },
    maxSize: { type: Number, default: undefined },
    label: { type: String, default: 'Drag files here or click to browse' },
    hint: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    id: { type: String, default: undefined },
  },
  emits: ['filesSelected', 'error'],
  setup(props, { slots, attrs, emit }) {
    const inputEl = ref<HTMLInputElement | null>(null)
    const machine = shallowRef<FileUploadMachine | null>(null)
    const generatedId = useId().replace(/:/g, '')
    let unsubscribe: (() => void) | undefined

    onMounted(() => {
      const el = inputEl.value
      if (!el) return

      const instance = createFileUpload(el, {
        get accept() {
          return props.accept
        },
        get multiple() {
          return props.multiple
        },
        get maxSize() {
          return props.maxSize
        },
        onFilesSelected: (files) => emit('filesSelected', files),
        onError: (error) => emit('error', error),
      })
      machine.value = instance
      unsubscribe = instance.subscribe(() => triggerRef(machine))
    })

    onBeforeUnmount(() => {
      unsubscribe?.()
      machine.value?.destroy()
      machine.value = null
    })

    return () => {
      const inputId = props.id ?? `fc-file-upload-${generatedId}`
      const state = machine.value?.state ?? { isDragging: false, files: [] }
      const dropzoneProps = machine.value?.getDropzoneProps()
      const inputProps = machine.value?.getInputProps()
      const hintContent = slots.hint?.() ?? (props.hint ? [props.hint] : null)

      return h(
        'div',
        {
          class: cx('fc-file-upload', attrs.class as string | undefined),
          'data-state': state.isDragging ? 'dragging' : 'idle',
          'data-disabled': props.disabled ? '' : undefined,
        },
        [
          h('input', {
            ref: inputEl,
            id: inputId,
            type: 'file',
            class: 'fc-file-upload__input',
            accept: props.accept,
            multiple: props.multiple,
            disabled: props.disabled,
            onChange: inputProps ? (event: Event) => inputProps.onChange(event) : undefined,
            'aria-hidden': machine.value ? undefined : true,
          }),
          h(
            'label',
            {
              for: inputId,
              class: 'fc-file-upload__dropzone',
              onDragenter: dropzoneProps
                ? (event: DragEvent) => dropzoneProps.onDragEnter(event)
                : undefined,
              onDragleave: dropzoneProps
                ? (event: DragEvent) => dropzoneProps.onDragLeave(event)
                : undefined,
              onDragover: dropzoneProps
                ? (event: DragEvent) => dropzoneProps.onDragOver(event)
                : undefined,
              onDrop: dropzoneProps ? (event: DragEvent) => dropzoneProps.onDrop(event) : undefined,
            },
            [
              h(
                'svg',
                {
                  class: 'fc-file-upload__icon',
                  'aria-hidden': 'true',
                  width: '32',
                  height: '32',
                  viewBox: '0 0 24 24',
                  fill: 'none',
                  stroke: 'currentColor',
                  strokeWidth: '1.5',
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                },
                [
                  h('path', { d: 'M12 15V4' }),
                  h('path', { d: 'M8 8l4-4 4 4' }),
                  h('path', { d: 'M4 20h16' }),
                ],
              ),
              h('span', { class: 'fc-file-upload__label' }, slots.label?.() ?? props.label),
              hintContent ? h('span', { class: 'fc-file-upload__hint' }, hintContent) : null,
            ].filter((node) => node != null),
          ),
          state.files.length > 0
            ? h(
                'ul',
                { class: 'fc-file-upload__file-list', 'aria-label': 'Selected files' },
                state.files.map((file, i) =>
                  h('li', { key: `${file.name}-${i}` }, [
                    h('span', null, '📄'),
                    h('span', null, file.name),
                    h(
                      'span',
                      {
                        style: {
                          marginInlineStart: 'auto',
                          color: 'var(--fc-ink-muted)',
                          flexShrink: 0,
                        },
                      },
                      `${(file.size / 1024).toFixed(1)} KB`,
                    ),
                  ]),
                ),
              )
            : null,
        ].filter((node) => node != null),
      )
    }
  },
})
