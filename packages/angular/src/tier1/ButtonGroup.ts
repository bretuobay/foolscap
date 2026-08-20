import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface ButtonGroupProps {
  orientation?: 'horizontal' | 'vertical'
}

@Component({
  selector: 'fc-button-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-button-group',
    '[attr.role]': '"group"',
    '[attr.data-orientation]': 'orientation === "vertical" ? "vertical" : null',
  },
})
export class ButtonGroup {
  @Input() orientation: NonNullable<ButtonGroupProps['orientation']> = 'horizontal'
}
