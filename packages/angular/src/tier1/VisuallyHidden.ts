import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'fc-visually-hidden, span[fc-visually-hidden]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-visually-hidden',
  },
})
export class VisuallyHidden {}
