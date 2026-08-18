import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'a[fc-link]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-link',
  },
})
export class Link {}
