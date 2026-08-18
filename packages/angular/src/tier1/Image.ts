import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface ImageProps {
  variant?: 'default' | 'rounded' | 'circle' | 'bordered' | 'shadow'
}

@Component({
  selector: 'img[fc-image]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: {
    class: 'fc-image',
    '[attr.data-variant]': 'variant === "default" ? null : variant',
  },
})
export class Image {
  @Input() variant: NonNullable<ImageProps['variant']> = 'default'
}
