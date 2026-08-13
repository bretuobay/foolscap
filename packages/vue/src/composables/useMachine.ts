import { getCurrentInstance, onUnmounted, shallowRef } from 'vue'

export interface MachineInstance {
  subscribe(listener: (...args: unknown[]) => void): () => void
  destroy(): void
}

export function useMachine<M extends MachineInstance>(factory: () => M): M {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('useMachine() must be called during setup()')
  }

  const machine = factory()
  const version = shallowRef(0)

  const unsub = machine.subscribe(() => {
    version.value += 1
    instance.proxy?.$forceUpdate()
  })

  onUnmounted(() => {
    unsub()
    machine.destroy()
  })

  return new Proxy(machine, {
    get(target, prop, receiver) {
      if (prop === 'state') {
        void version.value
        return (target as M & { state?: unknown }).state
      }
      const value = Reflect.get(target, prop, receiver) as unknown
      return typeof value === 'function' ? (value as (...args: never[]) => unknown).bind(target) : value
    },
  }) as M
}
