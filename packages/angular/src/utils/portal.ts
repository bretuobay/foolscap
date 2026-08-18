import { afterNextRender, DestroyRef, inject } from '@angular/core'

/** Move a host node to `document.body` (Vue `Teleport` equivalent). */
export function attachToBody(el: HTMLElement): void {
  const destroyRef = inject(DestroyRef)
  afterNextRender(() => {
    if (el.parentElement !== document.body) {
      document.body.appendChild(el)
    }
  })
  destroyRef.onDestroy(() => {
    el.remove()
  })
}
