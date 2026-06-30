/** Renders an HTML string into document.body and returns cleanup. NOT exported from index.ts. */
export function fixture(html: string): { container: HTMLElement; cleanup: () => void } {
  const container = document.createElement('div')
  container.innerHTML = html
  document.body.appendChild(container)
  return {
    container,
    cleanup() {
      document.body.removeChild(container)
    },
  }
}

/** Fires a KeyboardEvent on the target element. */
export function press(target: Element, key: string, options?: KeyboardEventInit): void {
  target.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...options })
  )
}
