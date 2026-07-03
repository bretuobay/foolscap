import React from 'react'
import { cx } from '../utils/cx'

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement>, React.RefAttributes<HTMLSpanElement> {
  src?: string
  alt?: string
  fallback?: React.ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export function Avatar({
  src,
  alt = '',
  fallback,
  size = 'md',
  className,
  children,
  ref,
  ...props
}: AvatarProps) {
  return (
    <span {...props} ref={ref} data-size={size} className={cx('fc-avatar', className)}>
      {src && <img src={src} alt={alt} />}
      {fallback ?? children}
    </span>
  )
}

export interface AvatarGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    React.RefAttributes<HTMLDivElement> {}

export function AvatarGroup({ className, ref, ...props }: AvatarGroupProps) {
  return <div {...props} ref={ref} className={cx('fc-avatar-group', className)} />
}
