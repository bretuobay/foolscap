export function injectStableCallback<T extends (...args: never[]) => unknown>(
  getFn: () => T | undefined,
): T {
  return ((...args: never[]) => getFn()?.(...args)) as T
}
