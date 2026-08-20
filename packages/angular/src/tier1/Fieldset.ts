import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface FieldsetProps {
  legend?: string
  hint?: string
}

@Component({
  selector: 'fieldset[fc-fieldset]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (legend) {
      <legend class="fc-fieldset__legend">{{ legend }}</legend>
    }
    @if (hint) {
      <p class="fc-fieldset__hint">{{ hint }}</p>
    }
    <div class="fc-fieldset__body">
      <ng-content />
    </div>
  `,
  host: {
    class: 'fc-fieldset',
  },
})
export class Fieldset {
  @Input() legend?: string
  @Input() hint?: string
}
