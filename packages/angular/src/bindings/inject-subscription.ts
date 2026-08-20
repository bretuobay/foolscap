import { ChangeDetectorRef, DestroyRef, inject } from '@angular/core'

interface Subscribable {
  subscribe(listener: (...args: unknown[]) => void): () => void
}

export function injectSubscription(machine: Subscribable): void {
  const destroyRef = inject(DestroyRef, { optional: true })
  const cdr = inject(ChangeDetectorRef, { optional: true })

  if (!destroyRef || !cdr) {
    throw new Error('injectSubscription() must be called in an Angular injection context')
  }

  const unsub = machine.subscribe(() => {
    cdr.markForCheck()
  })

  destroyRef.onDestroy(unsub)
}
