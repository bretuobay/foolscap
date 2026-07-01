import React, { useEffect, useId, useReducer, useRef } from 'react'
import {
  createFileUpload,
  type FileUpload as FileUploadMachine,
  type FileUploadError,
} from '@web-loom/foolscap-core'
import { useCallbackRef } from '../utils/useCallbackRef'
import { cx } from '../utils/cx'

export type { FileUploadError }

export interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number
  onFilesSelected?: (files: File[]) => void
  onError?: (error: FileUploadError) => void
  label?: string
  hint?: string
  disabled?: boolean
  id?: string
  className?: string
}

export function FileUpload({
  accept,
  multiple,
  maxSize,
  onFilesSelected,
  onError,
  label = 'Drag files here or click to browse',
  hint,
  disabled,
  id: idProp,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const machineRef = useRef<FileUploadMachine | null>(null)
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)

  const stableOnFilesSelected = useCallbackRef(onFilesSelected)
  const stableOnError = useCallbackRef(onError)

  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const machine = createFileUpload(el, {
      accept,
      multiple,
      maxSize,
      onFilesSelected: stableOnFilesSelected,
      onError: stableOnError,
    })
    machineRef.current = machine
    const unsubscribe = machine.subscribe(() => forceUpdate())

    return () => {
      unsubscribe()
      machine.destroy()
      machineRef.current = null
    }
  }, [])

  const reactId = useId().replace(/:/g, '')
  const inputId = idProp ?? `fc-file-upload-${reactId}`

  const state = machineRef.current?.state ?? { isDragging: false, files: [] }
  const dropzoneProps = machineRef.current?.getDropzoneProps()
  const inputProps = machineRef.current?.getInputProps()

  return (
    <div
      className={cx('fc-file-upload', className)}
      data-state={state.isDragging ? 'dragging' : 'idle'}
      data-disabled={disabled ? '' : undefined}
    >
      {/* Visually hidden native input — must be in DOM before effect runs */}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        className="fc-file-upload__input"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={
          inputProps
            ? (e) => inputProps.onChange(e.nativeEvent)
            : undefined
        }
        aria-hidden={!machineRef.current ? true : undefined}
      />

      {/* Dropzone — use <label htmlFor> so native click opens the file picker */}
      <label
        htmlFor={inputId}
        className="fc-file-upload__dropzone"
        onDragEnter={dropzoneProps ? (e) => dropzoneProps.onDragEnter(e.nativeEvent as DragEvent) : undefined}
        onDragLeave={dropzoneProps ? (e) => dropzoneProps.onDragLeave(e.nativeEvent as DragEvent) : undefined}
        onDragOver={dropzoneProps ? (e) => dropzoneProps.onDragOver(e.nativeEvent as DragEvent) : undefined}
        onDrop={dropzoneProps ? (e) => dropzoneProps.onDrop(e.nativeEvent as DragEvent) : undefined}
      >
        {/* Upload icon — explicit width/height attrs prevent SVG from using 300×150 UA default */}
        <svg
          className="fc-file-upload__icon"
          aria-hidden="true"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 15V4" />
          <path d="M8 8l4-4 4 4" />
          <path d="M4 20h16" />
        </svg>

        <span className="fc-file-upload__label">{label}</span>
        {hint && <span className="fc-file-upload__hint">{hint}</span>}
      </label>

      {/* File list */}
      {state.files.length > 0 && (
        <ul className="fc-file-upload__file-list" aria-label="Selected files">
          {state.files.map((file, i) => (
            <li key={`${file.name}-${i}`}>
              <span>📄</span>
              <span>{file.name}</span>
              <span style={{ marginInlineStart: 'auto', color: 'var(--fc-ink-muted)', flexShrink: 0 }}>
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
