import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'a[fc-skip-link]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-skip-link',
  },
})
export class SkipLink {}
