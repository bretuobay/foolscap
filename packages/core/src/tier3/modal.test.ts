import { describe, it, expect, afterEach, vi } from 'vitest'
import { createModal } from './modal'
import { fixture } from '../utils/test-helpers'

describe('createModal', () => {
  let cleanup: () => void
  afterEach(() => {
    cleanup?.()
    vi.useRealTimers()
    document.body.style.overflow = ''
  })

  function setup(opts = {}) {
    const { container, cleanup: c } = fixture(`
      <button id="trigger">Open</button>
      <dialog id="dialog">
        <button id="close">Close</button>
      </dialog>
    `)
    cleanup = c
    const trigger = container.querySelector<HTMLElement>('#trigger')!
    const dialogEl = container.querySelector<HTMLDialogElement>('#dialog')!
    const modal = createModal(dialogEl, opts)
    return { trigger, dialogEl, modal, container }
  }

  it('starts closed', () => {
    const { modal } = setup()
    expect(modal.state.status).toBe('closed')
    modal.destroy()
  })

  it('open() calls showModal and sets status to opening then open', async () => {
    const { dialogEl, modal } = setup()
    modal.open()
    expect(modal.state.status).toBe('opening')
    await new Promise((r) => setTimeout(r, 50))
    expect(modal.state.status).toBe('open')
    expect(dialogEl.open).toBe(true)
    modal.close()
    modal.destroy()
  })

  it('focus is trapped inside dialog after open', async () => {
    const { modal } = setup()
    modal.open()
    await new Promise((r) => setTimeout(r, 50))
    // The first focusable inside dialog should now have focus
    expect(document.activeElement?.id).toBe('close')
    modal.close()
    modal.destroy()
  })

  it('scroll lock applied on open', async () => {
    const { modal } = setup()
    modal.open()
    await new Promise((r) => setTimeout(r, 20))
    expect(document.body.style.overflow).toBe('hidden')
    modal.close()
    modal.destroy()
  })

  it('close() removes scroll lock', async () => {
    vi.useFakeTimers()
    const { modal } = setup({ animationDuration: 0 })
    modal.open()
    await vi.runAllTimersAsync()
    modal.close()
    await vi.runAllTimersAsync()
    expect(document.body.style.overflow).toBe('')
    modal.destroy()
  })

  it('status transitions closing → closed', async () => {
    vi.useFakeTimers()
    const { modal } = setup({ animationDuration: 100 })
    modal.open()
    await vi.runAllTimersAsync()
    modal.close()
    expect(modal.state.status).toBe('closing')
    await vi.advanceTimersByTimeAsync(101)
    expect(modal.state.status).toBe('closed')
    modal.destroy()
  })

  it('getRootProps data-state reflects current status', () => {
    const { modal } = setup()
    expect(modal.getRootProps()['data-state']).toBe('closed')
    modal.destroy()
  })

  it('onAnimationEnd when closing completes close sequence', async () => {
    vi.useFakeTimers()
    const { modal } = setup({ animationDuration: 9999 })
    modal.open()
    await vi.runAllTimersAsync()
    modal.close()
    expect(modal.state.status).toBe('closing')
    // simulate animation ending
    modal.getRootProps().onAnimationEnd()
    expect(modal.state.status).toBe('closed')
    modal.destroy()
  })

  it('backdrop click closes modal when closeOnBackdropClick=true (default)', async () => {
    const { dialogEl, modal } = setup()
    modal.open()
    await new Promise((r) => setTimeout(r, 50))
    dialogEl.dispatchEvent(new MouseEvent('click', { target: dialogEl } as any))
    // The click on the dialog element itself (backdrop) should trigger close
    expect(['closing', 'closed']).toContain(modal.state.status)
    modal.destroy()
  })

  it('destroy removes listeners without throwing', () => {
    const { modal } = setup()
    expect(() => modal.destroy()).not.toThrow()
  })
})
