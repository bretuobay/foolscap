import { unref, type MaybeRef } from 'vue'

export function useStableCallback<T extends (...args: never[]) => unknown>(
  fn: MaybeRef<T | undefined>,
): T {
  return ((...args: never[]) => unref(fn)?.(...args)) as T
}
