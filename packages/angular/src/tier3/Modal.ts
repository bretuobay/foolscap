import {
  type AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  InjectionToken,
  Input,
  type OnChanges,
  signal,
  type SimpleChanges,
} from '@angular/core'
import { createModal, type Modal as ModalMachine } from '@web-loom/foolscap-core'
import { nextId } from '../utils/ids'
import { attachToBody } from '../utils/portal'

export const MODAL = new InjectionToken<Modal>('fc-modal')

function injectModal(): Modal {
  const ctx = inject(MODAL, { optional: true })
  if (!ctx) throw new Error('Modal slot components must be used inside <Modal>')
  return ctx
}

export interface ModalProps {
  open: boolean
  variant?: 'default' | 'alert'
  size?: 'sm' | 'md' | 'lg' | 'full'
  closeOnBackdropClick?: boolean
  animationDuration?: number
}

export interface ModalTitleProps {
  id?: string
}

export interface ModalBodyProps {
  id?: string
}

@Component({
  selector: 'dialog[fc-modal]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-modal',
    '[class.fc-modal--alert]': 'variant === "alert"',
    '[class.fc-modal--sm]': 'size === "sm"',
    '[class.fc-modal--lg]': 'size === "lg"',
    '[class.fc-modal--full]': 'size === "full"',
    '[attr.aria-modal]': 'true',
    '[attr.aria-labelledby]': 'labelledBy()',
    '[attr.aria-describedby]': 'variant === "alert" ? describedBy() : null',
    '[attr.role]': 'variant === "alert" ? "alertdialog" : "dialog"',
    '[attr.data-state]': 'dialogOpen() ? "open" : "closed"',
    '[attr.data-variant]': 'variant',
    '[attr.data-size]': 'size',
    '(animationend)': 'onAnimationEnd()',
  },
  providers: [{ provide: MODAL, useExisting: Modal }],
})
export class Modal implements AfterViewInit, OnChanges {
  private readonly el = inject(ElementRef<HTMLDialogElement>)

  @Input({ required: true }) open = false
  @Input() variant: NonNullable<ModalProps['variant']> = 'default'
  @Input() size: NonNullable<ModalProps['size']> = 'md'
  @Input() closeOnBackdropClick = true
  @Input() animationDuration = 200

  private machine: ModalMachine | null = null
  private unsubscribe?: () => void

  readonly labelledBy = signal<string | undefined>(undefined)
  readonly describedBy = signal<string | undefined>(undefined)
  readonly dialogOpen = signal(false)

  constructor() {
    attachToBody(this.el.nativeElement)
    inject(DestroyRef).onDestroy(() => {
      this.unsubscribe?.()
      this.machine?.destroy()
      this.machine = null
    })
  }

  ngAfterViewInit(): void {
    const el = this.el.nativeElement
    const instance = createModal(el, {
      closeOnBackdropClick: this.closeOnBackdropClick,
      animationDuration: this.animationDuration,
    })
    this.machine = instance
    this.unsubscribe = instance.subscribe(() => this.syncOpen())
    if (this.open) instance.open()
    this.syncOpen()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['open'] || !this.machine) return
    if (this.open) this.machine.open()
    else this.machine.close()
    this.syncOpen()
  }

  registerTitleId(id?: string): void {
    this.labelledBy.set(id)
  }

  registerBodyId(id?: string): void {
    this.describedBy.set(id)
  }

  requestClose(): void {
    this.machine?.close()
  }

  onAnimationEnd(): void {
    this.machine?.getRootProps().onAnimationEnd()
    this.syncOpen()
  }

  private syncOpen(): void {
    this.dialogOpen.set(this.el.nativeElement.open)
  }
}

@Component({
  selector: '[fc-modal-header]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-modal__header',
  },
})
export class ModalHeader {
  readonly kind = 'header'
}

@Component({
  selector: 'h2[fc-modal-title]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-modal__title',
    '[attr.id]': 'titleId',
  },
})
export class ModalTitle {
  private readonly ctx = injectModal()
  private readonly generatedId = nextId('fc-modal-title')

  @Input() id?: string

  get titleId(): string {
    return this.id ?? this.generatedId
  }

  constructor() {
    this.ctx.registerTitleId(this.titleId)
    inject(DestroyRef).onDestroy(() => this.ctx.registerTitleId(undefined))
  }
}

@Component({
  selector: '[fc-modal-body]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-modal__body',
    '[attr.id]': 'bodyId',
  },
})
export class ModalBody {
  private readonly ctx = injectModal()
  private readonly generatedId = nextId('fc-modal-body')

  @Input() id?: string

  get bodyId(): string {
    return this.id ?? this.generatedId
  }

  constructor() {
    this.ctx.registerBodyId(this.bodyId)
    inject(DestroyRef).onDestroy(() => this.ctx.registerBodyId(undefined))
  }
}

@Component({
  selector: '[fc-modal-footer]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-modal__footer',
  },
})
export class ModalFooter {
  readonly kind = 'footer'
}

@Component({
  selector: 'button[fc-modal-close]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-modal__close',
    '[attr.type]': '"button"',
    '[attr.aria-label]': 'ariaLabel ?? "Close modal"',
    '(click)': 'onClick()',
  },
})
export class ModalClose {
  private readonly ctx = injectModal()

  @Input('aria-label') ariaLabel?: string

  onClick(): void {
    this.ctx.requestClose()
  }
}
