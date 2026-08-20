import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  InjectionToken,
  Injector,
  Input,
  type OnInit,
  Output,
  runInInjectionContext,
  signal,
} from '@angular/core'
import {
  createSegmentedControl,
  type SegmentedControl as SegmentedControlMachine,
  type SegmentedControlItem,
  type SegmentedControlMode,
} from '@web-loom/foolscap-core'
import { injectMachine } from '../bindings/inject-machine'
import { injectStableCallback } from '../bindings/inject-stable-callback'

export type { SegmentedControlItem, SegmentedControlMode }

export const SEGMENTED_CONTROL = new InjectionToken<SegmentedControlRoot>('fc-segmented-control')

function injectSegmentedControl(): SegmentedControlRoot {
  const ctx = inject(SEGMENTED_CONTROL, { optional: true })
  if (!ctx) throw new Error('SegmentedControl components must be used inside SegmentedControlRoot')
  return ctx
}

export interface SegmentedControlRootProps {
  items: SegmentedControlItem[]
  value?: string
  defaultValue?: string
  mode?: SegmentedControlMode
  name?: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export interface SegmentedControlItemProps {
  item: SegmentedControlItem
}

@Component({
  selector: 'span[fc-segmented-control-indicator]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    class: 'fc-segmented-control__indicator',
    '[attr.aria-hidden]': 'true',
  },
})
export class SegmentedControlIndicator {
  readonly kind = 'indicator'
}

@Component({
  selector: '[fc-segmented-control-item]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (ctx.mode === 'tabs') {
      <ng-content />
    } @else {
      <input
        class="fc-segmented-control__input"
        [attr.type]="inputProps.type"
        [attr.name]="inputProps.name"
        [value]="inputProps.value"
        [checked]="inputProps.checked"
        [disabled]="inputProps.disabled"
        (change)="onChange($event)"
        (keydown)="onKeyDown($event)"
      />
      <span class="fc-segmented-control__label-text">{{ item.label }}</span>
    }
  `,
  host: {
    class: 'fc-segmented-control__item',
    '[attr.data-state]': 'itemProps["data-state"]',
    '[attr.role]': 'ctx.mode === "tabs" ? itemProps.role : null',
    '[attr.id]': 'ctx.mode === "tabs" ? itemProps.id : null',
    '[attr.aria-selected]': 'ctx.mode === "tabs" ? itemProps["aria-selected"] : null',
    '[attr.aria-disabled]': 'ctx.mode === "tabs" ? itemProps["aria-disabled"] : null',
    '[attr.tabindex]': 'ctx.mode === "tabs" ? itemProps.tabIndex : null',
    '[attr.type]': 'ctx.mode === "tabs" ? "button" : null',
    '[attr.disabled]': 'ctx.mode === "tabs" && item.disabled ? "" : null',
    '(click)': 'onHostClick()',
    '(keydown)': 'onKeyDown($event)',
  },
})
export class SegmentedControlItemView implements OnInit {
  readonly ctx = injectSegmentedControl()
  private readonly el = inject(ElementRef<HTMLElement>)

  @Input({ required: true }) item!: SegmentedControlItem

  ngOnInit(): void {
    this.ctx.machine.setItemEl(this.item.value, this.el.nativeElement)
  }

  get itemProps() {
    return this.ctx.machine.getItemProps(this.item.value)
  }

  get inputProps() {
    return this.ctx.machine.getInputProps(this.item.value)
  }

  onHostClick(): void {
    if (this.ctx.mode !== 'tabs') return
    this.ctx.machine.getItemProps(this.item.value).onClick()
  }

  onClick(): void {
    this.ctx.machine.getItemProps(this.item.value).onClick()
  }

  onKeyDown(event: KeyboardEvent): void {
    this.ctx.machine.getItemProps(this.item.value).onKeyDown(event)
  }

  onChange(event: Event): void {
    this.ctx.machine.getInputProps(this.item.value).onChange()
    const input = event.target as HTMLInputElement
    const selected = this.ctx.machine.state.selectedValue
    document.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${input.name}"]`).forEach((el) => {
      el.checked = el.value === selected
    })
  }
}

@Component({
  selector: 'fc-segmented-control',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SegmentedControlIndicator, SegmentedControlItemView],
  template: `
    <span fc-segmented-control-indicator></span>
    @for (item of items; track item.value) {
      @if (mode === 'tabs') {
        <button fc-segmented-control-item [item]="item">
          <span class="fc-segmented-control__label-text">{{ item.label }}</span>
        </button>
      } @else {
        <label fc-segmented-control-item [item]="item"></label>
      }
    }
  `,
  host: {
    class: 'fc-segmented-control',
    '[attr.role]': 'rootProps.role',
    '[attr.aria-label]': 'label',
    '[attr.data-mode]': 'rootProps["data-mode"]',
    '[attr.data-size]': 'size',
    '[attr.data-full-width]': 'fullWidth ? "" : null',
  },
  providers: [{ provide: SEGMENTED_CONTROL, useExisting: SegmentedControlRoot }],
})
export class SegmentedControlRoot implements OnInit {
  private readonly host = inject(ElementRef<HTMLElement>)
  private readonly injector = inject(Injector)

  @Input({ required: true }) items: SegmentedControlItem[] = []
  @Input() value?: string
  @Input() defaultValue?: string
  @Input() mode: SegmentedControlMode = 'radio'
  @Input() name?: string
  @Input() label = 'Segmented control'
  @Input() size?: SegmentedControlRootProps['size']
  @Input() fullWidth = false
  @Output() valueChange = new EventEmitter<string>()

  private readonly onValueChange = injectStableCallback(
    () => (value: string) => this.valueChange.emit(value),
  )

  machine!: SegmentedControlMachine
  readonly selectedValue = signal('')

  ngOnInit(): void {
    const getItems = () => this.items
    const getValue = () => this.value
    const getName = () => this.name
    this.machine = runInInjectionContext(this.injector, () =>
      injectMachine(() =>
        createSegmentedControl({
          get items() {
            return getItems()
          },
          get value() {
            return getValue()
          },
          defaultValue: this.defaultValue,
          mode: this.mode,
          get name() {
            return getName()
          },
          onValueChange: this.onValueChange,
        }),
      ),
    )
    this.machine.setRootEl(this.host.nativeElement)
    this.sync()
    this.machine.subscribe(() => this.sync())
  }

  get rootProps() {
    return this.machine?.getRootProps() ?? { role: 'radiogroup', 'data-mode': this.mode }
  }

  private sync(): void {
    this.selectedValue.set(this.machine.state.selectedValue ?? '')
  }
}
