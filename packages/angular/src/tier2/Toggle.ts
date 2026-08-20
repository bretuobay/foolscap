import {
  type AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  type ElementRef,
  EventEmitter,
  inject,
  Injector,
  Input,
  type OnInit,
  Output,
  runInInjectionContext,
  ViewChild,
} from '@angular/core'
import { createToggle, type Toggle as ToggleMachine } from '@web-loom/foolscap-core'
import { injectMachine } from '../bindings/inject-machine'
import { injectStableCallback } from '../bindings/inject-stable-callback'
import { nextId } from '../utils/ids'

export interface ToggleProps {
  checked?: boolean
  defaultChecked?: boolean
  label?: string
  disabled?: boolean
  id?: string
}

@Component({
  selector: 'label[fc-toggle]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      #inputEl
      type="checkbox"
      role="switch"
      class="fc-toggle__input"
      [id]="inputId"
      [checked]="isChecked"
      [disabled]="disabled"
      [attr.aria-disabled]="disabled ? true : null"
      [attr.aria-label]="ariaLabel"
      (change)="onInputChange($event)"
    />
    <span class="fc-toggle__track" aria-hidden="true">
      <span class="fc-toggle__thumb"></span>
    </span>
    @if (label) {
      <span class="fc-toggle__label">{{ label }}</span>
    }
    <ng-content />
  `,
  host: {
    class: 'fc-toggle',
    '[class.fc-toggle--disabled]': 'disabled',
    '[attr.for]': 'inputId',
  },
})
export class Toggle implements OnInit, AfterViewInit {
  @ViewChild('inputEl') private inputEl?: ElementRef<HTMLInputElement>

  @Input() checked?: boolean
  @Input() defaultChecked?: boolean
  @Input() label?: string
  @Input() disabled = false
  @Input() id?: string
  @Input('aria-label') ariaLabel?: string
  @Output() checkedChange = new EventEmitter<boolean>()

  private readonly generatedId = nextId('fc-toggle')
  private readonly injector = inject(Injector)
  private readonly onCheckedChange = injectStableCallback(
    () => (value: boolean) => this.checkedChange.emit(value),
  )

  private machine?: ToggleMachine

  constructor() {
    inject(DestroyRef).onDestroy(() => this.machine?.setRootEl(null))
  }

  ngOnInit(): void {
    this.machine = runInInjectionContext(this.injector, () =>
      injectMachine(() =>
        createToggle({
          checked: this.checked,
          defaultChecked: this.defaultChecked,
          onCheckedChange: this.onCheckedChange,
        }),
      ),
    )
  }

  ngAfterViewInit(): void {
    this.machine?.setRootEl(this.inputEl?.nativeElement ?? null)
  }

  get inputId(): string {
    return this.id ?? this.generatedId
  }

  get isControlled(): boolean {
    return this.checked !== undefined
  }

  get isChecked(): boolean {
    if (this.isControlled) return Boolean(this.checked)
    return this.machine?.state.checked ?? Boolean(this.defaultChecked)
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement
    const next = input.checked
    this.machine?.setChecked(next)
    if (this.isControlled) {
      input.checked = Boolean(this.checked)
    }
  }
}
