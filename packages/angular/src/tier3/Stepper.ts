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
import { createStepper, type Stepper as StepperMachine } from '@web-loom/foolscap-core'
import { injectMachine } from '../bindings/inject-machine'
import { injectStableCallback } from '../bindings/inject-stable-callback'

export const STEPPER = new InjectionToken<StepperRoot>('fc-stepper')

function injectStepper(): StepperRoot {
  const ctx = inject(STEPPER, { optional: true })
  if (!ctx) throw new Error('Stepper components must be used inside StepperRoot')
  return ctx
}

export interface StepperRootProps {
  label: string
  min?: number
  max?: number
  step?: number
  largeStep?: number
  value?: number
  defaultValue?: number
  name?: string
  disabled?: boolean
  editable?: boolean
  size?: 'sm' | 'md' | 'lg'
  formatValue?: (value: number) => string
}

@Component({
  selector: 'label[fc-stepper-label]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-stepper__label',
    '[attr.id]': 'labelProps.id',
    '[attr.for]': 'labelProps.htmlFor',
  },
})
export class StepperLabel {
  private readonly ctx = injectStepper()

  get labelProps() {
    return this.ctx.machine.getLabelProps()
  }
}

@Component({
  selector: 'button[fc-stepper-decrement]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-stepper__decrement',
    '[attr.type]': 'decrementProps.type',
    '[attr.aria-label]': 'ariaLabel ?? decrementProps["aria-label"]',
    '[attr.aria-controls]': 'decrementProps["aria-controls"]',
    '[attr.aria-disabled]': 'decrementProps["aria-disabled"]',
    '[disabled]': 'decrementProps.disabled',
    '(click)': 'decrementProps.onClick()',
    '(pointerdown)': 'decrementProps.onPointerDown()',
    '(pointerup)': 'decrementProps.onPointerUp()',
    '(pointercancel)': 'decrementProps.onPointerCancel()',
    '(keyup)': 'decrementProps.onKeyUp()',
  },
})
export class StepperDecrement {
  private readonly ctx = injectStepper()

  @Input('aria-label') ariaLabel?: string

  get decrementProps() {
    return this.ctx.machine.getDecrementProps()
  }
}

@Component({
  selector: 'button[fc-stepper-increment]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-stepper__increment',
    '[attr.type]': 'incrementProps.type',
    '[attr.aria-label]': 'ariaLabel ?? incrementProps["aria-label"]',
    '[attr.aria-controls]': 'incrementProps["aria-controls"]',
    '[attr.aria-disabled]': 'incrementProps["aria-disabled"]',
    '[disabled]': 'incrementProps.disabled',
    '(click)': 'incrementProps.onClick()',
    '(pointerdown)': 'incrementProps.onPointerDown()',
    '(pointerup)': 'incrementProps.onPointerUp()',
    '(pointercancel)': 'incrementProps.onPointerCancel()',
    '(keyup)': 'incrementProps.onKeyUp()',
  },
})
export class StepperIncrement {
  private readonly ctx = injectStepper()

  @Input('aria-label') ariaLabel?: string

  get incrementProps() {
    return this.ctx.machine.getIncrementProps()
  }
}

@Component({
  selector: '[fc-stepper-input]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ inputProps.children }}`,
  host: {
    class: 'fc-stepper__input',
    '[attr.id]': 'inputProps.id',
    '[attr.role]': 'inputProps.role',
    '[attr.tabindex]': 'inputProps.tabIndex',
    '[attr.aria-labelledby]': 'inputProps["aria-labelledby"]',
    '[attr.aria-valuemin]': 'inputProps["aria-valuemin"]',
    '[attr.aria-valuemax]': 'inputProps["aria-valuemax"]',
    '[attr.aria-valuenow]': 'inputProps["aria-valuenow"]',
    '[attr.aria-valuetext]': 'inputProps["aria-valuetext"]',
    '[attr.aria-disabled]': 'inputProps["aria-disabled"]',
    '[attr.contenteditable]': 'inputProps.contentEditable',
    '(input)': 'onInput($event)',
    '(blur)': 'onBlur($event)',
    '(keydown)': 'onKeyDown($event)',
  },
})
export class StepperInput {
  private readonly ctx = injectStepper()

  get inputProps() {
    return this.ctx.machine.getInputProps()
  }

  onInput(event: Event): void {
    this.ctx.machine.getInputProps().onInput((event.currentTarget as HTMLElement).textContent ?? '')
  }

  onBlur(event: Event): void {
    this.ctx.machine.getInputProps().onBlur((event.currentTarget as HTMLElement).textContent ?? '')
  }

  onKeyDown(event: KeyboardEvent): void {
    this.ctx.machine.getInputProps().onKeyDown(event)
  }
}

@Component({
  selector: 'input[fc-stepper-hidden-input]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    class: 'fc-stepper__hidden-input',
    '[attr.type]': '"hidden"',
    '[attr.name]': 'hiddenProps.name',
    '[attr.value]': 'hiddenProps.value',
    '[attr.readonly]': 'true',
  },
})
export class StepperHiddenInput {
  private readonly ctx = injectStepper()

  get hiddenProps() {
    return this.ctx.machine.getHiddenInputProps()
  }
}

@Component({
  selector: 'fc-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepperLabel, StepperDecrement, StepperInput, StepperIncrement, StepperHiddenInput],
  template: `
    <label fc-stepper-label>{{ label }}</label>
    <div class="fc-stepper__controls">
      <button fc-stepper-decrement>−</button>
      <div fc-stepper-input></div>
      <button fc-stepper-increment>+</button>
    </div>
    @if (name) {
      <input fc-stepper-hidden-input />
    }
  `,
  host: {
    class: 'fc-stepper',
    '[attr.role]': 'rootProps.role',
    '[attr.aria-labelledby]': 'rootProps["aria-labelledby"]',
    '[attr.data-state]': 'rootProps["data-state"]',
    '[attr.data-size]': 'size',
  },
  providers: [{ provide: STEPPER, useExisting: StepperRoot }],
})
export class StepperRoot implements OnInit {
  private readonly host = inject(ElementRef<HTMLDivElement>)
  private readonly injector = inject(Injector)

  @Input({ required: true }) label = ''
  @Input() min?: number
  @Input() max?: number
  @Input() step?: number
  @Input() largeStep?: number
  @Input() value?: number
  @Input() defaultValue?: number
  @Input() name?: string
  @Input() disabled?: boolean
  @Input() editable?: boolean
  @Input() size?: StepperRootProps['size']
  @Input() formatValue?: (value: number) => string
  @Output() valueChange = new EventEmitter<number>()

  private readonly onValueChange = injectStableCallback(
    () => (value: number) => this.valueChange.emit(value),
  )

  machine!: StepperMachine
  readonly current = signal(0)

  ngOnInit(): void {
    const getMin = () => this.min
    const getMax = () => this.max
    const getStep = () => this.step
    const getLargeStep = () => this.largeStep
    const getValue = () => this.value
    const getName = () => this.name
    const getDisabled = () => this.disabled
    const getEditable = () => this.editable
    const getFormatValue = () => this.formatValue
    this.machine = runInInjectionContext(this.injector, () =>
      injectMachine(() =>
        createStepper({
          get min() {
            return getMin()
          },
          get max() {
            return getMax()
          },
          get step() {
            return getStep()
          },
          get largeStep() {
            return getLargeStep()
          },
          get value() {
            return getValue()
          },
          defaultValue: this.defaultValue,
          get name() {
            return getName()
          },
          get disabled() {
            return getDisabled()
          },
          get editable() {
            return getEditable()
          },
          get formatValue() {
            return getFormatValue()
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
    return (
      this.machine?.getRootProps() ?? {
        role: 'group' as const,
        'aria-labelledby': undefined,
        'data-state': undefined,
      }
    )
  }

  private sync(): void {
    this.current.set(this.machine.state.value)
  }
}
