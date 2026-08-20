import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

@Component({
  selector: 'fc-spinner, span[fc-spinner]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: {
    class: 'fc-spinner',
    role: 'status',
    '[attr.data-size]': 'size',
    '[attr.aria-label]': 'label',
  },
})
export class Spinner {
  @Input() size: NonNullable<SpinnerProps['size']> = 'md'
  @Input() label = 'Loading'
}
