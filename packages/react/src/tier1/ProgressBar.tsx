import React from 'react'
import { cx } from '../utils/cx'

export interface ProgressBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    React.RefAttributes<HTMLDivElement> {
  value?: number
  min?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  label: string
}

export function ProgressBar({
  value,
  min = 0,
  max = 100,
  size = 'md',
  label,
  className,
  ref,
  style,
  ...props
}: ProgressBarProps) {
  const isIndeterminate = value == null
  const clampedValue = isIndeterminate ? undefined : Math.min(Math.max(value, min), max)
  const percent = clampedValue == null ? 0 : ((clampedValue - min) / (max - min)) * 100
  const progressStyle = {
    ...style,
    '--fc-progress-value': `${percent}%`,
  } as React.CSSProperties

  return (
    <div
      {...props}
      ref={ref}
      role="progressbar"
      aria-label={label}
      aria-valuemin={isIndeterminate ? undefined : min}
      aria-valuemax={isIndeterminate ? undefined : max}
      aria-valuenow={clampedValue}
      data-size={size}
      data-state={isIndeterminate ? 'indeterminate' : undefined}
      style={progressStyle}
      className={cx('fc-progress-bar', className)}
    >
      <div className="fc-progress-bar__fill" />
    </div>
  )
}
