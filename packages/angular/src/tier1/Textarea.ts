import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'

export interface TextareaProps {
  invalid?: boolean
  value?: string
}

@Component({
  selector: 'textarea[fc-textarea]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: {
    class: 'fc-textarea',
    '[attr.aria-invalid]': 'invalid ? "true" : null',
    '[attr.data-state]': 'invalid ? "error" : null',
    '(input)': 'onInput($event)',
  },
})
export class Textarea {
  @Input() invalid = false
  @Input() value?: string
  @Output() valueChange = new EventEmitter<string>()

  onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLTextAreaElement).value)
  }
}
