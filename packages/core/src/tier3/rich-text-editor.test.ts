import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRichTextEditor } from './rich-text-editor'
import { fixture } from '../utils/test-helpers'

describe('createRichTextEditor', () => {
  let cleanup: () => void
  let execCommand: ReturnType<typeof vi.fn>
  let queryCommandState: ReturnType<typeof vi.fn>
  let queryCommandValue: ReturnType<typeof vi.fn>

  beforeEach(() => {
    execCommand = vi.fn()
    queryCommandState = vi.fn(() => false)
    queryCommandValue = vi.fn(() => '')
    Object.assign(document, { execCommand, queryCommandState, queryCommandValue })
  })

  afterEach(() => {
    cleanup?.()
    vi.restoreAllMocks()
  })

  function setup(opts = {}) {
    const { container, cleanup: c } = fixture(`<div id="root"><div id="editor"></div></div>`)
    cleanup = c
    const rootEl = container.querySelector<HTMLElement>('#root')!
    const editorEl = container.querySelector<HTMLElement>('#editor')!
    const rte = createRichTextEditor({ defaultValue: '<p>Hello</p>', ...opts })
    rte.setRootEl(rootEl)
    rte.setEditorEl(editorEl)
    return { rte, rootEl, editorEl }
  }

  it('initializes editor html and reports value state', () => {
    const { rte, editorEl } = setup()
    expect(rte.getValue()).toBe('<p>Hello</p>')
    expect(editorEl.innerHTML).toBe('<p>Hello</p>')
    expect(rte.state.isEmpty).toBe(false)
    expect(rte.getEditorProps()).toMatchObject({
      role: 'textbox',
      'aria-multiline': true,
      contentEditable: 'true',
    })
    rte.destroy()
  })

  it('sets value and emits change', () => {
    const onChange = vi.fn()
    const { rte, rootEl, editorEl } = setup({ onChange })
    const details: unknown[] = []
    rootEl.addEventListener('fc:change', (event) => details.push((event as CustomEvent).detail))
    rte.setValue('<h1>Title</h1>')
    expect(editorEl.innerHTML).toBe('<h1>Title</h1>')
    expect(onChange).toHaveBeenCalledWith('<h1>Title</h1>')
    expect(details).toEqual([{ html: '<h1>Title</h1>' }])
    rte.destroy()
  })

  it('syncs editor input to value', () => {
    const onChange = vi.fn()
    const { rte, editorEl } = setup({ onChange })
    editorEl.innerHTML = '<p>Changed</p>'
    rte.getEditorProps().onInput()
    expect(rte.getValue()).toBe('<p>Changed</p>')
    expect(onChange).toHaveBeenCalledWith('<p>Changed</p>')
    rte.destroy()
  })

  it('executes commands and updates active formats', () => {
    queryCommandState.mockImplementation((command: string) => command === 'bold')
    const { rte } = setup()
    rte.execCommand('bold')
    expect(execCommand).toHaveBeenCalledWith('bold', false, undefined)
    expect(rte.state.activeFormats).toEqual(new Set(['bold']))
    expect(rte.getToolbarButtonProps('bold')['aria-pressed']).toBe(true)
    rte.destroy()
  })

  it('tracks heading format from queryCommandValue', () => {
    queryCommandValue.mockImplementation((command: string) => (command === 'formatBlock' ? 'h2' : ''))
    const onSelectionChange = vi.fn()
    const { rte, rootEl, editorEl } = setup({ onSelectionChange })
    const details: unknown[] = []
    rootEl.addEventListener('fc:selection-change', (event) => details.push((event as CustomEvent).detail))
    const textNode = document.createTextNode('Hello')
    editorEl.append(textNode)
    const range = document.createRange()
    range.selectNodeContents(textNode)
    document.getSelection()?.removeAllRanges()
    document.getSelection()?.addRange(range)
    document.dispatchEvent(new Event('selectionchange'))
    expect(rte.state.activeFormats).toEqual(new Set(['formatBlock:h2']))
    expect(onSelectionChange).toHaveBeenCalledWith(['formatBlock:h2'])
    expect(details).toEqual([{ activeFormats: ['formatBlock:h2'] }])
    rte.destroy()
  })

  it('supports keyboard shortcuts', () => {
    const { rte } = setup()
    const event = new KeyboardEvent('keydown', { key: 'b', ctrlKey: true })
    rte.getEditorProps().onKeyDown(event)
    expect(execCommand).toHaveBeenCalledWith('bold', false, undefined)
    rte.destroy()
  })

  it('does not intercept normal editing and navigation keys', () => {
    const { rte } = setup()
    for (const key of ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab']) {
      const event = new KeyboardEvent('keydown', { key, cancelable: true })
      rte.getEditorProps().onKeyDown(event)
      expect(event.defaultPrevented, key).toBe(false)
    }
    rte.destroy()
  })

  it('opens and applies link dialog', () => {
    const { rte } = setup()
    rte.openLinkDialog()
    expect(rte.state.isLinkDialogOpen).toBe(true)
    rte.setLinkUrl('https://example.com')
    rte.applyLink()
    expect(execCommand).toHaveBeenCalledWith('createLink', false, 'https://example.com')
    expect(rte.state.isLinkDialogOpen).toBe(false)
    rte.destroy()
  })

  it('does not mutate while disabled', () => {
    const { rte, editorEl } = setup({ disabled: true })
    rte.execCommand('bold')
    rte.setValue('<p>Blocked</p>')
    editorEl.innerHTML = '<p>Changed</p>'
    rte.getEditorProps().onInput()
    expect(execCommand).not.toHaveBeenCalled()
    expect(rte.getValue()).toBe('<p>Hello</p>')
    expect(rte.getRootProps()['data-state']).toBe('disabled')
    rte.destroy()
  })
})
