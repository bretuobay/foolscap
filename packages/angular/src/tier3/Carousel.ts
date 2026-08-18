import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { createCarousel, type Carousel as CarouselMachine } from '@web-loom/foolscap-core'
import { injectMachine } from '../bindings/inject-machine'
import { injectStableCallback } from '../bindings/inject-stable-callback'

export const CAROUSEL = new InjectionToken<CarouselRoot>('fc-carousel')

function injectCarousel(): CarouselRoot {
  const ctx = inject(CAROUSEL, { optional: true })
  if (!ctx) throw new Error('Carousel components must be used inside CarouselRoot')
  return ctx
}

export interface CarouselRootProps {
  slides: string[]
  label: string
  index?: number
  initialIndex?: number
  loop?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
}

export interface CarouselIndicatorProps {
  index: number
}

@Component({
  selector: 'button[fc-carousel-prev]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-carousel__prev',
    '[attr.type]': 'prevProps.type',
    '[attr.aria-label]': 'ariaLabel ?? prevProps["aria-label"]',
    '[attr.aria-disabled]': 'prevProps["aria-disabled"]',
    '[disabled]': 'prevProps.disabled',
    '(click)': 'prevProps.onClick()',
    '(keydown)': 'prevProps.onKeyDown($event)',
  },
})
export class CarouselPrev {
  private readonly ctx = injectCarousel()
  @Input('aria-label') ariaLabel?: string
  get prevProps() {
    void this.ctx.current()
    return this.ctx.machine.getPrevProps()
  }
}

@Component({
  selector: 'button[fc-carousel-next]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-carousel__next',
    '[attr.type]': 'nextProps.type',
    '[attr.aria-label]': 'ariaLabel ?? nextProps["aria-label"]',
    '[attr.aria-disabled]': 'nextProps["aria-disabled"]',
    '[disabled]': 'nextProps.disabled',
    '(click)': 'nextProps.onClick()',
    '(keydown)': 'nextProps.onKeyDown($event)',
  },
})
export class CarouselNext {
  private readonly ctx = injectCarousel()
  @Input('aria-label') ariaLabel?: string
  get nextProps() {
    void this.ctx.current()
    return this.ctx.machine.getNextProps()
  }
}

@Component({
  selector: '[fc-carousel-controls]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CarouselPrev, CarouselNext],
  template: `
    <button fc-carousel-prev>‹</button>
    <button fc-carousel-next>›</button>
  `,
  host: { class: 'fc-carousel__controls' },
})
export class CarouselControls {
  readonly kind = 'controls'
}

@Component({
  selector: 'button[fc-carousel-indicator]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-carousel__indicator',
    '[attr.type]': 'indicatorProps.type',
    '[attr.role]': 'indicatorProps.role',
    '[attr.aria-label]': 'indicatorProps["aria-label"]',
    '[attr.aria-selected]': 'indicatorProps["aria-selected"]',
    '[attr.aria-current]': 'indicatorProps["aria-current"]',
    '[attr.tabindex]': 'indicatorProps.tabIndex',
    '[attr.data-state]': 'indicatorProps["data-state"]',
    '(click)': 'indicatorProps.onClick()',
  },
})
export class CarouselIndicator {
  private readonly ctx = injectCarousel()
  private readonly cdr = inject(ChangeDetectorRef)

  @Input({ required: true }) index = 0

  constructor() {
    queueMicrotask(() => this.ctx.machine.subscribe(() => this.cdr.markForCheck()))
  }
  get indicatorProps() {
    void this.ctx.current()
    return this.ctx.machine.getIndicatorProps(this.index)
  }
}

@Component({
  selector: '[fc-carousel-indicators]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CarouselIndicator],
  template: `
    @for (slide of ctx.slides; track $index) {
      <button fc-carousel-indicator [index]="$index"></button>
    }
  `,
  host: {
    class: 'fc-carousel__indicators',
    '[attr.role]': 'indicatorsProps.role',
    '[attr.aria-label]': 'indicatorsProps["aria-label"]',
    '(keydown)': 'indicatorsProps.onKeyDown($event)',
  },
})
export class CarouselIndicators {
  readonly ctx = injectCarousel()
  get indicatorsProps() {
    return this.ctx.machine.getIndicatorsProps()
  }
}

@Component({
  selector: '[fc-carousel-viewport]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fc-carousel__track">
      @for (slide of ctx.slides; track $index) {
        <div
          class="fc-carousel__slide"
          [attr.role]="slideProps($index).role"
          [attr.aria-roledescription]="slideProps($index)['aria-roledescription']"
          [attr.aria-label]="slideProps($index)['aria-label']"
          [attr.data-state]="slideProps($index)['data-state']"
        >
          {{ slide }}
        </div>
      }
    </div>
  `,
  host: { class: 'fc-carousel__viewport' },
})
export class CarouselViewport implements OnInit {
  readonly ctx = injectCarousel()
  private readonly el = inject(ElementRef<HTMLElement>)
  private readonly cdr = inject(ChangeDetectorRef)

  ngOnInit(): void {
    this.ctx.machine.subscribe(() => this.cdr.markForCheck())
    queueMicrotask(() => {
      this.el.nativeElement.querySelectorAll('.fc-carousel__slide').forEach((node: Element, index: number) => {
        this.ctx.machine.setSlideEl(index, node instanceof HTMLDivElement ? node : null)
      })
    })
  }

  slideProps(index: number) {
    void this.ctx.current()
    return this.ctx.machine.getSlideProps(index)
  }
}

@Component({
  selector: 'section[fc-carousel], fc-carousel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CarouselViewport, CarouselControls, CarouselIndicators],
  template: `
    <div fc-carousel-viewport></div>
    <div fc-carousel-controls></div>
    <div fc-carousel-indicators></div>
  `,
  host: {
    class: 'fc-carousel',
    '[attr.role]': 'rootProps.role',
    '[attr.aria-roledescription]': 'rootProps["aria-roledescription"]',
    '[attr.aria-label]': 'label',
    '[attr.aria-live]': 'rootProps["aria-live"]',
    '[attr.data-state]': 'rootProps["data-state"]',
    '[attr.data-loop]': 'rootProps["data-loop"]',
    '[attr.data-autoplay]': 'rootProps["data-autoplay"]',
    '(mouseenter)': 'rootProps.onMouseEnter()',
    '(mouseleave)': 'rootProps.onMouseLeave()',
    '(focusin)': 'rootProps.onFocusIn()',
    '(focusout)': 'rootProps.onFocusOut()',
  },
  providers: [{ provide: CAROUSEL, useExisting: CarouselRoot }],
})
export class CarouselRoot implements OnInit {
  private readonly host = inject(ElementRef<HTMLElement>)
  private readonly injector = inject(Injector)

  @Input({ required: true }) slides: string[] = []
  @Input({ required: true }) label = ''
  @Input() index?: number
  @Input() initialIndex?: number
  @Input() loop = false
  @Input() autoPlay = false
  @Input() autoPlayInterval?: number
  @Output() slideChange = new EventEmitter<number>()

  private readonly onSlideChange = injectStableCallback(
    () => (next: number) => this.slideChange.emit(next),
  )

  machine!: CarouselMachine
  readonly current = signal(0)

  ngOnInit(): void {
    const getSlideCount = () => this.slides.length
    const getLabel = () => this.label
    const getIndex = () => this.index
    const getLoop = () => this.loop
    const getAutoPlay = () => this.autoPlay
    const getAutoPlayInterval = () => this.autoPlayInterval
    this.machine = runInInjectionContext(this.injector, () =>
      injectMachine(() =>
        createCarousel({
          get slideCount() {
            return getSlideCount()
          },
          get label() {
            return getLabel()
          },
          get index() {
            return getIndex()
          },
          initialIndex: this.initialIndex,
          get loop() {
            return getLoop()
          },
          get autoPlay() {
            return getAutoPlay()
          },
          get autoPlayInterval() {
            return getAutoPlayInterval()
          },
          onSlideChange: this.onSlideChange,
        }),
      ),
    )
    this.machine.setRootEl(this.host.nativeElement)
    this.sync()
    this.machine.subscribe(() => this.sync())
  }

  get rootProps() {
    return this.machine.getRootProps()
  }

  private sync(): void {
    this.current.set(this.machine.state.currentIndex)
  }
}
