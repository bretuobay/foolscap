import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface LabelProps {
  required?: boolean
}

@Component({
  selector: 'label[fc-label]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-label',
    '[attr.data-required]': 'required ? "true" : null',
  },
})
export class Label {
  @Input() required = false
}
