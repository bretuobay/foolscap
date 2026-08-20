import { ChangeDetectorRef, DestroyRef, inject } from '@angular/core'

export interface MachineInstance {
  subscribe(listener: (...args: unknown[]) => void): () => void
  destroy(): void
}

export function injectMachine<M extends MachineInstance>(factory: () => M): M {
  const destroyRef = inject(DestroyRef, { optional: true })
  const cdr = inject(ChangeDetectorRef, { optional: true })

  if (!destroyRef || !cdr) {
    throw new Error('injectMachine() must be called in an Angular injection context')
  }

  const machine = factory()
  const unsub = machine.subscribe(() => {
    cdr.markForCheck()
  })

  destroyRef.onDestroy(() => {
    unsub()
    machine.destroy()
  })

  return machine
}

/** Cross-framework alias matching React/Vue `useMachine`. */
export const useMachine = injectMachine
