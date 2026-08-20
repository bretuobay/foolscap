import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface QuoteProps {
  variant?: 'default' | 'pull'
  citeText?: string
}

@Component({
  selector: 'blockquote[fc-quote], fc-quote',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content />
    @if (citeText) {
      <cite class="fc-quote__cite">{{ citeText }}</cite>
    }
  `,
  host: {
    class: 'fc-quote',
    '[attr.data-variant]': 'variant === "default" ? null : variant',
  },
})
export class Quote {
  @Input() variant: NonNullable<QuoteProps['variant']> = 'default'
  @Input() citeText?: string
}
