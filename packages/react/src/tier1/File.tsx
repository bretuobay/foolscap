import React, { useId } from 'react'
import { cx } from '../utils/cx'

export interface FileProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>,
    React.RefAttributes<HTMLInputElement> {
  variant?: 'default' | 'dropzone'
  label?: React.ReactNode
  rootClassName?: string
}

export function File({ variant = 'default', label, rootClassName, className, id, ref, ...props }: FileProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div
      className={cx('fc-file', rootClassName)}
      data-variant={variant === 'default' ? undefined : variant}
    >
      {label && <label htmlFor={inputId}>{label}</label>}
      <input {...props} id={inputId} ref={ref} type="file" className={cx('fc-file__input', className)} />
    </div>
  )
}
