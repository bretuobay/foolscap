import {
  type AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core'
import { nextId } from '../utils/ids'

export interface CheckboxProps {
  label?: string
  hint?: string
  indeterminate?: boolean
  rootClassName?: string
  value?: boolean
}

@Component({
  selector: 'fc-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      #inputEl
      type="checkbox"
      class="fc-checkbox__input"
      [id]="inputId"
      [class]="inputClass"
      [attr.name]="name"
      [checked]="value"
      [attr.aria-checked]="indeterminate ? 'mixed' : null"
      (change)="onChange($event)"
    />
    <span class="fc-checkbox__control" aria-hidden="true"></span>
    @if (label) {
      <label class="fc-checkbox__label" [attr.for]="inputId">{{ label }}</label>
    }
    @if (hint) {
      <p class="fc-checkbox__hint">{{ hint }}</p>
    }
    <ng-content />
  `,
  host: {
    class: 'fc-checkbox',
    '[attr.data-state]': 'indeterminate ? "indeterminate" : null',
    '[attr.id]': 'null',
  },
})
export class Checkbox implements AfterViewInit {
  @ViewChild('inputEl') private inputEl?: ElementRef<HTMLInputElement>

  @Input() label?: string
  @Input() hint?: string
  @Input() indeterminate = false
  @Input() rootClassName?: string
  @Input() value?: boolean
  @Input() id?: string
  @Input() name?: string
  @Input() inputClass?: string
  @Output() valueChange = new EventEmitter<boolean>()

  readonly generatedId = nextId('fc-checkbox')

  get inputId(): string {
    return this.id ?? this.generatedId
  }

  ngAfterViewInit(): void {
    this.syncIndeterminate()
  }

  onChange(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).checked)
  }

  private syncIndeterminate(): void {
    if (this.inputEl) this.inputEl.nativeElement.indeterminate = Boolean(this.indeterminate)
  }
}
