import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface ListProps {
  variant?: 'bulleted' | 'numbered' | 'plain'
}

@Component({
  selector: 'ul[fc-list], ol[fc-list]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-list',
    '[attr.data-variant]': 'variant',
  },
})
export class List {
  @Input() variant: NonNullable<ListProps['variant']> = 'bulleted'
}
