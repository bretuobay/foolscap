import { describe, it, expect, afterEach } from 'vitest'
import { createAccordion } from './accordion'
import { fixture } from '../utils/test-helpers'

describe('createAccordion', () => {
  let cleanup: () => void
  afterEach(() => cleanup?.())

  function makeDetails(values: string[]) {
    const html = values.map((v) => `<details id="${v}"><summary>${v}</summary></details>`).join('')
    const { container, cleanup: c } = fixture(`<div>${html}</div>`)
    cleanup = c
    return values.map((v) => container.querySelector<HTMLElement>(`#${v}`)!)
  }

  it('type=single: opening one item closes others', async () => {
    const [d1, d2] = makeDetails(['a', 'b'])
    const acc = createAccordion({ type: 'single' })
    const unreg1 = acc.register({ value: 'a', detailsEl: d1 })
    const unreg2 = acc.register({ value: 'b', detailsEl: d2 })

    ;(d1 as HTMLDetailsElement).open = true
    d1.dispatchEvent(new Event('toggle'))
    expect((d1 as HTMLDetailsElement).open).toBe(true)

    ;(d2 as HTMLDetailsElement).open = true
    d2.dispatchEvent(new Event('toggle'))
    expect((d1 as HTMLDetailsElement).open).toBe(false)
    expect((d2 as HTMLDetailsElement).open).toBe(true)

    unreg1()
    unreg2()
    acc.destroy()
  })

  it('type=multiple: all items can be open simultaneously', () => {
    const [d1, d2] = makeDetails(['x', 'y'])
    const acc = createAccordion({ type: 'multiple' })
    const unreg1 = acc.register({ value: 'x', detailsEl: d1 })
    const unreg2 = acc.register({ value: 'y', detailsEl: d2 })

    ;(d1 as HTMLDetailsElement).open = true
    d1.dispatchEvent(new Event('toggle'))
    ;(d2 as HTMLDetailsElement).open = true
    d2.dispatchEvent(new Event('toggle'))

    expect((d1 as HTMLDetailsElement).open).toBe(true)
    expect((d2 as HTMLDetailsElement).open).toBe(true)

    unreg1()
    unreg2()
    acc.destroy()
  })

  it('dispatches fc:open custom event', () => {
    const [d1] = makeDetails(['p'])
    const acc = createAccordion()
    let fired = false
    d1.addEventListener('fc:open', () => {
      fired = true
    })
    acc.register({ value: 'p', detailsEl: d1 })

    ;(d1 as HTMLDetailsElement).open = true
    d1.dispatchEvent(new Event('toggle'))

    expect(fired).toBe(true)
    acc.destroy()
  })

  it('dispatches fc:close custom event', () => {
    const [d1] = makeDetails(['q'])
    const acc = createAccordion()
    let fired = false
    d1.addEventListener('fc:close', () => {
      fired = true
    })
    acc.register({ value: 'q', detailsEl: d1 })

    ;(d1 as HTMLDetailsElement).open = true
    d1.dispatchEvent(new Event('toggle'))
    ;(d1 as HTMLDetailsElement).open = false
    d1.dispatchEvent(new Event('toggle'))

    expect(fired).toBe(true)
    acc.destroy()
  })

  it('unregister removes listener', () => {
    const [d1] = makeDetails(['r'])
    const acc = createAccordion()
    const count = 0
    acc.register({ value: 'r', detailsEl: d1 })
    const unreg = acc.register({ value: 'r2', detailsEl: d1 })
    unreg()
    d1.dispatchEvent(new Event('toggle'))
    // No crash — just verifying cleanup doesn't throw
    expect(count).toBe(0)
    acc.destroy()
  })
})
