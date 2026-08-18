import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'

export interface DateInputProps {
  value?: string
}

@Component({
  selector: 'input[fc-date-input]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: {
    class: 'fc-date-input',
    type: 'date',
    '(input)': 'onInput($event)',
  },
})
export class DateInput {
  @Input() value?: string
  @Output() valueChange = new EventEmitter<string>()

  onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value)
  }
}
