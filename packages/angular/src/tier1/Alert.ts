import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error'
  live?: 'assertive' | 'polite'
  title?: string
  description?: string
  dismissLabel?: string
}

@Component({
  selector: 'fc-alert',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="fc-alert__icon" aria-hidden="true">
      <ng-content select="[fcIcon]" />
    </span>
    <div class="fc-alert__body">
      @if (title) {
        <p class="fc-alert__title">{{ title }}</p>
      }
      @if (description) {
        <p class="fc-alert__description">{{ description }}</p>
      }
      <ng-content />
    </div>
    @if (dismiss.observed) {
      <button
        class="fc-alert__dismiss"
        type="button"
        [attr.aria-label]="dismissLabel"
        (click)="dismiss.emit()"
      >
        x
      </button>
    }
  `,
  host: {
    class: 'fc-alert',
    '[attr.role]': 'live === "polite" ? "status" : "alert"',
    '[attr.data-variant]': 'variant',
    '[attr.data-live]': 'live',
  },
})
export class Alert {
  @Input() variant: NonNullable<AlertProps['variant']> = 'info'
  @Input() live: NonNullable<AlertProps['live']> = 'assertive'
  @Input() title?: string
  @Input() description?: string
  @Input() dismissLabel = 'Dismiss alert'
  @Output() dismiss = new EventEmitter<void>()
}
