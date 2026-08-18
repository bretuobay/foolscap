import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface ProgressBarProps {
  value?: number
  min?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  label: string
}

@Component({
  selector: 'fc-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="fc-progress-bar__fill"></div>`,
  host: {
    class: 'fc-progress-bar',
    role: 'progressbar',
    '[attr.aria-label]': 'label',
    '[attr.aria-valuemin]': 'isIndeterminate ? null : min',
    '[attr.aria-valuemax]': 'isIndeterminate ? null : max',
    '[attr.aria-valuenow]': 'clampedValue',
    '[attr.data-size]': 'size',
    '[attr.data-state]': 'isIndeterminate ? "indeterminate" : null',
    '[style.--fc-progress-value]': 'percent + "%"',
  },
})
export class ProgressBar {
  @Input() value?: number
  @Input() min = 0
  @Input() max = 100
  @Input() size: NonNullable<ProgressBarProps['size']> = 'md'
  @Input({ required: true }) label!: string

  get isIndeterminate(): boolean {
    return this.value == null
  }

  get clampedValue(): number | null {
    if (this.isIndeterminate) return null
    return Math.min(Math.max(this.value as number, this.min), this.max)
  }

  get percent(): number {
    if (this.clampedValue == null) return 0
    return ((this.clampedValue - this.min) / (this.max - this.min)) * 100
  }
}
