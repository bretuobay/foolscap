import React from 'react'
import { cx } from '../utils/cx'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    React.RefAttributes<HTMLHeadingElement> {
  level?: HeadingLevel
}

export function Heading({ level = 2, className, ref, ...props }: HeadingProps) {
  const Component = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  return <Component {...props} ref={ref} data-level={level} className={cx('fc-heading', className)} />
}
