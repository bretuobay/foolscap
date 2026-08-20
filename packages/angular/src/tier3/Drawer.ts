import {
  type AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  InjectionToken,
  Input,
  type OnChanges,
  Output,
  signal,
  type SimpleChanges,
  ViewChild,
} from '@angular/core'
import { createDrawer, type Drawer as DrawerMachine, type DrawerSide } from '@web-loom/foolscap-core'
import { injectStableCallback } from '../bindings/inject-stable-callback'
import { nextId } from '../utils/ids'
import { attachToBody } from '../utils/portal'

export type { DrawerSide }

export const DRAWER = new InjectionToken<Drawer>('fc-drawer')

function injectDrawer(): Drawer {
  const ctx = inject(DRAWER, { optional: true })
  if (!ctx) throw new Error('Drawer slot components must be used inside <Drawer>')
  return ctx
}

export interface DrawerProps {
  open: boolean
  side?: DrawerSide
  size?: 'sm' | 'md' | 'lg'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  animationDuration?: number
}

export interface DrawerTitleProps {
  id?: string
}

@Component({
  selector: 'fc-drawer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fc-drawer__overlay" aria-hidden="true" (click)="onOverlayClick()"></div>
    <dialog
      #panel
      class="fc-drawer__panel"
      [attr.aria-modal]="true"
      [attr.aria-labelledby]="labelledBy()"
      (transitionend)="onTransitionEnd($event)"
    >
      <ng-content />
    </dialog>
  `,
  host: {
    class: 'fc-drawer',
    '[attr.data-state]': 'status()',
    '[attr.data-side]': 'side',
    '[attr.data-size]': 'size',
  },
  providers: [{ provide: DRAWER, useExisting: Drawer }],
})
export class Drawer implements AfterViewInit, OnChanges {
  @ViewChild('panel') private panel?: ElementRef<HTMLDialogElement>

  @Input({ required: true }) open = false
  @Input() side: DrawerSide = 'right'
  @Input() size?: DrawerProps['size']
  @Input() closeOnOverlayClick = true
  @Input() closeOnEscape = true
  @Input() animationDuration = 250
  @Output() openChange = new EventEmitter<boolean>()

  private machine: DrawerMachine | null = null
  private unsubscribe?: () => void
  private readonly onClose = injectStableCallback(() => () => this.openChange.emit(false))

  readonly labelledBy = signal<string | undefined>(undefined)
  readonly status = signal<'closed' | 'opening' | 'open' | 'closing'>('closed')

  constructor() {
    attachToBody(inject(ElementRef<HTMLElement>).nativeElement)
    inject(DestroyRef).onDestroy(() => {
      this.unsubscribe?.()
      this.machine?.destroy()
      this.machine = null
    })
  }

  ngAfterViewInit(): void {
    const el = this.panel?.nativeElement
    if (!el) return
    const instance = createDrawer(el, {
      side: this.side,
      closeOnOverlayClick: this.closeOnOverlayClick,
      closeOnEscape: this.closeOnEscape,
      animationDuration: this.animationDuration,
      onClose: this.onClose,
    })
    this.machine = instance
    this.unsubscribe = instance.subscribe(() => this.syncStatus())
    if (this.open) instance.open()
    this.syncStatus()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['open'] || !this.machine) return
    if (this.open) this.machine.open()
    else this.machine.close()
    this.syncStatus()
  }

  registerTitleId(id?: string): void {
    this.labelledBy.set(id)
  }

  requestClose(): void {
    this.machine?.close()
  }

  onOverlayClick(): void {
    this.machine?.getOverlayProps().onClick()
  }

  onTransitionEnd(event: TransitionEvent): void {
    if (event.target !== this.panel?.nativeElement) return
    this.machine?.getPanelProps().onTransitionEnd(event.propertyName)
    this.syncStatus()
  }

  private syncStatus(): void {
    this.status.set(this.machine?.state.status ?? 'closed')
  }
}

@Component({
  selector: '[fc-drawer-header]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-drawer__header',
  },
})
export class DrawerHeader {
  readonly kind = 'header'
}

@Component({
  selector: 'h2[fc-drawer-title]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-drawer__title',
    '[attr.id]': 'titleId',
  },
})
export class DrawerTitle {
  private readonly ctx = injectDrawer()
  private readonly generatedId = nextId('fc-drawer-title')

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
  selector: 'button[fc-drawer-close]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-drawer__close',
    '[attr.type]': '"button"',
    '[attr.aria-label]': 'ariaLabel ?? "Close drawer"',
    '(click)': 'onClick()',
  },
})
export class DrawerClose {
  private readonly ctx = injectDrawer()

  @Input('aria-label') ariaLabel?: string

  onClick(): void {
    this.ctx.requestClose()
  }
}

@Component({
  selector: '[fc-drawer-body]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-drawer__body',
  },
})
export class DrawerBody {
  readonly kind = 'body'
}

@Component({
  selector: '[fc-drawer-footer]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-drawer__footer',
  },
})
export class DrawerFooter {
  readonly kind = 'footer'
}
