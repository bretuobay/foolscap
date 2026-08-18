import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface TableProps {
  variant?: 'default' | 'striped' | 'bordered'
}

@Component({
  selector: 'table[fc-table]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-table',
    '[attr.data-variant]': 'variant === "default" ? null : variant',
  },
})
export class Table {
  @Input() variant: NonNullable<TableProps['variant']> = 'default'
}
