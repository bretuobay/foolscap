import React from 'react'
import { cx } from '../utils/cx'

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    React.RefAttributes<HTMLInputElement> {
  size?: 'sm' | 'md' | 'lg'
  invalid?: boolean
}

export function TextInput({ size = 'md', invalid, className, ref, ...props }: TextInputProps) {
  return (
    <input
      {...props}
      ref={ref}
      aria-invalid={invalid ? 'true' : props['aria-invalid']}
      data-size={size === 'md' ? undefined : size}
      data-state={invalid ? 'error' : undefined}
      className={cx('fc-text-input', className)}
    />
  )
}
