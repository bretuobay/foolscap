import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface VideoProps {
  variant?: 'default' | 'bordered'
}

@Component({
  selector: 'video[fc-video]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-video',
    '[attr.data-variant]': 'variant === "default" ? null : variant',
  },
})
export class Video {
  @Input() variant: NonNullable<VideoProps['variant']> = 'default'
}

@Component({
  selector: 'fc-video-embed',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-video-embed',
  },
})
export class VideoEmbed {}
