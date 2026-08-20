import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

@Component({
  selector: 'fc-avatar, span[fc-avatar]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (src) {
      <img [src]="src" [alt]="alt" />
    }
    {{ fallback }}
    <ng-content />
  `,
  host: {
    class: 'fc-avatar',
    '[attr.data-size]': 'size',
  },
})
export class Avatar {
  @Input() src?: string
  @Input() alt = ''
  @Input() fallback?: string
  @Input() size: NonNullable<AvatarProps['size']> = 'md'
}

@Component({
  selector: 'fc-avatar-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-avatar-group',
  },
})
export class AvatarGroup {}
