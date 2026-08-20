import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  InjectionToken,
  Injector,
  Input,
  NgZone,
  type OnInit,
  runInInjectionContext,
  signal,
} from '@angular/core'
import { createToaster, type Toast, type Toaster as ToasterMachine } from '@web-loom/foolscap-core'
import { injectMachine } from '../bindings/inject-machine'
import { injectSubscription } from '../bindings/inject-subscription'
import { attachToBody } from '../utils/portal'

export type { Toast }

export const TOAST = new InjectionToken<ToastProvider>('fc-toast')

export interface ToastProviderProps {
  limit?: number
  defaultDuration?: number
}

export interface ToasterProps {
  position?: 'top' | 'top-right' | 'bottom-right' | 'bottom'
}

export interface ToastItemProps {
  toast: Toast
}

@Component({
  selector: 'fc-toast-provider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  providers: [{ provide: TOAST, useExisting: ToastProvider }],
})
export class ToastProvider implements OnInit {
  @Input() limit?: number
  @Input() defaultDuration?: number

  private readonly injector = inject(Injector)
  machine?: ToasterMachine

  ngOnInit(): void {
    this.ensureMachine()
  }

  subscribe(listener: (...args: unknown[]) => void): () => void {
    return this.ensureMachine().subscribe(listener)
  }

  ensureMachine(): ToasterMachine {
    if (!this.machine) {
      this.machine = runInInjectionContext(this.injector, () =>
        injectMachine(() =>
          createToaster({
            limit: this.limit,
            defaultDuration: this.defaultDuration,
          }),
        ),
      )
    }
    return this.machine
  }
}

function injectToastProvider(): ToastProvider {
  const ctx = inject(TOAST, { optional: true })
  if (!ctx) throw new Error('useToast must be used inside a ToastProvider')
  return ctx
}

@Component({
  selector: 'fc-toast-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fc-toast__content">
      <p class="fc-toast__title">{{ toast.title }}</p>
      @if (toast.description) {
        <p class="fc-toast__description">{{ toast.description }}</p>
      }
    </div>
    @if (toast.action) {
      <button type="button" class="fc-toast__action" (click)="toast.action!.onClick()">
        {{ toast.action.label }}
      </button>
    }
    <button
      type="button"
      class="fc-toast__dismiss"
      [attr.aria-label]="dismissProps['aria-label']"
      (click)="dismissProps.onClick()"
    ></button>
  `,
  host: {
    class: 'fc-toast',
    '[attr.role]': 'toastProps.role',
    '[attr.aria-atomic]': 'toastProps["aria-atomic"]',
    '[attr.data-state]': 'toastProps["data-state"]',
    '[attr.data-type]': 'toast.type',
  },
})
export class ToastItem {
  private readonly provider = injectToastProvider()

  @Input({ required: true }) toast!: Toast

  get toastProps() {
    return this.provider.ensureMachine().getToastProps(this.toast.id)
  }

  get dismissProps() {
    return this.provider.ensureMachine().getDismissButtonProps(this.toast.id)
  }
}

@Component({
  selector: 'fc-toaster',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToastItem],
  template: `
    @for (toast of toasts(); track toast.id) {
      <fc-toast-item [toast]="toast" />
    }
  `,
  host: {
    class: 'fc-toast-region',
    '[class.fc-toast-region--top]': 'position === "top"',
    '[class.fc-toast-region--top-right]': 'position === "top-right"',
    '[class.fc-toast-region--bottom-right]': 'position === "bottom-right"',
    '[class.fc-toast-region--bottom]': 'position === "bottom"',
    '[attr.role]': 'regionProps.role',
    '[attr.aria-label]': 'regionProps["aria-label"]',
    '[attr.aria-live]': 'regionProps["aria-live"]',
    '[attr.aria-atomic]': 'regionProps["aria-atomic"]',
    '(pointerenter)': 'regionProps.onPointerEnter()',
    '(pointerleave)': 'regionProps.onPointerLeave()',
  },
})
export class Toaster {
  private readonly provider = injectToastProvider()

  @Input() position: NonNullable<ToasterProps['position']> = 'bottom-right'

  readonly toasts = signal<Toast[]>([])

  constructor() {
    injectSubscription(this.provider)
    const machine = this.provider.ensureMachine()
    const zone = inject(NgZone)
    this.toasts.set(machine.state.toasts)
    machine.subscribe(() => {
      zone.run(() => this.toasts.set([...machine.state.toasts]))
    })
    attachToBody(inject(ElementRef<HTMLElement>).nativeElement)
  }

  get regionProps() {
    return this.provider.ensureMachine().getRegionProps()
  }
}
