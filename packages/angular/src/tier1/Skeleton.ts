import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface SkeletonProps {
  variant?: 'block' | 'text' | 'circle'
}

@Component({
  selector: 'fc-skeleton, span[fc-skeleton]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: {
    class: 'fc-skeleton',
    '[attr.aria-hidden]': '"true"',
    '[attr.data-variant]': 'variant === "block" ? null : variant',
  },
})
export class Skeleton {
  @Input() variant: NonNullable<SkeletonProps['variant']> = 'block'
}
