import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { nextId } from '../utils/ids'

export interface ColorPickerProps {
  label?: string
  rootClassName?: string
  showValue?: boolean
  defaultValue?: string
  value?: string
}

@Component({
  selector: 'fc-color-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (label) {
      <label class="fc-color-picker__label" [attr.for]="inputId">{{ label }}</label>
    }
    <span class="fc-color-picker__swatch" [style.backgroundColor]="displayValue">
      <input
        type="color"
        class="fc-color-picker__input"
        [id]="inputId"
        [value]="displayValue"
        (change)="onChange($event)"
      />
    </span>
    @if (showValue) {
      <span class="fc-color-picker__value">{{ displayValue }}</span>
    }
  `,
  host: {
    class: 'fc-color-picker',
  },
})
export class ColorPicker {
  @Input() label?: string
  @Input() rootClassName?: string
  @Input() showValue = true
  @Input() defaultValue = '#000000'
  @Input() value?: string
  @Input() id?: string
  @Output() valueChange = new EventEmitter<string>()

  private uncontrolled?: string
  readonly generatedId = nextId('fc-color')

  get inputId(): string {
    return this.id ?? this.generatedId
  }

  get displayValue(): string {
    return this.value ?? this.uncontrolled ?? this.defaultValue
  }

  onChange(event: Event): void {
    const next = (event.target as HTMLInputElement).value
    if (this.value === undefined) this.uncontrolled = next
    this.valueChange.emit(next)
  }
}
