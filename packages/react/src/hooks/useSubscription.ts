import { useEffect, useReducer } from 'react'

interface Subscribable {
  subscribe(listener: (...args: unknown[]) => void): () => void
}

export function useSubscription(machine: Subscribable): void {
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)
  useEffect(() => machine.subscribe(() => forceUpdate()), [machine])
}
