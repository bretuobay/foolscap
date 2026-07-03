import { createStore } from '@web-loom/store-core'
import { dispatch } from '../utils/events'
import { createId } from '../utils/id'

export interface StepperOptions {
  min?: number
  max?: number
  step?: number
  largeStep?: number
  defaultValue?: number
  value?: number
  name?: string
  disabled?: boolean
  editable?: boolean
  formatValue?: (value: number) => string
  onValueChange?: (value: number, prevValue: number) => void
}

export interface StepperState {
  value: number
  isAtMin: boolean
  isAtMax: boolean
  isDisabled: boolean
}

interface StepperStoreState {
  value: number
  editingValue: string | null
}

export interface Stepper {
  readonly state: StepperState
  setRootEl(el: HTMLElement | null): void
  increment(multiplier?: number): void
  decrement(multiplier?: number): void
  setValue(value: number): void
  getRootProps(): {
    role: 'group'
    'aria-labelledby': string
    'data-state': 'disabled' | 'at-min' | 'at-max' | undefined
  }
  getLabelProps(): {
    id: string
    htmlFor: string
  }
  getDecrementProps(): {
    type: 'button'
    'aria-label': string
    'aria-controls': string
    'aria-disabled': true | undefined
    disabled: boolean
    onClick(): void
    onPointerDown(): void
    onPointerUp(): void
    onPointerCancel(): void
    onKeyUp(): void
  }
  getInputProps(): {
    id: string
    role: 'spinbutton'
    tabIndex: 0 | -1
    'aria-labelledby': string
    'aria-valuemin': number | undefined
    'aria-valuemax': number | undefined
    'aria-valuenow': number
    'aria-valuetext': string
    'aria-disabled': true | undefined
    contentEditable: boolean | undefined
    suppressContentEditableWarning: boolean | undefined
    children: string
    onKeyDown(e: KeyboardEvent): void
    onInput(text: string): void
    onBlur(text: string): void
  }
  getIncrementProps(): {
    type: 'button'
    'aria-label': string
    'aria-controls': string
    'aria-disabled': true | undefined
    disabled: boolean
    onClick(): void
    onPointerDown(): void
    onPointerUp(): void
    onPointerCancel(): void
    onKeyUp(): void
  }
  getHiddenInputProps(): {
    type: 'hidden'
    name: string | undefined
    value: string
  }
  subscribe(listener: (s: StepperStoreState, prev: StepperStoreState) => void): () => void
  destroy(): void
}

function decimalPlaces(value: number): number {
  const [, decimals = ''] = String(value).split('.')
  return decimals.length
}

function roundToStepPrecision(value: number, step: number): number {
  const precision = Math.min(Math.max(decimalPlaces(step), 0), 12)
  return Number(value.toFixed(precision))
}

function normalizeStep(step: number | undefined): number {
  return step && Number.isFinite(step) && step > 0 ? step : 1
}

function clamp(value: number, min: number, max: number): number {
  const lower = Math.max(value, min)
  return Number.isFinite(max) ? Math.min(lower, max) : lower
}

function snap(value: number, min: number, max: number, step: number): number {
  const snapped = min + Math.round((value - min) / step) * step
  return roundToStepPrecision(clamp(snapped, min, max), step)
}

function parseNumericValue(value: string): number | null {
  const normalized = value.trim()
  if (normalized === '') return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

export function createStepper(opts: StepperOptions = {}): Stepper {
  const id = createId('fc-stepper')
  const min = opts.min ?? 0
  const max = opts.max ?? Number.POSITIVE_INFINITY
  const step = normalizeStep(opts.step)
  const largeStep = opts.largeStep ?? step * 10
  const isControlled = opts.value !== undefined

  const store = createStore(
    {
      value: snap(opts.value ?? opts.defaultValue ?? min, min, max, step),
      editingValue: null,
    } as StepperStoreState,
    (set) => ({
      setValue(value: number) {
        if (!isControlled) set((s) => ({ ...s, value: snap(value, min, max, step), editingValue: null }))
      },
      setEditingValue(value: string | null) {
        set((s) => ({ ...s, editingValue: value }))
      },
    })
  )

  let rootEl: HTMLElement | null = null
  let repeatDelay: ReturnType<typeof setTimeout> | null = null
  let repeatInterval: ReturnType<typeof setInterval> | null = null

  function currentValue(): number {
    return snap(isControlled ? (opts.value ?? min) : store.getState().value, min, max, step)
  }

  function formattedValue(): string {
    return opts.formatValue?.(currentValue()) ?? String(currentValue())
  }

  function isDisabled(): boolean {
    return opts.disabled ?? false
  }

  function isAtMin(): boolean {
    return currentValue() <= min
  }

  function isAtMax(): boolean {
    return Number.isFinite(max) && currentValue() >= max
  }

  function stopRepeat(): void {
    if (repeatDelay) clearTimeout(repeatDelay)
    if (repeatInterval) clearInterval(repeatInterval)
    repeatDelay = null
    repeatInterval = null
  }

  function startRepeat(action: () => void): void {
    if (isDisabled()) return
    stopRepeat()
    repeatDelay = setTimeout(() => {
      repeatInterval = setInterval(action, 16)
    }, 500)
  }

  function commit(nextValue: number): void {
    if (isDisabled()) return
    const prevValue = currentValue()
    const value = snap(nextValue, min, max, step)
    if (value === prevValue) return
    store.actions.setValue(value)
    opts.onValueChange?.(value, prevValue)
    dispatch(rootEl, 'change', { value, prevValue })
  }

  const instance: Stepper = {
    get state() {
      return {
        value: currentValue(),
        isAtMin: isAtMin(),
        isAtMax: isAtMax(),
        isDisabled: isDisabled(),
      }
    },

    setRootEl(el) {
      rootEl = el
    },

    increment(multiplier = 1) {
      commit(currentValue() + step * multiplier)
    },

    decrement(multiplier = 1) {
      commit(currentValue() - step * multiplier)
    },

    setValue(value) {
      commit(value)
    },

    getRootProps() {
      const state = isDisabled() ? 'disabled' : isAtMin() ? 'at-min' : isAtMax() ? 'at-max' : undefined
      return {
        role: 'group',
        'aria-labelledby': `${id}-label`,
        'data-state': state,
      }
    },

    getLabelProps() {
      return {
        id: `${id}-label`,
        htmlFor: `${id}-input`,
      }
    },

    getDecrementProps() {
      const disabled = isDisabled() || isAtMin()
      return {
        type: 'button',
        'aria-label': 'Decrease',
        'aria-controls': `${id}-input`,
        'aria-disabled': disabled ? true : undefined,
        disabled,
        onClick() {
          instance.decrement()
        },
        onPointerDown() {
          startRepeat(() => instance.decrement())
        },
        onPointerUp: stopRepeat,
        onPointerCancel: stopRepeat,
        onKeyUp: stopRepeat,
      }
    },

    getInputProps() {
      const editingValue = store.getState().editingValue
      const editable = opts.editable && !isDisabled()
      return {
        id: `${id}-input`,
        role: 'spinbutton',
        tabIndex: isDisabled() ? -1 : 0,
        'aria-labelledby': `${id}-label`,
        'aria-valuemin': Number.isFinite(min) ? min : undefined,
        'aria-valuemax': Number.isFinite(max) ? max : undefined,
        'aria-valuenow': currentValue(),
        'aria-valuetext': formattedValue(),
        'aria-disabled': isDisabled() ? true : undefined,
        contentEditable: editable ? true : undefined,
        suppressContentEditableWarning: editable ? true : undefined,
        children: editingValue ?? formattedValue(),
        onKeyDown(e) {
          if (isDisabled()) return
          switch (e.key) {
            case 'ArrowUp':
              e.preventDefault()
              instance.increment()
              break
            case 'ArrowDown':
              e.preventDefault()
              instance.decrement()
              break
            case 'PageUp':
              e.preventDefault()
              commit(currentValue() + largeStep)
              break
            case 'PageDown':
              e.preventDefault()
              commit(currentValue() - largeStep)
              break
            case 'Home':
              e.preventDefault()
              commit(min)
              break
            case 'End':
              e.preventDefault()
              if (Number.isFinite(max)) commit(max)
              break
          }
        },
        onInput(text) {
          if (!editable) return
          const sanitized = text.replace(/[^\d.+-]/g, '')
          store.actions.setEditingValue(sanitized)
        },
        onBlur(text) {
          if (!editable) return
          const parsed = parseNumericValue(text)
          store.actions.setEditingValue(null)
          if (parsed !== null) commit(parsed)
        },
      }
    },

    getIncrementProps() {
      const disabled = isDisabled() || isAtMax()
      return {
        type: 'button',
        'aria-label': 'Increase',
        'aria-controls': `${id}-input`,
        'aria-disabled': disabled ? true : undefined,
        disabled,
        onClick() {
          instance.increment()
        },
        onPointerDown() {
          startRepeat(() => instance.increment())
        },
        onPointerUp: stopRepeat,
        onPointerCancel: stopRepeat,
        onKeyUp: stopRepeat,
      }
    },

    getHiddenInputProps() {
      return {
        type: 'hidden',
        name: opts.name,
        value: String(currentValue()),
      }
    },

    subscribe: store.subscribe.bind(store),

    destroy() {
      stopRepeat()
      store.destroy()
    },
  }

  return instance
}
