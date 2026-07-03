import React, { createContext, useCallback, useContext, useRef } from 'react'
import {
  createProgressIndicator,
  type ProgressIndicator as ProgressIndicatorMachine,
  type ProgressIndicatorOrientation,
  type ProgressIndicatorStep,
} from '@web-loom/foolscap-core'
import { useMachine } from '../hooks/useMachine'
import { useCallbackRef } from '../utils/useCallbackRef'
import { cx } from '../utils/cx'

interface ProgressIndicatorContextValue {
  machine: ProgressIndicatorMachine
  steps: ProgressIndicatorStep[]
  injectRootEl: (el: HTMLOListElement | null) => void
  injectIndicatorEl: (index: number, el: HTMLDivElement | null) => void
}

const ProgressIndicatorContext = createContext<ProgressIndicatorContextValue | null>(null)

function useProgressIndicatorContext(): ProgressIndicatorContextValue {
  const ctx = useContext(ProgressIndicatorContext)
  if (!ctx) throw new Error('ProgressIndicator components must be used inside ProgressIndicatorRoot')
  return ctx
}

export type { ProgressIndicatorStep, ProgressIndicatorOrientation }

export interface ProgressIndicatorRootProps
  extends Omit<React.OlHTMLAttributes<HTMLOListElement>, 'children' | 'onChange'>,
    React.RefAttributes<HTMLOListElement> {
  steps: ProgressIndicatorStep[]
  step?: number
  defaultStep?: number
  linear?: boolean
  orientation?: ProgressIndicatorOrientation
  label?: string
  onStepChange?: (step: number, prevStep: number, direction: 'forward' | 'back') => void
  className?: string
  children?: React.ReactNode
}

export function ProgressIndicatorRoot({
  steps,
  step,
  defaultStep,
  linear = true,
  orientation = 'horizontal',
  label = 'Progress',
  onStepChange,
  className,
  children,
  ref,
  ...props
}: ProgressIndicatorRootProps) {
  const stepsRef = useRef(steps)
  stepsRef.current = steps
  const stepRef = useRef(step)
  stepRef.current = step
  const defaultStepRef = useRef(defaultStep)
  const linearRef = useRef(linear)
  linearRef.current = linear
  const orientationRef = useRef(orientation)
  orientationRef.current = orientation
  const stableOnStepChange = useCallbackRef(onStepChange)

  const machine = useMachine(() =>
    createProgressIndicator({
      get steps() {
        return stepsRef.current
      },
      get step() {
        return stepRef.current
      },
      defaultStep: defaultStepRef.current,
      get linear() {
        return linearRef.current
      },
      get orientation() {
        return orientationRef.current
      },
      onStepChange: stableOnStepChange,
    })
  )

  const injectRootEl = useCallback((el: HTMLOListElement | null) => machine.setRootEl(el), [machine])
  const injectIndicatorEl = useCallback(
    (index: number, el: HTMLDivElement | null) => machine.setStepIndicatorEl(index, el),
    [machine]
  )
  const rootProps = machine.getRootProps()

  return (
    <ProgressIndicatorContext.Provider value={{ machine, steps, injectRootEl, injectIndicatorEl }}>
      <ol
        {...props}
        aria-label={props['aria-label'] ?? label ?? rootProps['aria-label']}
        data-orientation={rootProps['data-orientation']}
        data-linear={rootProps['data-linear']}
        ref={(el) => {
          injectRootEl(el)
          if (typeof ref === 'function') ref(el)
          else if (ref) (ref as React.MutableRefObject<HTMLOListElement | null>).current = el
        }}
        className={cx('fc-progress-indicator', className)}
      >
        {children ?? steps.map((item, index) => <ProgressIndicatorStepView key={`${item.label}-${index}`} index={index} />)}
      </ol>
    </ProgressIndicatorContext.Provider>
  )
}

export interface ProgressIndicatorStepProps extends React.LiHTMLAttributes<HTMLLIElement> {
  index: number
  className?: string
}

export function ProgressIndicatorStepView({
  index,
  className,
  children,
  ...props
}: ProgressIndicatorStepProps) {
  const { machine, steps } = useProgressIndicatorContext()
  const step = steps[index]
  const stepProps = machine.getStepProps(index)

  return (
    <li
      {...props}
      id={props.id ?? stepProps.id}
      data-state={stepProps['data-state']}
      aria-current={stepProps['aria-current']}
      className={cx('fc-progress-indicator__step', className)}
    >
      {children ?? (
        <>
          <ProgressIndicatorStepIndicator index={index} />
          <span className="fc-progress-indicator__content">
            <ProgressIndicatorStepLabel index={index}>{step?.label}</ProgressIndicatorStepLabel>
            {step?.description ? (
              <ProgressIndicatorStepDescription index={index}>
                {step.description}
              </ProgressIndicatorStepDescription>
            ) : null}
          </span>
          <ProgressIndicatorStepSrStatus index={index} />
        </>
      )}
    </li>
  )
}

export interface ProgressIndicatorStepIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number
  className?: string
}

export function ProgressIndicatorStepIndicator({
  index,
  className,
  children,
  ...props
}: ProgressIndicatorStepIndicatorProps) {
  const { machine, injectIndicatorEl } = useProgressIndicatorContext()
  const indicatorProps = machine.getStepIndicatorProps(index)
  const state = machine.getStepProps(index)['data-state']

  return (
    <div
      {...props}
      role={indicatorProps.role}
      tabIndex={indicatorProps.tabIndex}
      aria-label={indicatorProps['aria-label']}
      aria-disabled={indicatorProps['aria-disabled']}
      data-disabled={indicatorProps['data-disabled']}
      onClick={indicatorProps.onClick}
      onKeyDown={(e) => indicatorProps.onKeyDown(e.nativeEvent)}
      ref={(el) => injectIndicatorEl(index, el)}
      className={cx('fc-progress-indicator__step-indicator', className)}
    >
      {children ?? (state === 'complete' ? '✓' : index + 1)}
    </div>
  )
}

export interface ProgressIndicatorStepLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  index: number
  className?: string
}

export function ProgressIndicatorStepLabel({
  index,
  className,
  ...props
}: ProgressIndicatorStepLabelProps) {
  const { machine } = useProgressIndicatorContext()
  return (
    <span
      {...props}
      id={props.id ?? machine.getStepLabelProps(index).id}
      className={cx('fc-progress-indicator__step-label', className)}
    />
  )
}

export interface ProgressIndicatorStepDescriptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  index: number
  className?: string
}

export function ProgressIndicatorStepDescription({
  index,
  className,
  ...props
}: ProgressIndicatorStepDescriptionProps) {
  const { machine } = useProgressIndicatorContext()
  return (
    <span
      {...props}
      id={props.id ?? machine.getStepDescriptionProps(index).id}
      className={cx('fc-progress-indicator__step-description', className)}
    />
  )
}

export interface ProgressIndicatorStepSrStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  index: number
  className?: string
}

export function ProgressIndicatorStepSrStatus({
  index,
  className,
  ...props
}: ProgressIndicatorStepSrStatusProps) {
  const { machine } = useProgressIndicatorContext()
  const statusProps = machine.getStepSrStatusProps(index)
  return (
    <span {...props} className={cx('fc-progress-indicator__step-sr-status', className)}>
      {props.children ?? statusProps.children}
    </span>
  )
}
