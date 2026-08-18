import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  InjectionToken,
  Input,
  type OnChanges,
  signal,
  type SimpleChanges,
} from '@angular/core'
import { createTooltip, type Tooltip as TooltipMachine } from '@web-loom/foolscap-core'
import { attachToBody } from '../utils/portal'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export const TOOLTIP = new InjectionToken<TooltipRoot>('fc-tooltip')

function injectTooltip(): TooltipRoot {
  const ctx = inject(TOOLTIP, { optional: true })
  if (!ctx) throw new Error('TooltipTrigger and TooltipContent must be used inside TooltipRoot')
  return ctx
}

function mergeDescribedBy(existing: string | undefined, next: string | undefined): string | undefined {
  const ids = [existing, next]
    .filter(Boolean)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean)
  return [...new Set(ids)].join(' ') || undefined
}

export interface TooltipRootProps {
  openDelay?: number
  closeDelay?: number
  placement?: TooltipPlacement
  offset?: number
}

@Component({
  selector: 'fc-tooltip-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-tooltip',
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
  },
  providers: [{ provide: TOOLTIP, useExisting: TooltipRoot }],
})
export class TooltipRoot implements OnChanges {
  @Input() openDelay = 300
  @Input() closeDelay = 100
  @Input() placement: NonNullable<TooltipRootProps['placement']> = 'top'
  @Input() offset = 8

  private triggerEl: HTMLElement | null = null
  private contentEl: HTMLElement | null = null
  private machine: TooltipMachine | null = null
  private unsubscribe?: () => void

  readonly isOpen = signal(false)
  readonly contentId = signal<string | undefined>(undefined)

  constructor() {
    inject(DestroyRef).onDestroy(() => this.teardown())
    afterNextRender(() => this.syncMachine())
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['openDelay'] ||
        changes['closeDelay'] ||
        changes['placement'] ||
        changes['offset']) &&
      this.machine
    ) {
      this.syncMachine()
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

  triggerProps() {
    return this.machine?.getTriggerProps()
  }

  describedBy(existing?: string): string | undefined {
    return mergeDescribedBy(existing, this.triggerProps()?.['aria-describedby'])
  }

  private teardown(): void {
    this.unsubscribe?.()
    this.unsubscribe = undefined
    this.machine?.destroy()
    this.machine = null
  }

  private syncMachine(): void {
    this.teardown()
    const trigger = this.triggerEl
    const content = this.contentEl
    if (!trigger || !content) return

    const instance = createTooltip(trigger, content, {
      openDelay: this.openDelay,
      closeDelay: this.closeDelay,
      placement: this.placement,
      offset: this.offset,
    })
    this.machine = instance
    this.contentId.set(instance.getContentProps().id)
    this.unsubscribe = instance.subscribe(() => {
      this.isOpen.set(instance.state.open)
    })
    this.isOpen.set(instance.state.open)
  }
}

@Directive({
  selector: '[fc-tooltip-trigger]',
  standalone: true,
  host: {
    '[attr.aria-describedby]': 'describedBy',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
  },
})
export class TooltipTrigger {
  private readonly ctx = injectTooltip()
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement

  constructor() {
    this.ctx.setTriggerEl(this.host)
  }

  get describedBy(): string | undefined {
    return this.ctx.triggerProps()?.['aria-describedby']
  }

  onMouseEnter(): void {
    this.ctx.triggerProps()?.onMouseEnter()
  }

  onMouseLeave(): void {
    this.ctx.triggerProps()?.onMouseLeave()
  }

  onFocus(): void {
    this.ctx.triggerProps()?.onFocus()
  }

  onBlur(): void {
    this.ctx.triggerProps()?.onBlur()
  }
}

@Component({
  selector: '[fc-tooltip-content]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-tooltip__content',
    '[attr.role]': '"tooltip"',
    '[attr.id]': 'ctx.contentId()',
    '[attr.data-state]': 'ctx.isOpen() ? "open" : "closed"',
    '[attr.hidden]': 'ctx.isOpen() ? null : ""',
  },
})
export class TooltipContent {
  protected readonly ctx = injectTooltip()

  constructor() {
    const el = inject(ElementRef<HTMLElement>).nativeElement
    this.ctx.setContentEl(el)
    attachToBody(el)
  }
}
