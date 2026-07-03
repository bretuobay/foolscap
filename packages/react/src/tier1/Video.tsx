import React from 'react'
import { cx } from '../utils/cx'

export interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement>, React.RefAttributes<HTMLVideoElement> {
  variant?: 'default' | 'bordered'
}

export function Video({ variant = 'default', className, ref, ...props }: VideoProps) {
  return (
    <video
      {...props}
      ref={ref}
      data-variant={variant === 'default' ? undefined : variant}
      className={cx('fc-video', className)}
    />
  )
}

export interface VideoEmbedProps extends React.HTMLAttributes<HTMLDivElement>, React.RefAttributes<HTMLDivElement> {}

export function VideoEmbed({ className, ref, ...props }: VideoEmbedProps) {
  return <div {...props} ref={ref} className={cx('fc-video-embed', className)} />
}
