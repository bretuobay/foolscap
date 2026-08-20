import {
  afterNextRender,
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
  createDropdownMenu,
  type DropdownMenu as DropdownMenuMachine,
  type DropdownMenuItem,
} from '@web-loom/foolscap-core'
import { injectMachine } from '../bindings/inject-machine'
import { injectStableCallback } from '../bindings/inject-stable-callback'

export type { DropdownMenuItem }

export const DROPDOWN_MENU = new InjectionToken<DropdownMenuRoot>('fc-dropdown-menu')

function injectDropdownMenu(): DropdownMenuRoot {
  const ctx = inject(DROPDOWN_MENU, { optional: true })
  if (!ctx) {
    throw new Error('DropdownMenuTrigger and DropdownMenuContent must be used inside DropdownMenuRoot')
  }
  return ctx
}

export interface DropdownMenuRootProps {
  items: DropdownMenuItem[]
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
}

@Component({
  selector: 'fc-dropdown-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-dropdown-menu',
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
  },
  providers: [{ provide: DROPDOWN_MENU, useExisting: DropdownMenuRoot }],
})
export class DropdownMenuRoot implements OnInit {
  @Input({ required: true }) items: DropdownMenuItem[] = []
  @Input() placement?: DropdownMenuRootProps['placement']
  @Output() select = new EventEmitter<DropdownMenuItem>()
  @Output() openChange = new EventEmitter<boolean>()

  private readonly injector = inject(Injector)
  private readonly onSelect = injectStableCallback(
    () => (item: DropdownMenuItem) => this.select.emit(item),
  )
  private readonly onOpenChange = injectStableCallback(
    () => (open: boolean) => this.openChange.emit(open),
  )

  machine!: DropdownMenuMachine
  readonly isOpen = signal(false)

  ngOnInit(): void {
    const getItems = () => this.items
    const getPlacement = () => this.placement
    this.machine = runInInjectionContext(this.injector, () =>
      injectMachine(() =>
        createDropdownMenu({
          get items() {
            return getItems()
          },
          get placement() {
            return getPlacement()
          },
          onSelect: this.onSelect,
          onOpenChange: this.onOpenChange,
        }),
      ),
    )
    this.syncOpen()
    this.machine.subscribe(() => this.syncOpen())
  }

  setTriggerEl(el: HTMLButtonElement | null): void {
    this.machine.setTriggerEl(el)
  }

  setMenuEl(el: HTMLUListElement | null): void {
    this.machine.setMenuEl(el)
  }

  setItemEl(index: number, el: HTMLLIElement | null): void {
    this.machine.setItemEl(index, el)
  }

  private syncOpen(): void {
    this.isOpen.set(this.machine.state.isOpen)
  }
}

@Component({
  selector: 'button[fc-dropdown-menu-trigger]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-dropdown-menu__trigger',
    '[attr.type]': '"button"',
    '[attr.aria-haspopup]': 'triggerProps["aria-haspopup"]',
    '[attr.aria-expanded]': 'triggerProps["aria-expanded"]',
    '[attr.aria-controls]': 'triggerProps["aria-controls"]',
    '(click)': 'onClick()',
    '(keydown)': 'onKeyDown($event)',
  },
})
export class DropdownMenuTrigger implements OnInit {
  private readonly ctx = injectDropdownMenu()
  private readonly el = inject(ElementRef<HTMLButtonElement>)

  ngOnInit(): void {
    this.ctx.setTriggerEl(this.el.nativeElement)
  }

  get triggerProps() {
    void this.ctx.isOpen()
    return this.ctx.machine.getTriggerProps()
  }

  onClick(): void {
    this.ctx.machine.getTriggerProps().onClick()
  }

  onKeyDown(event: KeyboardEvent): void {
    this.ctx.machine.getTriggerProps().onKeyDown(event)
  }
}

@Component({
  selector: 'ul[fc-dropdown-menu-content]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (item of items; track $index) {
      @if (item.separator) {
        <li
          class="fc-dropdown-menu__separator"
          [attr.role]="separatorProps.role"
          [attr.aria-orientation]="separatorProps['aria-orientation']"
        ></li>
      } @else {
        <li
          class="fc-dropdown-menu__item"
          [attr.id]="itemProps($index).id"
          [attr.role]="itemProps($index).role"
          [attr.tabindex]="itemProps($index).tabIndex"
          [attr.aria-disabled]="itemProps($index)['aria-disabled']"
          [attr.data-state]="itemProps($index)['data-state']"
          [attr.data-value]="item.value"
          (click)="itemProps($index).onClick()"
          (mousemove)="itemProps($index).onMouseMove()"
        >
          <span class="fc-dropdown-menu__item-label">{{ item.label }}</span>
        </li>
      }
    }
  `,
  host: {
    class: 'fc-dropdown-menu__menu',
    '[attr.id]': 'menuProps.id',
    '[attr.role]': 'menuProps.role',
    '[attr.hidden]': 'menuProps.hidden ? "" : null',
    '(keydown)': 'onKeyDown($event)',
  },
})
export class DropdownMenuContent implements OnInit {
  private readonly ctx = injectDropdownMenu()
  private readonly el = inject(ElementRef<HTMLUListElement>)

  constructor() {
    afterNextRender(() => this.registerItemEls())
  }

  ngOnInit(): void {
    this.ctx.setMenuEl(this.el.nativeElement)
  }

  private registerItemEls(): void {
    this.items.forEach((item, index) => {
      if (item.separator) return
      const node = this.el.nativeElement.querySelector(`[data-value="${item.value}"]`)
      this.ctx.setItemEl(index, node instanceof HTMLLIElement ? node : null)
    })
  }

  get items(): DropdownMenuItem[] {
    return this.ctx.items
  }

  get menuProps() {
    void this.ctx.isOpen()
    return this.ctx.machine.getMenuProps()
  }

  get separatorProps() {
    return this.ctx.machine.getSeparatorProps()
  }

  itemProps(index: number) {
    return this.ctx.machine.getItemProps(index)
  }

  onKeyDown(event: KeyboardEvent): void {
    this.ctx.machine.getMenuProps().onKeyDown(event)
  }
}

@Component({
  selector: 'li[fc-dropdown-menu-separator]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    class: 'fc-dropdown-menu__separator',
    '[attr.role]': 'separatorProps.role',
    '[attr.aria-orientation]': 'separatorProps["aria-orientation"]',
  },
})
export class DropdownMenuSeparator {
  private readonly ctx = injectDropdownMenu()

  get separatorProps() {
    return this.ctx.machine.getSeparatorProps()
  }
}
