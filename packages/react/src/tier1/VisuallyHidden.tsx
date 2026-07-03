import React from 'react'
import { cx } from '../utils/cx'

export interface VisuallyHiddenProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    React.RefAttributes<HTMLSpanElement> {}

export function VisuallyHidden({ className, ref, ...props }: VisuallyHiddenProps) {
  return <span {...props} ref={ref} className={cx('fc-visually-hidden', className)} />
}
