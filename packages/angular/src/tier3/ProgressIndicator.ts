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
  createProgressIndicator,
  type ProgressIndicator as ProgressIndicatorMachine,
  type ProgressIndicatorOrientation,
  type ProgressIndicatorStep,
} from '@web-loom/foolscap-core'
import { injectMachine } from '../bindings/inject-machine'
import { injectStableCallback } from '../bindings/inject-stable-callback'

export type { ProgressIndicatorStep, ProgressIndicatorOrientation }

export const PROGRESS_INDICATOR = new InjectionToken<ProgressIndicatorRoot>('fc-progress-indicator')

function injectProgressIndicator(): ProgressIndicatorRoot {
  const ctx = inject(PROGRESS_INDICATOR, { optional: true })
  if (!ctx) throw new Error('ProgressIndicator components must be used inside ProgressIndicatorRoot')
  return ctx
}

export interface ProgressIndicatorRootProps {
  steps: ProgressIndicatorStep[]
  step?: number
  defaultStep?: number
  linear?: boolean
  orientation?: ProgressIndicatorOrientation
  label?: string
}

export interface ProgressIndicatorStepProps {
  index: number
}

@Component({
  selector: '[fc-progress-indicator-step-label]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-progress-indicator__step-label',
    '[attr.id]': 'ctx.machine.getStepLabelProps(index).id',
  },
})
export class ProgressIndicatorStepLabel {
  readonly ctx = injectProgressIndicator()
  @Input({ required: true }) index = 0
}

@Component({
  selector: '[fc-progress-indicator-step-description]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-progress-indicator__step-description',
    '[attr.id]': 'ctx.machine.getStepDescriptionProps(index).id',
  },
})
export class ProgressIndicatorStepDescription {
  readonly ctx = injectProgressIndicator()
  @Input({ required: true }) index = 0
}

@Component({
  selector: '[fc-progress-indicator-step-sr-status]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ ctx.machine.getStepSrStatusProps(index).children }}`,
  host: {
    class: 'fc-progress-indicator__step-sr-status',
  },
})
export class ProgressIndicatorStepSrStatus {
  readonly ctx = injectProgressIndicator()
  @Input({ required: true }) index = 0
}

@Component({
  selector: '[fc-progress-indicator-step-indicator]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-progress-indicator__step-indicator',
    '[attr.role]': 'indicatorProps.role',
    '[attr.tabindex]': 'indicatorProps.tabIndex',
    '[attr.aria-label]': 'indicatorProps["aria-label"]',
    '[attr.aria-disabled]': 'indicatorProps["aria-disabled"]',
    '[attr.data-disabled]': 'indicatorProps["data-disabled"]',
    '(click)': 'indicatorProps.onClick()',
    '(keydown)': 'indicatorProps.onKeyDown($event)',
  },
})
export class ProgressIndicatorStepIndicator implements OnInit {
  readonly ctx = injectProgressIndicator()
  private readonly el = inject(ElementRef<HTMLElement>)

  @Input({ required: true }) index = 0

  ngOnInit(): void {
    this.ctx.machine.setStepIndicatorEl(this.index, this.el.nativeElement as HTMLDivElement)
  }

  get indicatorProps() {
    return this.ctx.machine.getStepIndicatorProps(this.index)
  }
}

@Component({
  selector: 'li[fc-progress-indicator-step]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ProgressIndicatorStepIndicator,
    ProgressIndicatorStepLabel,
    ProgressIndicatorStepDescription,
    ProgressIndicatorStepSrStatus,
  ],
  template: `
    <div fc-progress-indicator-step-indicator [index]="index">
      {{ stepState === 'complete' ? '✓' : index + 1 }}
    </div>
    <span class="fc-progress-indicator__content">
      <span fc-progress-indicator-step-label [index]="index">{{ step?.label }}</span>
      @if (step?.description) {
        <span fc-progress-indicator-step-description [index]="index">{{ step?.description }}</span>
      }
    </span>
    <span fc-progress-indicator-step-sr-status [index]="index"></span>
  `,
  host: {
    class: 'fc-progress-indicator__step',
    '[attr.id]': 'stepProps.id',
    '[attr.data-state]': 'stepProps["data-state"]',
    '[attr.aria-current]': 'stepProps["aria-current"]',
  },
})
export class ProgressIndicatorStepView {
  readonly ctx = injectProgressIndicator()

  @Input({ required: true }) index = 0

  get step() {
    return this.ctx.steps[this.index]
  }

  get stepProps() {
    return this.ctx.machine.getStepProps(this.index)
  }

  get stepState() {
    return this.stepProps['data-state']
  }
}

@Component({
  selector: 'ol[fc-progress-indicator], fc-progress-indicator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressIndicatorStepView],
  template: `
    @for (step of steps; track $index) {
      <li fc-progress-indicator-step [index]="$index"></li>
    }
  `,
  host: {
    class: 'fc-progress-indicator',
    '[attr.aria-label]': 'label',
    '[attr.data-orientation]': 'orientation',
    '[attr.data-linear]': 'linear ? "true" : "false"',
    '[attr.role]': '"list"',
  },
  providers: [{ provide: PROGRESS_INDICATOR, useExisting: ProgressIndicatorRoot }],
})
export class ProgressIndicatorRoot implements OnInit {
  private readonly host = inject(ElementRef<HTMLElement>)
  private readonly injector = inject(Injector)

  @Input({ required: true }) steps: ProgressIndicatorStep[] = []
  @Input() step?: number
  @Input() defaultStep?: number
  @Input() linear = true
  @Input() orientation: ProgressIndicatorOrientation = 'horizontal'
  @Input() label = 'Progress'
  @Output() stepChange = new EventEmitter<number>()

  private readonly onStepChange = injectStableCallback(
    () => (next: number) => this.stepChange.emit(next),
  )

  machine!: ProgressIndicatorMachine
  readonly current = signal(0)

  ngOnInit(): void {
    const getSteps = () => this.steps
    const getStep = () => this.step
    const getLinear = () => this.linear
    const getOrientation = () => this.orientation
    this.machine = runInInjectionContext(this.injector, () =>
      injectMachine(() =>
        createProgressIndicator({
          get steps() {
            return getSteps()
          },
          get step() {
            return getStep()
          },
          defaultStep: this.defaultStep,
          get linear() {
            return getLinear()
          },
          get orientation() {
            return getOrientation()
          },
          onStepChange: this.onStepChange,
        }),
      ),
    )
    this.machine.setRootEl(this.host.nativeElement as HTMLOListElement)
    this.sync()
    this.machine.subscribe(() => this.sync())
  }

  private sync(): void {
    this.current.set(this.machine.state.currentStep)
  }
}
