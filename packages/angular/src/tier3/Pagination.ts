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
  createPagination,
  type Pagination as PaginationMachine,
  type PaginationPage,
} from '@web-loom/foolscap-core'
import { injectMachine } from '../bindings/inject-machine'
import { injectStableCallback } from '../bindings/inject-stable-callback'

export type { PaginationPage }

export const PAGINATION = new InjectionToken<PaginationRoot>('fc-pagination')

function injectPagination(): PaginationRoot {
  const ctx = inject(PAGINATION, { optional: true })
  if (!ctx) throw new Error('Pagination components must be used inside PaginationRoot')
  return ctx
}

export interface PaginationRootProps {
  totalPages: number
  page?: number
  defaultPage?: number
  siblingCount?: number
  getPageHref?: (page: number) => string
  size?: 'sm' | 'md' | 'lg'
}

export interface PaginationPageLinkProps {
  page: number
}

@Component({
  selector: 'button[fc-pagination-prev]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-pagination__prev',
    '[attr.type]': 'prevProps.type',
    '[attr.aria-label]': 'ariaLabel ?? prevProps["aria-label"]',
    '[attr.aria-disabled]': 'prevProps["aria-disabled"]',
    '[attr.data-state]': 'prevProps["data-state"]',
    '[disabled]': 'prevProps.disabled',
    '(click)': 'onClick()',
  },
})
export class PaginationPrev {
  private readonly ctx = injectPagination()

  @Input('aria-label') ariaLabel?: string

  get prevProps() {
    return this.ctx.machine.getPrevProps()
  }

  onClick(): void {
    this.ctx.machine.getPrevProps().onClick()
  }
}

@Component({
  selector: 'button[fc-pagination-next]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-pagination__next',
    '[attr.type]': 'nextProps.type',
    '[attr.aria-label]': 'ariaLabel ?? nextProps["aria-label"]',
    '[attr.aria-disabled]': 'nextProps["aria-disabled"]',
    '[attr.data-state]': 'nextProps["data-state"]',
    '[disabled]': 'nextProps.disabled',
    '(click)': 'onClick()',
  },
})
export class PaginationNext {
  private readonly ctx = injectPagination()

  @Input('aria-label') ariaLabel?: string

  get nextProps() {
    return this.ctx.machine.getNextProps()
  }

  onClick(): void {
    this.ctx.machine.getNextProps().onClick()
  }
}

@Component({
  selector: '[fc-pagination-page-link]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-pagination__link',
    '[attr.href]': 'href',
    '[attr.type]': 'href ? null : linkProps.type',
    '[attr.aria-label]': 'linkProps["aria-label"]',
    '[attr.aria-current]': 'linkProps["aria-current"]',
    '(click)': 'onClick()',
  },
})
export class PaginationPageLink {
  private readonly ctx = injectPagination()

  @Input({ required: true }) page!: number

  get linkProps() {
    return this.ctx.machine.getLinkProps(this.page)
  }

  get href(): string | null {
    return this.ctx.getPageHref?.(this.page) ?? null
  }

  onClick(): void {
    this.ctx.machine.getLinkProps(this.page).onClick()
  }
}

@Component({
  selector: '[fc-pagination-ellipsis]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-pagination__ellipsis',
    '[attr.aria-hidden]': 'true',
  },
})
export class PaginationEllipsis {
  readonly kind = 'ellipsis'
}

@Component({
  selector: 'ol[fc-pagination-list]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PaginationPrev, PaginationNext, PaginationPageLink, PaginationEllipsis],
  template: `
    <li class="fc-pagination__item">
      <button fc-pagination-prev>‹ Prev</button>
    </li>
    @for (page of ctx.pages(); track $index) {
      <li class="fc-pagination__item">
        @if (page === 'ellipsis') {
          <span fc-pagination-ellipsis>…</span>
        } @else if (ctx.getPageHref) {
          <a fc-pagination-page-link [page]="page">{{ page }}</a>
        } @else {
          <button fc-pagination-page-link [page]="page">{{ page }}</button>
        }
      </li>
    }
    <li class="fc-pagination__item">
      <button fc-pagination-next>Next ›</button>
    </li>
  `,
  host: {
    class: 'fc-pagination__list',
  },
})
export class PaginationList {
  readonly ctx = injectPagination()
}

@Component({
  selector: 'nav[fc-pagination], fc-pagination',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PaginationList],
  template: `<ol fc-pagination-list></ol>`,
  host: {
    class: 'fc-pagination',
    '[attr.aria-label]': 'ariaLabel ?? "Pagination"',
    '[attr.data-size]': 'size',
    '[attr.role]': '"navigation"',
  },
  providers: [{ provide: PAGINATION, useExisting: PaginationRoot }],
})
export class PaginationRoot implements OnInit {
  private readonly host = inject(ElementRef<HTMLElement>)
  private readonly injector = inject(Injector)

  @Input({ required: true }) totalPages = 1
  @Input() page?: number
  @Input() defaultPage?: number
  @Input() siblingCount?: number
  @Input() getPageHref?: (page: number) => string
  @Input() size?: PaginationRootProps['size']
  @Input('aria-label') ariaLabel?: string
  @Output() pageChange = new EventEmitter<number>()

  private readonly onPageChange = injectStableCallback(
    () => (next: number) => this.pageChange.emit(next),
  )

  machine!: PaginationMachine
  readonly pages = signal<PaginationPage[]>([])
  readonly currentPage = signal(1)

  ngOnInit(): void {
    const getTotalPages = () => this.totalPages
    const getPage = () => this.page
    const getSiblingCount = () => this.siblingCount
    this.machine = runInInjectionContext(this.injector, () =>
      injectMachine(() =>
        createPagination({
          get totalPages() {
            return getTotalPages()
          },
          get page() {
            return getPage()
          },
          defaultPage: this.defaultPage,
          get siblingCount() {
            return getSiblingCount()
          },
          onPageChange: this.onPageChange,
        }),
      ),
    )
    this.machine.setRootEl(this.host.nativeElement)
    this.sync()
    this.machine.subscribe(() => this.sync())
  }

  private sync(): void {
    this.pages.set([...this.machine.state.pages])
    this.currentPage.set(this.machine.state.currentPage)
  }
}
