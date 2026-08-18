import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'

export interface SearchInputProps {
  rootClassName?: string
  clearLabel?: string
  value?: string
}

@Component({
  selector: 'fc-search-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="fc-search-input__icon" aria-hidden="true">
      <ng-content select="[fcIcon]" />
      @if (!hasIcon) {
        Search
      }
    </span>
    <input
      type="search"
      class="fc-search-input__field"
      [class]="inputClass"
      [value]="value"
      [attr.aria-label]="ariaLabel"
      (input)="onInput($event)"
    />
    @if (clear.observed) {
      <button
        class="fc-search-input__clear"
        type="button"
        [attr.aria-label]="clearLabel"
        (click)="clear.emit()"
      >
        x
      </button>
    }
  `,
  host: {
    class: 'fc-search-input',
  },
})
export class SearchInput {
  @Input() rootClassName?: string
  @Input() clearLabel = 'Clear search'
  @Input() value?: string
  @Input() inputClass?: string
  @Input() hasIcon = false
  @Input('aria-label') ariaLabel?: string
  @Output() valueChange = new EventEmitter<string>()
  @Output() clear = new EventEmitter<void>()

  onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value)
  }
}
