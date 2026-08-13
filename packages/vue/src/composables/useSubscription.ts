import { getCurrentInstance, onUnmounted } from 'vue'

interface Subscribable {
  subscribe(listener: (...args: unknown[]) => void): () => void
}

export function useSubscription(machine: Subscribable): void {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('useSubscription() must be called during setup()')
  }

  const unsub = machine.subscribe(() => {
    instance.proxy?.$forceUpdate()
  })

  onUnmounted(unsub)
}
