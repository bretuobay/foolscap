const FOCUSABLE_QUERY = [
  'a[href]',
  'button:not(:disabled)',
  'input:not(:disabled)',
  'textarea:not(:disabled)',
  'select:not(:disabled)',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_QUERY))
}

export interface FocusTrap {
  activate(): void
  deactivate(): void
}

export function createFocusTrap(container: HTMLElement): FocusTrap {
  let returnFocus: Element | null = null
  let active = false

  function handleKeydown(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return
    const focusable = getFocusable(container)
    if (focusable.length === 0) {
      e.preventDefault()
      return
    }
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first || !container.contains(document.activeElement)) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last || !container.contains(document.activeElement)) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  return {
    activate() {
      if (active) return
      returnFocus = document.activeElement
      active = true
      document.addEventListener('keydown', handleKeydown)
      const focusable = getFocusable(container)
      if (focusable.length > 0) {
        focusable[0].focus()
      } else {
        if (container.tabIndex < 0) container.tabIndex = -1
        container.focus()
      }
    },
    deactivate() {
      if (!active) return
      active = false
      document.removeEventListener('keydown', handleKeydown)
      if (returnFocus instanceof HTMLElement && document.contains(returnFocus)) {
        returnFocus.focus()
      }
      returnFocus = null
    },
  }
}
