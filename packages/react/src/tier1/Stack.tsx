import React from 'react'
import { cx } from '../utils/cx'

export interface StackProps extends React.HTMLAttributes<HTMLDivElement>, React.RefAttributes<HTMLDivElement> {
  gap?: '1' | '2' | '3' | '4' | '6' | '8' | '12'
  align?: 'start' | 'center' | 'end' | 'stretch'
}

export function Stack({ gap = '4', align, className, ref, ...props }: StackProps) {
  return <div {...props} ref={ref} data-gap={gap} data-align={align} className={cx('fc-stack', className)} />
}
