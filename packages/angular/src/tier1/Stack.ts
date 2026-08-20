import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export interface StackProps {
  gap?: '1' | '2' | '3' | '4' | '6' | '8' | '12'
  align?: 'start' | 'center' | 'end' | 'stretch'
}

@Component({
  selector: 'fc-stack',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-stack',
    '[attr.data-gap]': 'gap',
    '[attr.data-align]': 'align',
  },
})
export class Stack {
  @Input() gap: NonNullable<StackProps['gap']> = '4'
  @Input() align?: StackProps['align']
}
