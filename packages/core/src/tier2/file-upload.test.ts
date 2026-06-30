import { describe, it, expect, afterEach } from 'vitest'
import { createFileUpload } from './file-upload'
import { fixture } from '../utils/test-helpers'

describe('createFileUpload', () => {
  let cleanup: () => void
  afterEach(() => cleanup?.())

  function setup(opts = {}) {
    const { container, cleanup: c } = fixture('<input type="file" />')
    cleanup = c
    const inputEl = container.querySelector<HTMLInputElement>('input')!
    const fu = createFileUpload(inputEl, opts)
    return { inputEl, fu, container }
  }

  it('initial state has no files and isDragging=false', () => {
    const { fu } = setup()
    expect(fu.state.files).toEqual([])
    expect(fu.state.isDragging).toBe(false)
    fu.destroy()
  })

  it('getDropzoneProps role is button', () => {
    const { fu } = setup()
    expect(fu.getDropzoneProps().role).toBe('button')
    fu.destroy()
  })

  it('getInputProps type is file', () => {
    const { fu } = setup()
    expect(fu.getInputProps().type).toBe('file')
    fu.destroy()
  })

  it('validates maxSize and calls onError for oversized files', () => {
    const errors: unknown[] = []
    const { fu } = setup({ maxSize: 10, onError: (e: unknown) => errors.push(e) })
    const largeFile = new File(['x'.repeat(100)], 'big.txt')
    // Simulate drop
    const dropzone = fu.getDropzoneProps()
    const dt = { files: [largeFile] } as unknown as DataTransfer
    const dropEvent = {
      preventDefault: () => {},
      dataTransfer: dt,
      currentTarget: document.body,
    } as unknown as DragEvent
    dropzone.onDrop(dropEvent)
    expect(errors.length).toBeGreaterThan(0)
    expect((errors[0] as any).type).toBe('size')
    fu.destroy()
  })

  it('fc:files-selected fires for valid files', () => {
    let detail: unknown = null
    const { container, fu } = setup()
    container.addEventListener('fc:files-selected', (e: Event) => {
      detail = (e as CustomEvent).detail
    })
    const validFile = new File(['hello'], 'hello.txt')
    const dt = { files: [validFile] } as unknown as DataTransfer
    const dropEvent = {
      preventDefault: () => {},
      dataTransfer: dt,
      currentTarget: container,
    } as unknown as DragEvent
    fu.getDropzoneProps().onDrop(dropEvent)
    expect(detail).not.toBeNull()
    expect((detail as any).files).toHaveLength(1)
    fu.destroy()
  })
})
