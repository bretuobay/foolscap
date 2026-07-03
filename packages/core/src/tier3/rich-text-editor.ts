import { createStore } from '@web-loom/store-core'
import { dispatch } from '../utils/events'
import { createId } from '../utils/id'

export type RichTextEditorCommand =
  | 'bold'
  | 'italic'
  | 'insertUnorderedList'
  | 'insertOrderedList'
  | 'formatBlock'
  | 'createLink'

export interface RichTextEditorOptions {
  defaultValue?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  onChange?: (html: string) => void
  onSelectionChange?: (activeFormats: string[]) => void
}

export interface RichTextEditorState {
  activeFormats: Set<string>
  isEmpty: boolean
  isFocused: boolean
  isDisabled: boolean
  isLinkDialogOpen: boolean
}

interface RichTextEditorStoreState {
  html: string
  activeFormats: Set<string>
  isFocused: boolean
  isLinkDialogOpen: boolean
  linkUrl: string
}

export interface RichTextEditor {
  readonly state: RichTextEditorState
  setRootEl(el: HTMLElement | null): void
  setEditorEl(el: HTMLElement | null): void
  setToolbarButtonEl(key: string, el: HTMLElement | null): void
  execCommand(command: RichTextEditorCommand, value?: string): void
  getValue(): string
  setValue(html: string): void
  openLinkDialog(): void
  closeLinkDialog(): void
  setLinkUrl(url: string): void
  applyLink(): void
  getRootProps(): {
    'data-state': 'disabled' | 'focused' | undefined
  }
  getToolbarProps(): {
    role: 'toolbar'
    'aria-label': string
    'aria-controls': string
    onKeyDown(e: KeyboardEvent): void
  }
  getToolbarGroupProps(label: string): {
    role: 'group'
    'aria-label': string
  }
  getToolbarButtonProps(command: RichTextEditorCommand, value?: string): {
    type: 'button'
    'aria-label': string
    'aria-pressed': boolean | undefined
    'data-state': 'active' | 'disabled' | undefined
    'data-command': string
    'data-value': string | undefined
    disabled: boolean
    onMouseDown(e: MouseEvent): void
    onClick(): void
    onKeyDown(e: KeyboardEvent): void
  }
  getEditorProps(): {
    id: string
    contentEditable: 'true' | 'false'
    role: 'textbox'
    'aria-multiline': true
    'aria-label': string
    'aria-disabled': true | undefined
    'data-placeholder': string | undefined
    'data-state': 'empty' | undefined
    spellcheck: true
    onInput(): void
    onFocus(): void
    onBlur(): void
    onKeyDown(e: KeyboardEvent): void
  }
  getLinkFormProps(): {
    hidden: boolean
    onSubmit(): void
    onCancel(): void
  }
  getLinkInputProps(): {
    type: 'url'
    value: string
    placeholder: string
    disabled: boolean
    onInput(value: string): void
    onKeyDown(e: KeyboardEvent): void
  }
  subscribe(listener: (s: RichTextEditorStoreState, prev: RichTextEditorStoreState) => void): () => void
  destroy(): void
}

function textFromHtml(html: string): string {
  if (typeof document === 'undefined') return html.replace(/<[^>]*>/g, '').trim()
  const el = document.createElement('div')
  el.innerHTML = html
  return (el.textContent ?? '').trim()
}

function isEmptyHtml(html: string): boolean {
  return textFromHtml(html) === ''
}

function formatKey(command: RichTextEditorCommand, value?: string): string {
  return value ? `${command}:${value}` : command
}

function buttonLabel(command: RichTextEditorCommand, value?: string): string {
  if (command === 'bold') return 'Bold'
  if (command === 'italic') return 'Italic'
  if (command === 'insertUnorderedList') return 'Bullet list'
  if (command === 'insertOrderedList') return 'Numbered list'
  if (command === 'createLink') return 'Insert link'
  if (command === 'formatBlock') return value ? value.toUpperCase() : 'Paragraph'
  return command
}

function isToggleCommand(command: RichTextEditorCommand): boolean {
  return command !== 'createLink'
}

function normalizeBlockValue(value: string): string {
  return value.replace(/[<>]/g, '').toLowerCase()
}

export function createRichTextEditor(opts: RichTextEditorOptions = {}): RichTextEditor {
  const id = createId('fc-rte')
  const isControlled = opts.value !== undefined
  const disabled = opts.disabled ?? false

  const store = createStore(
    {
      html: opts.value ?? opts.defaultValue ?? '',
      activeFormats: new Set<string>(),
      isFocused: false,
      isLinkDialogOpen: false,
      linkUrl: '',
    } as RichTextEditorStoreState,
    (set) => ({
      setHtml(html: string) {
        if (!isControlled) set((s) => ({ ...s, html }))
      },
      setActiveFormats(activeFormats: Set<string>) {
        set((s) => ({ ...s, activeFormats }))
      },
      setFocused(isFocused: boolean) {
        set((s) => ({ ...s, isFocused }))
      },
      setLinkDialogOpen(isLinkDialogOpen: boolean) {
        set((s) => ({ ...s, isLinkDialogOpen }))
      },
      setLinkUrl(linkUrl: string) {
        set((s) => ({ ...s, linkUrl }))
      },
    })
  )

  let rootEl: HTMLElement | null = null
  let editorEl: HTMLElement | null = null
  let observer: MutationObserver | null = null
  const toolbarButtonEls = new Map<string, HTMLElement>()

  function currentHtml(): string {
    return isControlled ? (opts.value ?? '') : store.getState().html
  }

  function commandState(command: string): boolean {
    if (typeof document === 'undefined' || typeof document.queryCommandState !== 'function') return false
    try {
      return document.queryCommandState(command)
    } catch {
      return false
    }
  }

  function commandValue(command: string): string {
    if (typeof document === 'undefined' || typeof document.queryCommandValue !== 'function') return ''
    try {
      return String(document.queryCommandValue(command) ?? '').toLowerCase()
    } catch {
      return ''
    }
  }

  function computeActiveFormats(): Set<string> {
    const active = new Set<string>()
    if (commandState('bold')) active.add('bold')
    if (commandState('italic')) active.add('italic')
    if (commandState('insertUnorderedList')) active.add('insertUnorderedList')
    if (commandState('insertOrderedList')) active.add('insertOrderedList')
    const block = normalizeBlockValue(commandValue('formatBlock'))
    for (const heading of ['h1', 'h2', 'h3']) {
      if (block === heading) active.add(formatKey('formatBlock', heading))
    }
    return active
  }

  function emitSelectionChange(activeFormats: Set<string>): void {
    const formats = Array.from(activeFormats)
    dispatch(rootEl, 'selection-change', { activeFormats: formats })
    opts.onSelectionChange?.(formats)
  }

  function updateActiveFormats(): void {
    const activeFormats = computeActiveFormats()
    store.actions.setActiveFormats(activeFormats)
    emitSelectionChange(activeFormats)
  }

  function syncHtmlFromEditor(): void {
    if (!editorEl) return
    const html = editorEl.innerHTML
    const prev = currentHtml()
    if (html === prev) return
    store.actions.setHtml(html)
    dispatch(rootEl, 'change', { html })
    opts.onChange?.(html)
  }

  function applyHtmlToEditor(html: string): void {
    if (editorEl && editorEl.innerHTML !== html) editorEl.innerHTML = html
  }

  function moveToolbarFocus(delta: 1 | -1): void {
    const buttons = Array.from(toolbarButtonEls.values()).filter((button) => !button.hasAttribute('disabled'))
    if (buttons.length === 0) return
    const current = document.activeElement instanceof HTMLElement ? buttons.indexOf(document.activeElement) : -1
    const next = current < 0 ? 0 : Math.min(Math.max(current + delta, 0), buttons.length - 1)
    buttons[next]?.focus()
  }

  function focusToolbarBoundary(position: 'first' | 'last'): void {
    const buttons = Array.from(toolbarButtonEls.values()).filter((button) => !button.hasAttribute('disabled'))
    const target = position === 'first' ? buttons[0] : buttons[buttons.length - 1]
    target?.focus()
  }

  function focusEditor(): void {
    editorEl?.focus()
  }

  function handleSelectionChange(): void {
    if (!editorEl) return
    const selection = document.getSelection()
    if (selection?.anchorNode && editorEl.contains(selection.anchorNode)) updateActiveFormats()
  }

  function cleanupObserver(): void {
    observer?.disconnect()
    observer = null
  }

  document.addEventListener('selectionchange', handleSelectionChange)

  const instance: RichTextEditor = {
    get state() {
      const state = store.getState()
      return {
        activeFormats: new Set(state.activeFormats),
        isEmpty: isEmptyHtml(currentHtml()),
        isFocused: state.isFocused,
        isDisabled: disabled,
        isLinkDialogOpen: state.isLinkDialogOpen,
      }
    },

    setRootEl(el) {
      rootEl = el
    },

    setEditorEl(el) {
      cleanupObserver()
      editorEl = el
      if (editorEl) {
        applyHtmlToEditor(currentHtml())
        if (typeof MutationObserver !== 'undefined') {
          observer = new MutationObserver(syncHtmlFromEditor)
          observer.observe(editorEl, { childList: true, subtree: true, characterData: true })
        }
      }
    },

    setToolbarButtonEl(key, el) {
      if (el) toolbarButtonEls.set(key, el)
      else toolbarButtonEls.delete(key)
    },

    execCommand(command, value) {
      if (disabled) return
      if (command === 'createLink' && !value) {
        instance.openLinkDialog()
        return
      }
      focusEditor()
      if (typeof document !== 'undefined' && typeof document.execCommand === 'function') {
        document.execCommand(command, false, value)
      }
      syncHtmlFromEditor()
      updateActiveFormats()
    },

    getValue() {
      return currentHtml()
    },

    setValue(html) {
      if (disabled) return
      store.actions.setHtml(html)
      applyHtmlToEditor(html)
      dispatch(rootEl, 'change', { html })
      opts.onChange?.(html)
    },

    openLinkDialog() {
      if (disabled) return
      store.actions.setLinkDialogOpen(true)
    },

    closeLinkDialog() {
      store.actions.setLinkDialogOpen(false)
      store.actions.setLinkUrl('')
      focusEditor()
    },

    setLinkUrl(url) {
      store.actions.setLinkUrl(url)
    },

    applyLink() {
      const url = store.getState().linkUrl.trim()
      if (url) instance.execCommand('createLink', url)
      instance.closeLinkDialog()
    },

    getRootProps() {
      return {
        'data-state': disabled ? 'disabled' : store.getState().isFocused ? 'focused' : undefined,
      }
    },

    getToolbarProps() {
      return {
        role: 'toolbar',
        'aria-label': 'Text formatting',
        'aria-controls': `${id}-editor`,
        onKeyDown(e) {
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            moveToolbarFocus(1)
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault()
            moveToolbarFocus(-1)
          } else if (e.key === 'Home') {
            e.preventDefault()
            focusToolbarBoundary('first')
          } else if (e.key === 'End') {
            e.preventDefault()
            focusToolbarBoundary('last')
          } else if (e.key === 'Escape') {
            e.preventDefault()
            focusEditor()
          }
        },
      }
    },

    getToolbarGroupProps(label) {
      return { role: 'group', 'aria-label': label }
    },

    getToolbarButtonProps(command, value) {
      const key = formatKey(command, value)
      const pressed = isToggleCommand(command) ? store.getState().activeFormats.has(key) : undefined
      return {
        type: 'button',
        'aria-label': buttonLabel(command, value),
        'aria-pressed': pressed,
        'data-state': disabled ? 'disabled' : pressed ? 'active' : undefined,
        'data-command': command,
        'data-value': value,
        disabled,
        onMouseDown(e) {
          e.preventDefault()
        },
        onClick() {
          instance.execCommand(command, value)
        },
        onKeyDown(e) {
          if ((e.key === 'Enter' || e.key === ' ' || e.key === 'Space') && !disabled) {
            e.preventDefault()
            instance.execCommand(command, value)
          }
        },
      }
    },

    getEditorProps() {
      const empty = isEmptyHtml(currentHtml())
      return {
        id: `${id}-editor`,
        contentEditable: disabled ? 'false' : 'true',
        role: 'textbox',
        'aria-multiline': true,
        'aria-label': 'Content editor',
        'aria-disabled': disabled ? true : undefined,
        'data-placeholder': opts.placeholder,
        'data-state': empty ? 'empty' : undefined,
        spellcheck: true,
        onInput() {
          if (!disabled) syncHtmlFromEditor()
        },
        onFocus() {
          store.actions.setFocused(true)
          updateActiveFormats()
        },
        onBlur() {
          store.actions.setFocused(false)
        },
        onKeyDown(e) {
          if (disabled) return
          const modifier = e.metaKey || e.ctrlKey
          if (!modifier) return
          const key = e.key.toLowerCase()
          if (key === 'b') {
            e.preventDefault()
            instance.execCommand('bold')
          } else if (key === 'i') {
            e.preventDefault()
            instance.execCommand('italic')
          } else if (key === 'k') {
            e.preventDefault()
            instance.openLinkDialog()
          }
        },
      }
    },

    getLinkFormProps() {
      return {
        hidden: !store.getState().isLinkDialogOpen,
        onSubmit: instance.applyLink,
        onCancel: instance.closeLinkDialog,
      }
    },

    getLinkInputProps() {
      return {
        type: 'url',
        value: store.getState().linkUrl,
        placeholder: 'https://example.com',
        disabled,
        onInput(value) {
          instance.setLinkUrl(value)
        },
        onKeyDown(e) {
          if (e.key === 'Escape') {
            e.preventDefault()
            instance.closeLinkDialog()
          }
        },
      }
    },

    subscribe: store.subscribe.bind(store),

    destroy() {
      document.removeEventListener('selectionchange', handleSelectionChange)
      cleanupObserver()
      toolbarButtonEls.clear()
      store.destroy()
    },
  }

  return instance
}
