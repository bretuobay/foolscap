import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { nextId } from '../utils/ids'

export interface RadioButtonProps {
  label?: string
  rootClassName?: string
}

@Component({
  selector: 'fc-radio-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      type="radio"
      class="fc-radio-button__input"
      [id]="inputId"
      [class]="inputClass"
      [attr.name]="name"
      [attr.value]="value"
    />
    <span class="fc-radio-button__control" aria-hidden="true"></span>
    @if (label) {
      <label class="fc-radio-button__label" [attr.for]="inputId">{{ label }}</label>
    }
    <ng-content />
  `,
  host: {
    class: 'fc-radio-button',
    '[attr.id]': 'null',
  },
})
export class RadioButton {
  @Input() label?: string
  @Input() rootClassName?: string
  @Input() id?: string
  @Input() name?: string
  @Input() value?: string
  @Input() inputClass?: string

  readonly generatedId = nextId('fc-radio')

  get inputId(): string {
    return this.id ?? this.generatedId
  }
}
