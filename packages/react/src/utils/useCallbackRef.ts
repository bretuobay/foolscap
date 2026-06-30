import { useCallback, useLayoutEffect, useRef } from 'react'

export function useCallbackRef<T extends (...args: never[]) => unknown>(
  fn: T | undefined,
): T {
  const ref = useRef(fn)
  useLayoutEffect(() => {
    ref.current = fn
  })
  return useCallback((...args: never[]) => ref.current?.(...args), []) as T
}
