import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { nextId } from '../utils/ids'

export interface FileProps {
  variant?: 'default' | 'dropzone'
  label?: string
  rootClassName?: string
}

@Component({
  selector: 'fc-file',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (label) {
      <label [attr.for]="inputId">{{ label }}</label>
    }
    <input type="file" class="fc-file__input" [id]="inputId" [class]="inputClass" />
    <ng-content />
  `,
  host: {
    class: 'fc-file',
    '[attr.data-variant]': 'variant === "default" ? null : variant',
  },
})
export class File {
  @Input() variant: NonNullable<FileProps['variant']> = 'default'
  @Input() label?: string
  @Input() rootClassName?: string
  @Input() id?: string
  @Input() inputClass?: string

  readonly generatedId = nextId('fc-file')

  get inputId(): string {
    return this.id ?? this.generatedId
  }
}
