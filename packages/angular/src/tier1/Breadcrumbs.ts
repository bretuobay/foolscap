import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface BreadcrumbsProps {
  label?: string
}

@Component({
  selector: 'fc-breadcrumbs, nav[fc-breadcrumbs]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ol class="fc-breadcrumbs">
      <ng-content />
    </ol>
  `,
  host: {
    '[attr.aria-label]': 'label',
  },
})
export class Breadcrumbs {
  @Input() label = 'Breadcrumb'
}

@Component({
  selector: 'fc-breadcrumb-item, li[fc-breadcrumb-item]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
})
export class BreadcrumbItem {}
