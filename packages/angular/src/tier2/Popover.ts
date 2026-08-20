import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  InjectionToken,
  Input,
  type OnChanges,
  Output,
  signal,
  type SimpleChanges,
} from '@angular/core'
import { createPopover, type Popover as PopoverMachine } from '@web-loom/foolscap-core'
import { injectStableCallback } from '../bindings/inject-stable-callback'

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right'

export const POPOVER = new InjectionToken<PopoverRoot>('fc-popover')

function injectPopover(): PopoverRoot {
  const ctx = inject(POPOVER, { optional: true })
  if (!ctx) throw new Error('PopoverTrigger and PopoverContent must be used inside PopoverRoot')
  return ctx
}

export interface PopoverRootProps {
  open?: boolean
  defaultOpen?: boolean
  placement?: PopoverPlacement
  offset?: number
}

@Component({
  selector: 'fc-popover-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  providers: [{ provide: POPOVER, useExisting: PopoverRoot }],
})
export class PopoverRoot implements OnChanges {
  @Input() open?: boolean
  @Input() defaultOpen = false
  @Input() placement: NonNullable<PopoverRootProps['placement']> = 'bottom'
  @Input() offset = 8
  @Output() openChange = new EventEmitter<boolean>()

  private triggerEl: HTMLElement | null = null
  private contentEl: HTMLElement | null = null
  private machine: PopoverMachine | null = null
  private unsubscribe?: () => void
  private didApplyDefaultOpen = false
  private readonly onOpen = injectStableCallback(() => () => this.openChange.emit(true))
  private readonly onClose = injectStableCallback(() => () => this.openChange.emit(false))

  readonly isOpen = signal(false)
  readonly contentId = signal<string | undefined>(undefined)

  constructor() {
    inject(DestroyRef).onDestroy(() => this.teardown())
    afterNextRender(() => this.syncMachine())
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['placement'] || changes['offset']) && this.machine) {
      this.syncMachine()
      return
    }
    if (changes['open'] && this.machine) {
      this.applyControlledOpen()
    }
  }

  setTriggerEl(el: HTMLElement | null): void {
    if (this.triggerEl === el) return
    this.triggerEl = el
    this.syncMachine()
  }

  setContentEl(el: HTMLElement | null): void {
    if (this.contentEl === el) return
    this.contentEl = el
    this.syncMachine()
  }

  close(): void {
    this.machine?.close()
  }

  triggerClick(): void {
    this.machine?.getTriggerProps().onClick()
  }

  private teardown(): void {
    this.unsubscribe?.()
    this.unsubscribe = undefined
    this.machine?.destroy()
    this.machine = null
  }

  private applyControlledOpen(): void {
    const instance = this.machine
    if (!instance || this.open === undefined) return
    if (this.open && !instance.state.open) void instance.open()
    else if (!this.open && instance.state.open) instance.close()
  }

  private syncMachine(): void {
    this.teardown()
    const trigger = this.triggerEl
    const content = this.contentEl
    if (!trigger || !content) return

    const instance = createPopover(trigger, content, {
      placement: this.placement,
      offset: this.offset,
      onOpen: this.onOpen,
      onClose: this.onClose,
    })
    this.machine = instance
    this.contentId.set(instance.getContentProps().id)
    this.unsubscribe = instance.subscribe(() => {
      this.isOpen.set(instance.state.open)
    })
    this.isOpen.set(instance.state.open)

    if (this.open !== undefined) {
      this.applyControlledOpen()
    } else if (this.defaultOpen && !this.didApplyDefaultOpen) {
      this.didApplyDefaultOpen = true
      void instance.open()
    }
  }
}

@Directive({
  selector: '[fc-popover-trigger]',
  standalone: true,
  host: {
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-expanded]': 'ctx.isOpen()',
    '[attr.aria-controls]': 'ctx.contentId()',
    '(click)': 'onClick()',
  },
})
export class PopoverTrigger {
  protected readonly ctx = injectPopover()

  constructor() {
    this.ctx.setTriggerEl(inject(ElementRef<HTMLElement>).nativeElement)
  }

  onClick(): void {
    this.ctx.triggerClick()
  }
}

@Component({
  selector: '[fc-popover-content]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="fc-popover__arrow" aria-hidden="true"></span>
    <ng-content />
  `,
  host: {
    class: 'fc-popover',
    '[attr.role]': '"dialog"',
    '[attr.id]': 'ctx.contentId()',
    '[attr.data-state]': 'ctx.isOpen() ? "open" : "closed"',
    '[attr.data-placement]': 'ctx.placement',
    '[attr.hidden]': 'ctx.isOpen() ? null : ""',
  },
})
export class PopoverContent {
  protected readonly ctx = injectPopover()

  constructor() {
    this.ctx.setContentEl(inject(ElementRef<HTMLElement>).nativeElement)
  }
}

@Directive({
  selector: '[fc-popover-close]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class PopoverClose {
  private readonly ctx = injectPopover()

  onClick(): void {
    this.ctx.close()
  }
}
