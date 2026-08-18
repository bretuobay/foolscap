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
  createNavigation,
  type Navigation as NavigationMachine,
  type NavigationItem,
} from '@web-loom/foolscap-core'
import { injectMachine } from '../bindings/inject-machine'
import { injectStableCallback } from '../bindings/inject-stable-callback'

export type { NavigationItem }

export const NAVIGATION = new InjectionToken<NavigationRoot>('fc-navigation')

function injectNavigation(): NavigationRoot {
  const ctx = inject(NAVIGATION, { optional: true })
  if (!ctx) throw new Error('Navigation components must be used inside NavigationRoot')
  return ctx
}

export interface NavigationRootProps {
  items: NavigationItem[]
  label?: string
  orientation?: 'horizontal' | 'vertical'
}

@Component({
  selector: 'button[fc-navigation-toggle]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="fc-navigation__icon" aria-hidden="true">☰</span>`,
  host: {
    class: 'fc-navigation__toggle',
    '[attr.type]': 'toggleProps.type',
    '[attr.aria-expanded]': 'toggleProps["aria-expanded"]',
    '[attr.aria-controls]': 'toggleProps["aria-controls"]',
    '[attr.aria-label]': 'ariaLabel ?? toggleProps["aria-label"]',
    '(click)': 'toggleProps.onClick()',
    '(keydown)': 'toggleProps.onKeyDown($event)',
  },
})
export class NavigationToggle {
  private readonly ctx = injectNavigation()

  @Input('aria-label') ariaLabel?: string

  get toggleProps() {
    return this.ctx.machine.getToggleProps()
  }
}

@Component({
  selector: 'ul[fc-navigation-list]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (item of ctx.items; track $index; let parentIndex = $index) {
      <li class="fc-navigation__item" [attr.data-state]="itemProps(parentIndex)['data-state']">
        @if (item.children?.length) {
          <button
            type="button"
            class="fc-navigation__trigger"
            [attr.aria-expanded]="triggerProps(parentIndex)['aria-expanded']"
            [attr.aria-controls]="triggerProps(parentIndex)['aria-controls']"
            (click)="triggerProps(parentIndex).onClick()"
            (keydown)="triggerProps(parentIndex).onKeyDown($event)"
          >
            {{ item.label }}
            <span class="fc-navigation__trigger-icon" aria-hidden="true">▾</span>
          </button>
          <ul
            class="fc-navigation__submenu"
            [attr.id]="submenuProps(parentIndex).id"
            [attr.hidden]="submenuProps(parentIndex).hidden ? '' : null"
            (keydown)="submenuProps(parentIndex).onKeyDown($event)"
          >
            @for (child of item.children; track child.href; let childIndex = $index) {
              <li class="fc-navigation__submenu-item">
                <a
                  class="fc-navigation__submenu-link"
                  [href]="submenuLinkProps(parentIndex, childIndex).href"
                  [attr.aria-current]="submenuLinkProps(parentIndex, childIndex)['aria-current']"
                  (keydown)="submenuLinkProps(parentIndex, childIndex).onKeyDown($event)"
                >
                  {{ child.label }}
                </a>
              </li>
            }
          </ul>
        } @else {
          <a
            class="fc-navigation__link"
            [href]="linkProps(parentIndex).href"
            [attr.aria-current]="linkProps(parentIndex)['aria-current']"
          >
            {{ item.label }}
          </a>
        }
      </li>
    }
  `,
  host: {
    class: 'fc-navigation__list',
    '[attr.id]': 'listProps.id',
    '[attr.hidden]': 'listProps.hidden ? "" : null',
  },
})
export class NavigationList {
  readonly ctx = injectNavigation()
  private readonly el = inject(ElementRef<HTMLUListElement>)

  constructor() {
    afterNextRender(() => {
      const items = this.el.nativeElement.querySelectorAll(':scope > .fc-navigation__item')
      items.forEach((li: Element, index: number) => {
        const btn = li.querySelector('.fc-navigation__trigger')
        this.ctx.machine.setTriggerEl(index, btn instanceof HTMLButtonElement ? btn : null)
        li.querySelectorAll('.fc-navigation__submenu-link').forEach((anchor: Element, childIndex: number) => {
          this.ctx.machine.setSubmenuLinkEl(
            index,
            childIndex,
            anchor instanceof HTMLAnchorElement ? anchor : null,
          )
        })
      })
    })
  }

  get listProps() {
    return this.ctx.machine.getListProps()
  }

  itemProps(index: number) {
    return this.ctx.machine.getItemProps(index)
  }

  linkProps(index: number) {
    return this.ctx.machine.getLinkProps(index)
  }

  triggerProps(index: number) {
    return this.ctx.machine.getTriggerProps(index)
  }

  submenuProps(index: number) {
    return this.ctx.machine.getSubmenuProps(index)
  }

  submenuLinkProps(parentIndex: number, childIndex: number) {
    return this.ctx.machine.getSubmenuLinkProps(parentIndex, childIndex)
  }
}

@Component({
  selector: 'nav[fc-navigation], fc-navigation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavigationToggle, NavigationList],
  template: `
    <button fc-navigation-toggle></button>
    <ul fc-navigation-list></ul>
  `,
  host: {
    class: 'fc-navigation',
    '[attr.aria-label]': 'label',
    '[attr.data-state]': 'expanded() ? "expanded" : "collapsed"',
    '[attr.data-orientation]': 'orientation',
    '[attr.role]': '"navigation"',
  },
  providers: [{ provide: NAVIGATION, useExisting: NavigationRoot }],
})
export class NavigationRoot implements OnInit {
  private readonly host = inject(ElementRef<HTMLElement>)
  private readonly injector = inject(Injector)

  @Input({ required: true }) items: NavigationItem[] = []
  @Input() label = 'Main navigation'
  @Input() orientation: NonNullable<NavigationRootProps['orientation']> = 'horizontal'
  @Output() toggle = new EventEmitter<{ index: number | null; isOpen: boolean }>()
  @Output() mobileToggle = new EventEmitter<{ isExpanded: boolean }>()

  private readonly onToggle = injectStableCallback(
    () => (detail: { index: number | null; isOpen: boolean }) => this.toggle.emit(detail),
  )
  private readonly onMobileToggle = injectStableCallback(
    () => (detail: { isExpanded: boolean }) => this.mobileToggle.emit(detail),
  )

  machine!: NavigationMachine
  readonly expanded = signal(false)

  ngOnInit(): void {
    const getItems = () => this.items
    const getLabel = () => this.label
    const getOrientation = () => this.orientation
    this.machine = runInInjectionContext(this.injector, () =>
      injectMachine(() =>
        createNavigation({
          get items() {
            return getItems()
          },
          get label() {
            return getLabel()
          },
          get orientation() {
            return getOrientation()
          },
          onToggle: this.onToggle,
          onMobileToggle: this.onMobileToggle,
        }),
      ),
    )
    this.machine.setRootEl(this.host.nativeElement)
    this.sync()
    this.machine.subscribe(() => this.sync())
  }

  private sync(): void {
    this.expanded.set(this.machine.getRootProps()['data-state'] === 'expanded')
  }
}
