import React from 'react'
import { cx } from '../utils/cx'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    React.RefAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export function Textarea({ invalid, className, ref, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      ref={ref}
      aria-invalid={invalid ? 'true' : props['aria-invalid']}
      data-state={invalid ? 'error' : undefined}
      className={cx('fc-textarea', className)}
    />
  )
}
