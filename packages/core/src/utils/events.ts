export function dispatch<T extends Record<string, unknown>>(
  element: Element | null | undefined,
  name: string,
  detail: T
): void {
  if (!element) return
  element.dispatchEvent(new CustomEvent(`fc:${name}`, { bubbles: true, composed: true, detail }))
}
