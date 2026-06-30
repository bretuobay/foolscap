import { useEffect, useReducer, useRef } from 'react'

export interface MachineInstance {
  subscribe(listener: (...args: unknown[]) => void): () => void
  destroy(): void
}

export function useMachine<M extends MachineInstance>(factory: () => M): M {
  const machineRef = useRef<M | null>(null)
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)

  // Synchronous init — safe under StrictMode double-invoke because the
  // cleanup effect below nulls the ref, causing recreation on the next render.
  if (machineRef.current === null) {
    machineRef.current = factory()
  }

  useEffect(() => {
    const machine = machineRef.current
    if (!machine) return
    return machine.subscribe(() => forceUpdate())
  }, [])

  useEffect(() => {
    return () => {
      machineRef.current?.destroy()
      machineRef.current = null
    }
  }, [])

  return machineRef.current as M
}
