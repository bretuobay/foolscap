import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface IconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  label?: string
}

@Component({
  selector: 'fc-icon, span[fc-icon]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-icon',
    '[attr.data-size]': 'size',
    '[attr.role]': 'label ? "img" : null',
    '[attr.aria-label]': 'label',
    '[attr.aria-hidden]': 'label ? null : true',
  },
})
export class Icon {
  @Input() size: NonNullable<IconProps['size']> = 'md'
  @Input() label?: string
}
