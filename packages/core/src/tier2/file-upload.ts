import { createStore } from '@web-loom/store-core'
import { dispatch } from '../utils/events'

export type FileUploadError =
  { type: 'size'; file: File; maxSize: number } | { type: 'type'; file: File; accept: string }

export interface FileUploadOptions {
  accept?: string
  multiple?: boolean
  maxSize?: number
  onFilesSelected?: (files: File[]) => void
  onError?: (error: FileUploadError) => void
}

export interface FileUploadState {
  isDragging: boolean
  files: File[]
}

export interface FileUpload {
  readonly state: FileUploadState
  getDropzoneProps(): {
    role: 'button'
    tabIndex: 0
    'aria-label': string
    onDragEnter(e: DragEvent): void
    onDragLeave(e: DragEvent): void
    onDragOver(e: DragEvent): void
    onDrop(e: DragEvent): void
    onClick(): void
  }
  getInputProps(): {
    type: 'file'
    hidden: true
    accept: string | undefined
    multiple: boolean | undefined
    onChange(e: Event): void
  }
  subscribe(listener: (s: FileUploadState, prev: FileUploadState) => void): () => void
  destroy(): void
}

export function createFileUpload(
  inputEl: HTMLInputElement,
  options: FileUploadOptions = {}
): FileUpload {
  const store = createStore({ isDragging: false, files: [] } as FileUploadState, (set) => ({
    setDragging(v: boolean) {
      set((s) => ({ ...s, isDragging: v }))
    },
    addFiles(files: File[]) {
      set((s) => ({ ...s, files: [...s.files, ...files] }))
    },
  }))

  function acceptsType(file: File): boolean {
    if (!options.accept) return true
    const accepted = options.accept.split(',').map((a) => a.trim())
    return accepted.some((a) => {
      if (a.startsWith('.')) return file.name.toLowerCase().endsWith(a.toLowerCase())
      if (a.endsWith('/*')) return file.type.startsWith(a.replace('/*', '/'))
      return file.type === a
    })
  }

  function processFiles(raw: FileList | null, dispatchEl: Element): void {
    if (!raw) return
    const valid: File[] = []
    Array.from(raw).forEach((file) => {
      if (options.maxSize && file.size > options.maxSize) {
        options.onError?.({ type: 'size', file, maxSize: options.maxSize })
        return
      }
      if (!acceptsType(file)) {
        options.onError?.({ type: 'type', file, accept: options.accept ?? '' })
        return
      }
      valid.push(file)
    })
    if (valid.length > 0) {
      store.actions.addFiles(valid)
      options.onFilesSelected?.(valid)
      dispatch(dispatchEl, 'files-selected', { files: valid })
    }
  }

  let dropzoneEl: Element | null = null

  return {
    get state() {
      return store.getState()
    },
    getDropzoneProps() {
      return {
        role: 'button',
        tabIndex: 0,
        'aria-label': 'Upload files',
        onDragEnter(e) {
          e.preventDefault()
          store.actions.setDragging(true)
          if (!dropzoneEl) dropzoneEl = e.currentTarget as Element
        },
        onDragLeave(e) {
          if (e.relatedTarget && (e.currentTarget as Element).contains(e.relatedTarget as Node))
            return
          store.actions.setDragging(false)
        },
        onDragOver(e) {
          e.preventDefault()
          store.actions.setDragging(true)
        },
        onDrop(e) {
          e.preventDefault()
          store.actions.setDragging(false)
          processFiles(e.dataTransfer?.files ?? null, e.currentTarget as Element)
        },
        onClick() {
          inputEl.click()
        },
      }
    },
    getInputProps() {
      return {
        type: 'file',
        hidden: true,
        accept: options.accept,
        multiple: options.multiple,
        onChange(e) {
          processFiles((e.target as HTMLInputElement).files, e.target as Element)
        },
      }
    },
    subscribe: store.subscribe.bind(store),
    destroy: store.destroy.bind(store),
  }
}
