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
import { createRating, type Rating as RatingMachine } from '@web-loom/foolscap-core'
import { injectMachine } from '../bindings/inject-machine'
import { injectStableCallback } from '../bindings/inject-stable-callback'

export const RATING = new InjectionToken<RatingRoot>('fc-rating')

function injectRating(): RatingRoot {
  const ctx = inject(RATING, { optional: true })
  if (!ctx) throw new Error('Rating components must be used inside RatingRoot')
  return ctx
}

export interface RatingRootProps {
  max?: number
  value?: number
  defaultValue?: number
  readOnly?: boolean
  disabled?: boolean
  name?: string
  icon?: string
}

export interface RatingItemProps {
  value: number
}

@Component({
  selector: 'span[fc-rating-value-label]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ ctx.machine.state.selectedValue }} out of {{ ctx.machine.state.max }} {{ ctx.machine.state.max === 1 ? 'star' : 'stars' }}`,
  host: {
    class: 'fc-rating__value-label',
    '[attr.aria-live]': '"polite"',
  },
})
export class RatingValueLabel {
  readonly ctx = injectRating()
}

@Component({
  selector: 'label[fc-rating-item]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      class="fc-rating__input"
      [attr.type]="inputProps.type"
      [attr.name]="inputProps.name"
      [value]="inputProps.value"
      [checked]="inputProps.checked"
      [disabled]="inputProps.disabled"
      [attr.aria-label]="inputProps['aria-label']"
      (change)="onChange($event)"
      (keydown)="onKeyDown($event)"
    />
    <span class="fc-rating__icon" aria-hidden="true">{{ ctx.icon }}</span>
  `,
  host: {
    class: 'fc-rating__item',
    '[attr.data-state]': 'itemProps["data-state"]',
    '(mouseenter)': 'itemProps.onMouseEnter()',
  },
})
export class RatingItem {
  readonly ctx = injectRating()

  @Input({ required: true }) value!: number

  get itemProps() {
    return this.ctx.machine.getItemProps(this.value)
  }

  get inputProps() {
    return this.ctx.machine.getInputProps(this.value)
  }

  onChange(event: Event): void {
    this.ctx.machine.getInputProps(this.value).onChange()
    const input = event.target as HTMLInputElement
    const selected = this.ctx.machine.state.selectedValue
    document.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${input.name}"]`).forEach((el) => {
      el.checked = Number(el.value) === selected
    })
  }

  onKeyDown(event: KeyboardEvent): void {
    this.ctx.machine.getInputProps(this.value).onKeyDown(event)
    const selected = this.ctx.machine.state.selectedValue
    const name = this.ctx.machine.getInputProps(this.value).name
    document.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${name}"]`).forEach((el) => {
      el.checked = Number(el.value) === selected
    })
  }
}

@Component({
  selector: 'span[fc-rating-readonly-icon]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="fc-rating__icon" aria-hidden="true">{{ ctx.icon }}</span>`,
  host: {
    class: 'fc-rating__item',
    '[attr.data-state]': 'itemProps["data-state"]',
  },
})
export class RatingReadOnlyIcon {
  readonly ctx = injectRating()

  @Input({ required: true }) value!: number

  get itemProps() {
    return this.ctx.machine.getItemProps(this.value)
  }
}

@Component({
  selector: '[fc-rating-items]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RatingValueLabel, RatingItem, RatingReadOnlyIcon],
  template: `
    @if (!ctx.isReadOnly) {
      <span fc-rating-value-label></span>
    }
    @for (value of values; track value) {
      @if (ctx.isReadOnly) {
        <span fc-rating-readonly-icon [value]="value"></span>
      } @else {
        <label fc-rating-item [value]="value"></label>
      }
    }
  `,
})
export class RatingItems {
  readonly ctx = injectRating()

  get values(): number[] {
    return Array.from({ length: this.ctx.max }, (_, index) => index + 1)
  }
}

@Component({
  selector: 'fc-rating',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RatingItems],
  template: `<div fc-rating-items></div>`,
  host: {
    class: 'fc-rating',
    '[attr.role]': 'rootProps.role',
    '[attr.aria-label]': 'ariaLabel ?? rootProps["aria-label"]',
    '[attr.data-state]': 'rootProps["data-state"]',
    '(mouseleave)': 'rootProps.onMouseLeave()',
  },
  providers: [{ provide: RATING, useExisting: RatingRoot }],
})
export class RatingRoot implements OnInit {
  private readonly host = inject(ElementRef<HTMLDivElement>)
  private readonly injector = inject(Injector)

  @Input() max = 5
  @Input() value?: number
  @Input() defaultValue?: number
  @Input() readOnly?: boolean
  @Input() disabled?: boolean
  @Input() name?: string
  @Input() icon = '★'
  @Input('aria-label') ariaLabel?: string
  @Output() valueChange = new EventEmitter<number>()
  @Output() hoverChange = new EventEmitter<number | null>()

  private readonly onValueChange = injectStableCallback(
    () => (value: number) => this.valueChange.emit(value),
  )
  private readonly onHoverChange = injectStableCallback(
    () => (value: number | null) => this.hoverChange.emit(value),
  )

  machine!: RatingMachine
  readonly selectedValue = signal(0)

  get isReadOnly(): boolean {
    return Boolean(this.readOnly ?? this.machine?.state.isReadOnly)
  }

  ngOnInit(): void {
    const getMax = () => this.max
    const getValue = () => this.value
    const getReadOnly = () => this.readOnly
    const getDisabled = () => this.disabled
    const getName = () => this.name
    this.machine = runInInjectionContext(this.injector, () =>
      injectMachine(() =>
        createRating({
          get max() {
            return getMax()
          },
          get value() {
            return getValue()
          },
          defaultValue: this.defaultValue,
          get readOnly() {
            return getReadOnly()
          },
          get disabled() {
            return getDisabled()
          },
          get name() {
            return getName()
          },
          onValueChange: this.onValueChange,
          onHoverChange: this.onHoverChange,
        }),
      ),
    )
    this.machine.setRootEl(this.host.nativeElement)
    this.sync()
    this.machine.subscribe(() => this.sync())
  }

  get rootProps() {
    return (
      this.machine?.getRootProps() ?? {
        role: 'radiogroup' as const,
        'aria-label': 'Rating',
        'data-state': undefined,
        onMouseLeave: () => undefined,
      }
    )
  }

  private sync(): void {
    this.selectedValue.set(this.machine.state.selectedValue)
  }
}
