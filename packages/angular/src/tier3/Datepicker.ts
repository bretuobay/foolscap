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
  createDatepicker,
  type Datepicker as DatepickerMachine,
  type DatepickerFirstDayOfWeek,
} from '@web-loom/foolscap-core'
import { injectMachine } from '../bindings/inject-machine'
import { injectStableCallback } from '../bindings/inject-stable-callback'

export const DATEPICKER = new InjectionToken<DatepickerRoot>('fc-datepicker')

function injectDatepicker(): DatepickerRoot {
  const ctx = inject(DATEPICKER, { optional: true })
  if (!ctx) throw new Error('Datepicker components must be used inside DatepickerRoot')
  return ctx
}

function formatDate(date: Date | null, locale: string, placeholder: string): string {
  if (!date) return placeholder
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function formatMonth(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date)
}

function weekdayLabels(locale: string, firstDayOfWeek: DatepickerFirstDayOfWeek) {
  const sunday = new Date(2026, 5, 7)
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sunday)
    date.setDate(sunday.getDate() + firstDayOfWeek + index)
    return {
      short: new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date),
      long: new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date),
    }
  })
}

export interface DatepickerRootProps {
  value?: Date | null
  defaultValue?: Date
  min?: Date
  max?: Date
  locale?: string
  firstDayOfWeek?: DatepickerFirstDayOfWeek
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  placeholder?: string
}

@Component({
  selector: 'fc-datepicker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-datepicker',
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
  },
  providers: [{ provide: DATEPICKER, useExisting: DatepickerRoot }],
})
export class DatepickerRoot implements OnInit {
  private readonly injector = inject(Injector)

  @Input() value?: Date | null
  @Input() defaultValue?: Date
  @Input() min?: Date
  @Input() max?: Date
  @Input() locale = 'en'
  @Input() firstDayOfWeek: DatepickerFirstDayOfWeek = 0
  @Input() placement?: DatepickerRootProps['placement']
  @Input() placeholder = 'Pick a date'
  @Output() valueChange = new EventEmitter<Date>()
  @Output() openChange = new EventEmitter<boolean>()

  private readonly onValueChange = injectStableCallback(
    () => (date: Date) => this.valueChange.emit(date),
  )
  private readonly onOpenChange = injectStableCallback(
    () => (open: boolean) => this.openChange.emit(open),
  )

  machine!: DatepickerMachine
  readonly isOpen = signal(false)
  readonly selectedDate = signal<Date | null>(null)
  readonly viewMonth = signal(0)
  readonly viewYear = signal(0)
  readonly weeks = signal<(Date | null)[][]>([])

  ngOnInit(): void {
    const getValue = () => this.value
    const getMin = () => this.min
    const getMax = () => this.max
    const getLocale = () => this.locale
    const getPlacement = () => this.placement
    this.machine = runInInjectionContext(this.injector, () =>
      injectMachine(() =>
        createDatepicker({
          get value() {
            return getValue()
          },
          defaultValue: this.defaultValue,
          get min() {
            return getMin()
          },
          get max() {
            return getMax()
          },
          get locale() {
            return getLocale()
          },
          firstDayOfWeek: this.firstDayOfWeek,
          get placement() {
            return getPlacement()
          },
          onValueChange: this.onValueChange,
          onOpenChange: this.onOpenChange,
        }),
      ),
    )
    this.sync()
    this.machine.subscribe(() => this.sync())
  }

  triggerLabel(): string {
    return formatDate(this.selectedDate(), this.locale, this.placeholder)
  }

  monthLabel(): string {
    return formatMonth(new Date(this.viewYear(), this.viewMonth(), 1), this.locale)
  }

  weekdayLabels() {
    return weekdayLabels(this.locale, this.firstDayOfWeek)
  }

  setTriggerEl(el: HTMLButtonElement | null): void {
    this.machine.setTriggerEl(el)
  }

  setDialogEl(el: HTMLDivElement | null): void {
    this.machine.setDialogEl(el)
  }

  setDayEl(date: Date, el: HTMLButtonElement | null): void {
    this.machine.setDayEl(date, el)
  }

  private sync(): void {
    const state = this.machine.state
    this.isOpen.set(state.isOpen)
    this.selectedDate.set(state.selectedDate)
    this.viewMonth.set(state.viewMonth)
    this.viewYear.set(state.viewYear)
    this.weeks.set(state.weeks.map((week) => [...week]))
  }
}

@Component({
  selector: 'button[fc-datepicker-trigger]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />{{ ctx.triggerLabel() }}`,
  host: {
    class: 'fc-datepicker__trigger',
    '[attr.type]': '"button"',
    '[attr.aria-haspopup]': 'triggerProps["aria-haspopup"]',
    '[attr.aria-expanded]': 'triggerProps["aria-expanded"]',
    '[attr.aria-controls]': 'triggerProps["aria-controls"]',
    '(click)': 'triggerProps.onClick()',
    '(keydown)': 'triggerProps.onKeyDown($event)',
  },
})
export class DatepickerTrigger implements OnInit {
  readonly ctx = injectDatepicker()
  private readonly el = inject(ElementRef<HTMLButtonElement>)

  ngOnInit(): void {
    this.ctx.setTriggerEl(this.el.nativeElement)
  }

  get triggerProps() {
    void this.ctx.isOpen()
    return this.ctx.machine.getTriggerProps()
  }
}

@Component({
  selector: '[fc-datepicker-dialog]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fc-datepicker__header">
      <button class="fc-datepicker__prev-month" type="button" [attr.aria-label]="prevMonthProps['aria-label']" (click)="prevMonthProps.onClick()">‹</button>
      <span class="fc-datepicker__month-label" [attr.aria-live]="monthLabelProps['aria-live']">{{ ctx.monthLabel() }}</span>
      <button class="fc-datepicker__next-month" type="button" [attr.aria-label]="nextMonthProps['aria-label']" (click)="nextMonthProps.onClick()">›</button>
    </div>
    <table class="fc-datepicker__grid" [attr.role]="gridProps.role" [attr.aria-label]="gridProps['aria-label']">
      <thead class="fc-datepicker__grid-head">
        <tr>
          @for (label of ctx.weekdayLabels(); track label.long) {
            <th scope="col" [attr.abbr]="label.long">{{ label.short }}</th>
          }
        </tr>
      </thead>
      <tbody class="fc-datepicker__grid-body">
        @for (week of ctx.weeks(); track $index; let row = $index) {
          <tr>
            @for (date of week; track $index) {
              <td
                class="fc-datepicker__gridcell"
                role="gridcell"
                [attr.data-state]="date ? null : 'outside-month'"
              >
                @if (date) {
                  <button
                    type="button"
                    class="fc-datepicker__day"
                    [attr.aria-label]="dayProps(date)['aria-label']"
                    [attr.aria-selected]="dayProps(date)['aria-selected']"
                    [attr.aria-current]="dayProps(date)['aria-current']"
                    [disabled]="dayProps(date).disabled"
                    [attr.tabindex]="dayProps(date).tabIndex"
                    (click)="dayProps(date).onClick()"
                    (keydown)="dayProps(date).onKeyDown($event)"
                  >
                    {{ date.getDate() }}
                  </button>
                }
              </td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
  host: {
    class: 'fc-datepicker__dialog',
    '[attr.id]': 'dialogProps.id',
    '[attr.role]': 'dialogProps.role',
    '[attr.aria-label]': 'dialogProps["aria-label"]',
    '[attr.aria-modal]': 'dialogProps["aria-modal"]',
    '[attr.hidden]': 'dialogProps.hidden ? "" : null',
    '(keydown)': 'dialogProps.onKeyDown($event)',
  },
})
export class DatepickerDialog implements OnInit {
  readonly ctx = injectDatepicker()
  private readonly el = inject(ElementRef<HTMLDivElement>)

  constructor() {
    afterNextRender(() => this.registerDays())
  }

  ngOnInit(): void {
    this.ctx.setDialogEl(this.el.nativeElement)
  }

  private registerDays(): void {
    this.el.nativeElement.querySelectorAll('.fc-datepicker__day').forEach((node: Element) => {
      const label = node.getAttribute('aria-label')
      const date = this.ctx
        .weeks()
        .flat()
        .find((day) => day && this.ctx.machine.getDayProps(day)['aria-label'] === label)
      if (date && node instanceof HTMLButtonElement) this.ctx.setDayEl(date, node)
    })
  }

  get dialogProps() {
    void this.ctx.isOpen()
    return this.ctx.machine.getDialogProps()
  }

  get gridProps() {
    return this.ctx.machine.getGridProps()
  }

  get prevMonthProps() {
    return this.ctx.machine.getPrevMonthProps()
  }

  get nextMonthProps() {
    return this.ctx.machine.getNextMonthProps()
  }

  get monthLabelProps() {
    return this.ctx.machine.getMonthLabelProps()
  }

  dayProps(date: Date) {
    return this.ctx.machine.getDayProps(date)
  }
}
