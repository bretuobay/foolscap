import { createStore } from '@web-loom/store-core'
import { dispatch } from '../utils/events'
import { createId } from '../utils/id'
import { getNextIndex, getPrevIndex } from '../utils/keyboard'

export interface ProgressIndicatorStep {
  label: string
  description?: string
}

export type ProgressIndicatorOrientation = 'horizontal' | 'vertical'
export type ProgressIndicatorStepState = 'complete' | 'current' | 'upcoming'
export type ProgressIndicatorDirection = 'forward' | 'back'

export interface ProgressIndicatorOptions {
  steps: ProgressIndicatorStep[]
  defaultStep?: number
  step?: number
  linear?: boolean
  orientation?: ProgressIndicatorOrientation
  onStepChange?: (step: number, prevStep: number, direction: ProgressIndicatorDirection) => void
}

export interface ProgressIndicatorState {
  currentStep: number
  completedSteps: Set<number>
  totalSteps: number
  isFirst: boolean
  isLast: boolean
}

interface ProgressIndicatorStoreState {
  currentStep: number
}

export interface ProgressIndicator {
  readonly state: ProgressIndicatorState
  setRootEl(el: HTMLElement | null): void
  setStepIndicatorEl(index: number, el: HTMLElement | null): void
  next(): void
  prev(): void
  goTo(index: number): void
  getRootProps(): {
    'aria-label': string
    'data-orientation': ProgressIndicatorOrientation
    'data-linear': 'true' | 'false'
  }
  getStepProps(index: number): {
    id: string
    'data-state': ProgressIndicatorStepState
    'aria-current': 'step' | undefined
  }
  getStepIndicatorProps(index: number): {
    role: 'button' | undefined
    tabIndex: 0 | -1 | undefined
    'aria-label': string
    'aria-disabled': true | undefined
    'data-disabled': '' | undefined
    onClick(): void
    onKeyDown(e: KeyboardEvent): void
  }
  getStepLabelProps(index: number): {
    id: string
  }
  getStepDescriptionProps(index: number): {
    id: string
  }
  getStepSrStatusProps(index: number): {
    children: string
  }
  subscribe(listener: (s: ProgressIndicatorStoreState, prev: ProgressIndicatorStoreState) => void): () => void
  destroy(): void
}

function clampStep(index: number, total: number): number {
  if (total <= 0) return 0
  return Math.min(Math.max(Math.round(index), 0), total - 1)
}

function completedSteps(currentStep: number): Set<number> {
  return new Set(Array.from({ length: currentStep }, (_, index) => index))
}

function stepState(index: number, currentStep: number): ProgressIndicatorStepState {
  if (index < currentStep) return 'complete'
  if (index === currentStep) return 'current'
  return 'upcoming'
}

function statusText(state: ProgressIndicatorStepState): string {
  if (state === 'complete') return 'Completed'
  if (state === 'current') return 'Current step'
  return 'Upcoming'
}

export function createProgressIndicator(opts: ProgressIndicatorOptions): ProgressIndicator {
  const id = createId('fc-progress-indicator')
  const isControlled = opts.step !== undefined
  const linear = opts.linear ?? true
  const orientation = opts.orientation ?? 'horizontal'

  const store = createStore(
    {
      currentStep: clampStep(opts.step ?? opts.defaultStep ?? 0, opts.steps.length),
    } as ProgressIndicatorStoreState,
    (set) => ({
      setCurrentStep(step: number) {
        if (!isControlled) set((s) => ({ ...s, currentStep: clampStep(step, opts.steps.length) }))
      },
    })
  )

  let rootEl: HTMLElement | null = null
  const indicatorEls = new Map<number, HTMLElement>()

  function currentStep(): number {
    return clampStep(isControlled ? (opts.step ?? 0) : store.getState().currentStep, opts.steps.length)
  }

  function totalSteps(): number {
    return opts.steps.length
  }

  function isStepIndex(index: number): boolean {
    return index >= 0 && index < totalSteps()
  }

  function canNavigateFromIndicator(index: number): boolean {
    if (!isStepIndex(index)) return false
    return linear ? index <= currentStep() : true
  }

  function transitionTo(index: number): void {
    if (!isStepIndex(index)) return
    const prevStep = currentStep()
    const nextStep = clampStep(index, totalSteps())
    if (nextStep === prevStep) return
    const direction: ProgressIndicatorDirection = nextStep > prevStep ? 'forward' : 'back'
    store.actions.setCurrentStep(nextStep)
    opts.onStepChange?.(nextStep, prevStep, direction)
    dispatch(rootEl, 'step-change', { step: nextStep, prevStep, direction })
  }

  function focusStep(index: number): void {
    indicatorEls.get(index)?.focus()
  }

  function navigableIndexes(): number[] {
    return opts.steps.map((_, index) => index).filter(canNavigateFromIndicator)
  }

  function moveFocus(fromIndex: number, delta: 1 | -1): void {
    const indexes = navigableIndexes()
    if (indexes.length === 0) return
    const currentIndex = indexes.indexOf(fromIndex)
    const nextPosition =
      delta === 1
        ? getNextIndex(currentIndex, indexes.length, true)
        : getPrevIndex(currentIndex, indexes.length, true)
    focusStep(indexes[nextPosition])
  }

  const instance: ProgressIndicator = {
    get state() {
      const step = currentStep()
      const total = totalSteps()
      return {
        currentStep: step,
        completedSteps: completedSteps(step),
        totalSteps: total,
        isFirst: step === 0,
        isLast: total === 0 || step === total - 1,
      }
    },

    setRootEl(el) {
      rootEl = el
    },

    setStepIndicatorEl(index, el) {
      if (el) indicatorEls.set(index, el)
      else indicatorEls.delete(index)
    },

    next() {
      transitionTo(currentStep() + 1)
    },

    prev() {
      transitionTo(currentStep() - 1)
    },

    goTo(index) {
      if (!canNavigateFromIndicator(index)) return
      transitionTo(index)
    },

    getRootProps() {
      return {
        'aria-label': 'Progress',
        'data-orientation': orientation,
        'data-linear': linear ? 'true' : 'false',
      }
    },

    getStepProps(index) {
      const state = stepState(index, currentStep())
      return {
        id: `${id}-step-${index}`,
        'data-state': state,
        'aria-current': state === 'current' ? 'step' : undefined,
      }
    },

    getStepIndicatorProps(index) {
      const step = opts.steps[index]
      const state = stepState(index, currentStep())
      const navigable = canNavigateFromIndicator(index)
      return {
        role: navigable ? 'button' : undefined,
        tabIndex: navigable ? 0 : -1,
        'aria-label': step ? `${step.label}, ${statusText(state)}` : `Step ${index + 1}`,
        'aria-disabled': navigable ? undefined : true,
        'data-disabled': navigable ? undefined : '',
        onClick() {
          instance.goTo(index)
        },
        onKeyDown(e) {
          if (!navigable) return
          switch (e.key) {
            case 'Enter':
            case ' ':
              e.preventDefault()
              instance.goTo(index)
              break
            case 'ArrowRight':
            case 'ArrowDown':
              e.preventDefault()
              moveFocus(index, 1)
              break
            case 'ArrowLeft':
            case 'ArrowUp':
              e.preventDefault()
              moveFocus(index, -1)
              break
          }
        },
      }
    },

    getStepLabelProps(index) {
      return { id: `${id}-step-${index}-label` }
    },

    getStepDescriptionProps(index) {
      return { id: `${id}-step-${index}-description` }
    },

    getStepSrStatusProps(index) {
      return { children: statusText(stepState(index, currentStep())) }
    },

    subscribe: store.subscribe.bind(store),

    destroy() {
      indicatorEls.clear()
      store.destroy()
    },
  }

  return instance
}
