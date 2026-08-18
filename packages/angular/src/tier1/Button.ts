import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
}

@Component({
  selector: 'button[fc-button]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="fc-button__icon-start" aria-hidden="true">
      <ng-content select="[fcIconStart]" />
    </span>
    <span class="fc-button__label">
      <ng-content />
    </span>
    <span class="fc-button__icon-end" aria-hidden="true">
      <ng-content select="[fcIconEnd]" />
    </span>
  `,
  host: {
    class: 'fc-button',
    '[attr.type]': 'type',
    '[attr.data-variant]': 'variant',
    '[attr.data-size]': 'size',
    '[attr.data-state]': 'loading ? "loading" : null',
    '[attr.aria-disabled]': 'loading || disabled ? true : null',
    '[disabled]': 'disabled',
  },
})
export class Button {
  @Input() variant: NonNullable<ButtonProps['variant']> = 'primary'
  @Input() size: NonNullable<ButtonProps['size']> = 'md'
  @Input() loading = false
  @Input() disabled = false
  @Input() type: 'button' | 'submit' | 'reset' = 'button'
}
