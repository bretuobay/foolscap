import React from 'react'
import { cx } from '../utils/cx'

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement>, React.RefAttributes<HTMLImageElement> {
  variant?: 'default' | 'rounded' | 'circle' | 'bordered' | 'shadow'
}

export function Image({ variant = 'default', className, ref, ...props }: ImageProps) {
  return (
    <img
      {...props}
      ref={ref}
      data-variant={variant === 'default' ? undefined : variant}
      className={cx('fc-image', className)}
    />
  )
}
