import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface EmptyStateProps {
  title?: string
  description?: string
}

@Component({
  selector: 'fc-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fc-empty-state__icon">
      <ng-content select="[fcIcon]" />
    </div>
    @if (title) {
      <div class="fc-empty-state__title">{{ title }}</div>
    }
    @if (description) {
      <div class="fc-empty-state__description">{{ description }}</div>
    }
    <ng-content />
    <div class="fc-empty-state__action">
      <ng-content select="[fcAction]" />
    </div>
  `,
  host: {
    class: 'fc-empty-state',
  },
})
export class EmptyState {
  @Input() title?: string
  @Input() description?: string
}
