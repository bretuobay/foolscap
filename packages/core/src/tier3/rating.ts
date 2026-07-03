import { createStore } from '@web-loom/store-core'
import { dispatch } from '../utils/events'
import { createId } from '../utils/id'

export interface RatingOptions {
  max?: number
  defaultValue?: number
  value?: number
  readOnly?: boolean
  disabled?: boolean
  name?: string
  onValueChange?: (value: number) => void
  onHoverChange?: (value: number | null) => void
}

export interface RatingState {
  selectedValue: number
  hoveredValue: number | null
  isReadOnly: boolean
  max: number
}

export interface Rating {
  readonly state: RatingState
  setRootEl(el: HTMLElement | null): void
  setValue(value: number): void
  setHoveredValue(value: number | null): void
  getRootProps(): {
    role: 'radiogroup' | 'img'
    'aria-label': string
    'aria-required': false | undefined
    'data-state': 'read-only' | 'disabled' | undefined
    onMouseLeave(): void
  }
  getItemProps(value: number): {
    'data-state': 'active' | 'hovered' | undefined
    onMouseEnter(): void
  }
  getInputProps(value: number): {
    type: 'radio'
    name: string
    value: string
    checked: boolean
    disabled: boolean
    'aria-label': string
    onChange(): void
    onKeyDown(e: KeyboardEvent): void
  }
  getIconProps(value: number): {
    'aria-hidden': true
  }
  getValueLabelProps(): {
    'aria-live': 'polite'
  }
  subscribe(listener: (s: RatingState, prev: RatingState) => void): () => void
  destroy(): void
}

function clamp(value: number, max: number): number {
  return Math.min(Math.max(Math.round(value), 0), max)
}

function starLabel(value: number): string {
  return `${value} ${value === 1 ? 'star' : 'stars'}`
}

function ratingLabel(value: number, max: number): string {
  return `Rating: ${value} out of ${max} ${max === 1 ? 'star' : 'stars'}`
}

export function createRating(opts: RatingOptions = {}): Rating {
  const id = createId('fc-rating')
  const max = Math.max(Math.round(opts.max ?? 5), 1)
  const isControlled = opts.value !== undefined
  const readOnly = opts.readOnly ?? false
  const disabled = opts.disabled ?? false

  const store = createStore(
    {
      selectedValue: clamp(opts.value ?? opts.defaultValue ?? 0, max),
      hoveredValue: null,
      isReadOnly: readOnly,
      max,
    } as RatingState,
    (set) => ({
      setSelectedValue(value: number) {
        if (!isControlled) set((s) => ({ ...s, selectedValue: clamp(value, max) }))
      },
      setHoveredValue(value: number | null) {
        set((s) => ({ ...s, hoveredValue: value === null ? null : clamp(value, max) }))
      },
    })
  )

  let rootEl: HTMLElement | null = null

  function selectedValue(): number {
    return isControlled ? clamp(opts.value ?? 0, max) : store.getState().selectedValue
  }

  function previewValue(): number {
    return store.getState().hoveredValue ?? selectedValue()
  }

  const instance: Rating = {
    get state() {
      return { ...store.getState(), selectedValue: selectedValue(), isReadOnly: readOnly, max }
    },

    setRootEl(el) {
      rootEl = el
    },

    setValue(value) {
      if (readOnly || disabled) return
      const next = clamp(value, max)
      if (next === selectedValue()) return
      store.actions.setSelectedValue(next)
      dispatch(rootEl, 'change', { value: next })
      opts.onValueChange?.(next)
    },

    setHoveredValue(value) {
      if (readOnly || disabled) return
      const next = value === null ? null : clamp(value, max)
      store.actions.setHoveredValue(next)
      dispatch(rootEl, 'hover', { value: next })
      opts.onHoverChange?.(next)
    },

    getRootProps() {
      if (readOnly) {
        return {
          role: 'img',
          'aria-label': ratingLabel(selectedValue(), max),
          'aria-required': undefined,
          'data-state': 'read-only',
          onMouseLeave() {},
        }
      }

      return {
        role: 'radiogroup',
        'aria-label': 'Rating',
        'aria-required': false,
        'data-state': disabled ? 'disabled' : undefined,
        onMouseLeave() {
          instance.setHoveredValue(null)
        },
      }
    },

    getItemProps(value) {
      const preview = previewValue()
      const active = value <= preview
      const hovered = store.getState().hoveredValue !== null && active
      return {
        'data-state': hovered ? 'hovered' : active ? 'active' : undefined,
        onMouseEnter() {
          instance.setHoveredValue(value)
        },
      }
    },

    getInputProps(value) {
      return {
        type: 'radio',
        name: opts.name ?? id,
        value: String(value),
        checked: selectedValue() === value,
        disabled: disabled || readOnly,
        'aria-label': starLabel(value),
        onChange() {
          instance.setValue(value)
        },
        onKeyDown(e) {
          switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
              e.preventDefault()
              instance.setValue(Math.min(selectedValue() + 1, max))
              break
            case 'ArrowLeft':
            case 'ArrowUp':
              e.preventDefault()
              instance.setValue(Math.max(selectedValue() - 1, 1))
              break
          }
        },
      }
    },

    getIconProps() {
      return { 'aria-hidden': true }
    },

    getValueLabelProps() {
      return { 'aria-live': 'polite' }
    },

    subscribe: store.subscribe.bind(store),

    destroy() {
      store.destroy()
    },
  }

  return instance
}

export const ratingUtils = {
  ratingLabel,
  starLabel,
}
