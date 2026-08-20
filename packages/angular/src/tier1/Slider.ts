import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'

export interface SliderProps {
  value?: string | number
}

@Component({
  selector: 'input[fc-slider]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: {
    class: 'fc-slider',
    type: 'range',
    '(input)': 'onInput($event)',
  },
})
export class Slider {
  @Input() value?: string | number
  @Output() valueChange = new EventEmitter<string>()

  onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value)
  }
}
