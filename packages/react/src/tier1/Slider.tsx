import React from 'react'
import { cx } from '../utils/cx'

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>,
    React.RefAttributes<HTMLInputElement> {}

export function Slider({ className, ref, ...props }: SliderProps) {
  return <input {...props} ref={ref} type="range" className={cx('fc-slider', className)} />
}
