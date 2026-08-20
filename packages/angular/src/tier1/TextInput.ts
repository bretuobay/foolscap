import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'

export interface TextInputProps {
  size?: 'sm' | 'md' | 'lg'
  invalid?: boolean
  value?: string | number
}

@Component({
  selector: 'input[fc-text-input]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: {
    class: 'fc-text-input',
    '[attr.aria-invalid]': 'invalid ? "true" : null',
    '[attr.data-size]': 'size === "md" ? null : size',
    '[attr.data-state]': 'invalid ? "error" : null',
    '(input)': 'onInput($event)',
  },
})
export class TextInput {
  @Input() size: NonNullable<TextInputProps['size']> = 'md'
  @Input() invalid = false
  @Input() value?: string | number
  @Output() valueChange = new EventEmitter<string>()

  onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value)
  }
}
