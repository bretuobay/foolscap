import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}

@Component({
  selector: 'fc-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: {
    class: 'fc-separator',
    '[attr.role]': 'decorative ? "presentation" : "separator"',
    '[attr.aria-orientation]': 'decorative ? null : orientation',
    '[attr.data-orientation]': 'orientation === "vertical" ? "vertical" : null',
  },
})
export class Separator {
  @Input() orientation: NonNullable<SeparatorProps['orientation']> = 'horizontal'
  @Input() decorative = true
}
