import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface BadgeProps {
  variant?: 'default' | 'outline' | 'subtle'
}

@Component({
  selector: 'fc-badge, span[fc-badge]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-badge',
    '[attr.data-variant]': 'variant === "default" ? null : variant',
  },
})
export class Badge {
  @Input() variant: NonNullable<BadgeProps['variant']> = 'default'
}
