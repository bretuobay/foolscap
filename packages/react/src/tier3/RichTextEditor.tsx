import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import {
  createRichTextEditor,
  type RichTextEditor as RichTextEditorMachine,
  type RichTextEditorCommand,
} from '@web-loom/foolscap-core'
import { useMachine } from '../hooks/useMachine'
import { useCallbackRef } from '../utils/useCallbackRef'
import { cx } from '../utils/cx'

interface RichTextEditorContextValue {
  machine: RichTextEditorMachine
  injectRootEl: (el: HTMLDivElement | null) => void
  injectEditorEl: (el: HTMLDivElement | null) => void
  injectToolbarButtonEl: (key: string, el: HTMLButtonElement | null) => void
}

const RichTextEditorContext = createContext<RichTextEditorContextValue | null>(null)

function useRichTextEditorContext(): RichTextEditorContextValue {
  const ctx = useContext(RichTextEditorContext)
  if (!ctx) throw new Error('RichTextEditor components must be used inside RichTextEditorRoot')
  return ctx
}

export type { RichTextEditorCommand }

export interface RichTextEditorRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'>,
    React.RefAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  onChange?: (html: string) => void
  onSelectionChange?: (activeFormats: string[]) => void
  className?: string
  children?: React.ReactNode
}

export function RichTextEditorRoot({
  defaultValue,
  value,
  placeholder,
  disabled,
  onChange,
  onSelectionChange,
  className,
  children,
  ref,
  ...props
}: RichTextEditorRootProps) {
  const defaultValueRef = useRef(defaultValue)
  const valueRef = useRef(value)
  valueRef.current = value
  const placeholderRef = useRef(placeholder)
  placeholderRef.current = placeholder
  const disabledRef = useRef(disabled)
  disabledRef.current = disabled
  const stableOnChange = useCallbackRef(onChange)
  const stableOnSelectionChange = useCallbackRef(onSelectionChange)

  const machine = useMachine(() =>
    createRichTextEditor({
      defaultValue: defaultValueRef.current,
      get value() {
        return valueRef.current
      },
      get placeholder() {
        return placeholderRef.current
      },
      get disabled() {
        return disabledRef.current
      },
      onChange: stableOnChange,
      onSelectionChange: stableOnSelectionChange,
    })
  )

  const injectRootEl = useCallback((el: HTMLDivElement | null) => machine.setRootEl(el), [machine])
  const injectEditorEl = useCallback((el: HTMLDivElement | null) => machine.setEditorEl(el), [machine])
  const injectToolbarButtonEl = useCallback(
    (key: string, el: HTMLButtonElement | null) => machine.setToolbarButtonEl(key, el),
    [machine]
  )
  const rootProps = machine.getRootProps()

  return (
    <RichTextEditorContext.Provider
      value={{ machine, injectRootEl, injectEditorEl, injectToolbarButtonEl }}
    >
      <div
        {...props}
        data-state={rootProps['data-state']}
        ref={(el) => {
          injectRootEl(el)
          if (typeof ref === 'function') ref(el)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el
        }}
        className={cx('fc-rte', className)}
      >
        {children ?? (
          <>
            <RichTextEditorToolbar />
            <RichTextEditorLinkForm />
            <RichTextEditorEditor />
          </>
        )}
      </div>
    </RichTextEditorContext.Provider>
  )
}

export interface RichTextEditorToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function RichTextEditorToolbar({ className, onKeyDown, children, ...props }: RichTextEditorToolbarProps) {
  const { machine } = useRichTextEditorContext()
  const toolbarProps = machine.getToolbarProps()
  return (
    <div
      {...props}
      role={toolbarProps.role}
      aria-label={props['aria-label'] ?? toolbarProps['aria-label']}
      aria-controls={toolbarProps['aria-controls']}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (!e.defaultPrevented) toolbarProps.onKeyDown(e.nativeEvent)
      }}
      className={cx('fc-rte__toolbar', className)}
    >
      {children ?? (
        <>
          <RichTextEditorToolbarGroup label="Text style">
            <RichTextEditorButton command="bold"><strong>B</strong></RichTextEditorButton>
            <RichTextEditorButton command="italic"><em>I</em></RichTextEditorButton>
          </RichTextEditorToolbarGroup>
          <RichTextEditorToolbarGroup label="Lists">
            <RichTextEditorButton command="insertUnorderedList">•</RichTextEditorButton>
            <RichTextEditorButton command="insertOrderedList">1.</RichTextEditorButton>
          </RichTextEditorToolbarGroup>
          <RichTextEditorToolbarGroup label="Headings">
            <RichTextEditorButton command="formatBlock" value="p">P</RichTextEditorButton>
            <RichTextEditorButton command="formatBlock" value="h1">H1</RichTextEditorButton>
            <RichTextEditorButton command="formatBlock" value="h2">H2</RichTextEditorButton>
            <RichTextEditorButton command="formatBlock" value="h3">H3</RichTextEditorButton>
          </RichTextEditorToolbarGroup>
          <RichTextEditorToolbarGroup label="Insert">
            <RichTextEditorButton command="createLink">Link</RichTextEditorButton>
          </RichTextEditorToolbarGroup>
        </>
      )}
    </div>
  )
}

export interface RichTextEditorToolbarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  className?: string
}

export function RichTextEditorToolbarGroup({
  label,
  className,
  ...props
}: RichTextEditorToolbarGroupProps) {
  const { machine } = useRichTextEditorContext()
  const groupProps = machine.getToolbarGroupProps(label)
  return (
    <div
      {...props}
      role={groupProps.role}
      aria-label={props['aria-label'] ?? groupProps['aria-label']}
      className={cx('fc-rte__toolbar-group', className)}
    />
  )
}

export interface RichTextEditorButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  command: RichTextEditorCommand
  value?: string
  className?: string
}

export function RichTextEditorButton({
  command,
  value,
  className,
  children,
  onClick,
  onMouseDown,
  onKeyDown,
  ...props
}: RichTextEditorButtonProps) {
  const { machine, injectToolbarButtonEl } = useRichTextEditorContext()
  const buttonProps = machine.getToolbarButtonProps(command, value)
  const key = value ? `${command}:${value}` : command

  return (
    <button
      {...props}
      type={buttonProps.type}
      aria-label={props['aria-label'] ?? buttonProps['aria-label']}
      aria-pressed={buttonProps['aria-pressed']}
      data-state={buttonProps['data-state']}
      data-command={buttonProps['data-command']}
      data-value={buttonProps['data-value']}
      disabled={buttonProps.disabled}
      onMouseDown={(e) => {
        onMouseDown?.(e)
        if (!e.defaultPrevented) buttonProps.onMouseDown(e.nativeEvent)
      }}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) buttonProps.onClick()
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (!e.defaultPrevented) buttonProps.onKeyDown(e.nativeEvent)
      }}
      ref={(el) => injectToolbarButtonEl(key, el)}
      className={cx('fc-rte__toolbar-button', className)}
    >
      {children ?? buttonProps['aria-label']}
    </button>
  )
}

export interface RichTextEditorEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function RichTextEditorEditor({
  className,
  onInput,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}: RichTextEditorEditorProps) {
  const { machine, injectEditorEl } = useRichTextEditorContext()
  const editorProps = machine.getEditorProps()
  const value = machine.getValue()
  const editorRef = useRef<HTMLDivElement | null>(null)
  const setEditorRef = useCallback(
    (el: HTMLDivElement | null) => {
      editorRef.current = el
      injectEditorEl(el)
    },
    [injectEditorEl]
  )

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    if (document.activeElement === editor) return
    if (editor.innerHTML !== value) editor.innerHTML = value
  }, [value])

  return (
    <div
      {...props}
      id={props.id ?? editorProps.id}
      contentEditable={editorProps.contentEditable}
      role={editorProps.role}
      aria-multiline={editorProps['aria-multiline']}
      aria-label={props['aria-label'] ?? editorProps['aria-label']}
      aria-disabled={editorProps['aria-disabled']}
      data-placeholder={editorProps['data-placeholder']}
      data-state={editorProps['data-state']}
      spellCheck={editorProps.spellcheck}
      onInput={(e) => {
        onInput?.(e)
        if (!e.defaultPrevented) editorProps.onInput()
      }}
      onFocus={(e) => {
        onFocus?.(e)
        if (!e.defaultPrevented) editorProps.onFocus()
      }}
      onBlur={(e) => {
        onBlur?.(e)
        if (!e.defaultPrevented) editorProps.onBlur()
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (!e.defaultPrevented) editorProps.onKeyDown(e.nativeEvent)
      }}
      ref={setEditorRef}
      className={cx('fc-rte__editor', className)}
      suppressContentEditableWarning
    />
  )
}

export interface RichTextEditorLinkFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  className?: string
}

export function RichTextEditorLinkForm({ className, onSubmit, ...props }: RichTextEditorLinkFormProps) {
  const { machine } = useRichTextEditorContext()
  const formProps = machine.getLinkFormProps()
  const inputProps = machine.getLinkInputProps()

  return (
    <form
      {...props}
      hidden={formProps.hidden}
      onSubmit={(e) => {
        onSubmit?.(e)
        const prevented = e.defaultPrevented
        e.preventDefault()
        if (!prevented) formProps.onSubmit()
      }}
      className={cx('fc-rte__link-form', className)}
    >
      <input
        className="fc-rte__link-input"
        type={inputProps.type}
        value={inputProps.value}
        placeholder={inputProps.placeholder}
        disabled={inputProps.disabled}
        aria-label="Link URL"
        onChange={(e) => inputProps.onInput(e.currentTarget.value)}
        onKeyDown={(e) => inputProps.onKeyDown(e.nativeEvent)}
      />
      <button className="fc-rte__link-apply" type="submit" disabled={inputProps.disabled}>
        Apply
      </button>
      <button
        className="fc-rte__link-cancel"
        type="button"
        onClick={formProps.onCancel}
        disabled={inputProps.disabled}
      >
        Cancel
      </button>
    </form>
  )
}
