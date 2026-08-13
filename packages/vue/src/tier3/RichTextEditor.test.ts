import { h } from 'vue'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RichTextEditorRoot } from './RichTextEditor'

describe('RichTextEditor', () => {
  let execCommand: ReturnType<typeof vi.fn>
  let queryCommandState: ReturnType<typeof vi.fn>
  let queryCommandValue: ReturnType<typeof vi.fn>

  beforeEach(() => {
    execCommand = vi.fn()
    queryCommandState = vi.fn(() => false)
    queryCommandValue = vi.fn(() => '')
    Object.assign(document, { execCommand, queryCommandState, queryCommandValue })
  })

  it('renders toolbar and editable textbox', () => {
    render(h(RichTextEditorRoot, { defaultValue: '<p>Hello</p>', placeholder: 'Write...' }))
    expect(screen.getByRole('toolbar', { name: 'Text formatting' })).toHaveClass('fc-rte__toolbar')
    expect(screen.getByRole('textbox', { name: 'Content editor' })).toHaveAttribute(
      'contenteditable',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('emits change on editor input', () => {
    const onChange = vi.fn()
    render(h(RichTextEditorRoot, { defaultValue: '<p>Hello</p>', onChange }))
    const editor = screen.getByRole('textbox', { name: 'Content editor' })
    editor.innerHTML = '<p>Changed</p>'
    fireEvent.input(editor)
    expect(onChange).toHaveBeenCalledWith('<p>Changed</p>')
  })

  it('allows clearing all editor content without restoring the previous html', () => {
    const onChange = vi.fn()
    render(h(RichTextEditorRoot, { defaultValue: '<p>Hello</p>', onChange, placeholder: 'Write...' }))
    const editor = screen.getByRole('textbox', { name: 'Content editor' })
    editor.focus()
    editor.innerHTML = ''
    fireEvent.input(editor)
    expect(editor.innerHTML).toBe('')
    expect(onChange).toHaveBeenCalledWith('')
  })

  it('does not prevent basic editing and navigation keys', () => {
    render(h(RichTextEditorRoot, { defaultValue: '<p>Hello</p>' }))
    const editor = screen.getByRole('textbox', { name: 'Content editor' })
    for (const key of ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab']) {
      const allowed = editor.dispatchEvent(new KeyboardEvent('keydown', { key, cancelable: true, bubbles: true }))
      expect(allowed, key).toBe(true)
    }
  })

  it('executes toolbar commands without stealing selection on mousedown', async () => {
    const user = userEvent.setup()
    render(h(RichTextEditorRoot, { defaultValue: '<p>Hello</p>' }))
    const bold = screen.getByRole('button', { name: 'Bold' })
    const mouseDown = bold.dispatchEvent(new MouseEvent('mousedown', { cancelable: true, bubbles: true }))
    expect(mouseDown).toBe(false)
    await user.click(bold)
    expect(execCommand).toHaveBeenCalledWith('bold', false, undefined)
  })

  it('reflects active toolbar state', async () => {
    queryCommandState.mockImplementation((command: string) => command === 'italic')
    render(h(RichTextEditorRoot, { defaultValue: '<p>Hello</p>' }))
    const editor = screen.getByRole('textbox', { name: 'Content editor' })
    editor.focus()
    editor.dispatchEvent(new FocusEvent('focus', { bubbles: true }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('aria-pressed', 'true')
    })
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('data-state', 'active')
  })

  it('opens link form and applies url', async () => {
    const user = userEvent.setup()
    render(h(RichTextEditorRoot, { defaultValue: '<p>Hello</p>' }))
    await user.click(screen.getByRole('button', { name: 'Insert link' }))
    await user.type(screen.getByRole('textbox', { name: 'Link URL' }), 'https://example.com')
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(execCommand).toHaveBeenCalledWith('createLink', false, 'https://example.com')
  })

  it('reflects controlled value while emitting change', () => {
    const onChange = vi.fn()
    render(h(RichTextEditorRoot, { value: '<p>Controlled</p>', onChange }))
    const editor = screen.getByRole('textbox', { name: 'Content editor' })
    expect(editor.innerHTML).toBe('<p>Controlled</p>')
    editor.innerHTML = '<p>Draft</p>'
    fireEvent.input(editor)
    expect(onChange).toHaveBeenCalledWith('<p>Draft</p>')
  })
})
