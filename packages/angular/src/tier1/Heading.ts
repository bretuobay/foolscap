import { ChangeDetectionStrategy, Component, ElementRef, Input, inject } from '@angular/core'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface HeadingProps {
  level?: HeadingLevel
}

@Component({
  selector: 'h1[fc-heading], h2[fc-heading], h3[fc-heading], h4[fc-heading], h5[fc-heading], h6[fc-heading]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-heading',
    '[attr.data-level]': 'resolvedLevel',
  },
})
export class Heading {
  private readonly el = inject(ElementRef<HTMLHeadingElement>)

  @Input() level?: HeadingLevel

  get resolvedLevel(): HeadingLevel {
    return this.level ?? (Number.parseInt(this.el.nativeElement.tagName.slice(1), 10) as HeadingLevel)
  }
}
