import {
  type AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  InjectionToken,
  Injector,
  Input,
  type OnChanges,
  type OnInit,
  Output,
  runInInjectionContext,
  signal,
} from '@angular/core'
import { createSelect, type Select as SelectMachine, type SelectOption } from '@web-loom/foolscap-core'
import { injectMachine } from '../bindings/inject-machine'
import { injectStableCallback } from '../bindings/inject-stable-callback'
import { attachToBody } from '../utils/portal'

export type { SelectOption }

export const SELECT = new InjectionToken<SelectRoot>('fc-select')

export interface SelectRootProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  placeholder?: string
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  disabled?: boolean
  name?: string
  size?: 'sm' | 'md' | 'lg'
}

export interface SelectTriggerProps {
  placeholder?: string
  disabled?: boolean
}

@Component({
  selector: 'fc-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (name) {
      <select class="fc-select__native" [attr.name]="name" aria-hidden="true" tabindex="-1">
        <option value=""></option>
        @for (opt of options; track opt.value) {
          <option [value]="opt.value" [disabled]="!!opt.disabled" [selected]="opt.value === selectedValue">
            {{ opt.label }}
          </option>
        }
      </select>
    }
    <ng-content />
  `,
  host: {
    class: 'fc-select',
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
    '[attr.data-size]': 'size',
    '[attr.data-disabled]': 'disabled ? "" : null',
  },
  providers: [{ provide: SELECT, useExisting: SelectRoot }],
})
export class SelectRoot implements OnInit, OnChanges {
  @Input({ required: true }) options: SelectOption[] = []
  @Input() value?: string
  @Input() defaultValue?: string
  @Input() placeholder = ''
  @Input() placement?: SelectRootProps['placement']
  @Input() disabled = false
  @Input() name?: string
  @Input() size?: SelectRootProps['size']
  @Output() valueChange = new EventEmitter<string>()
  @Output() openChange = new EventEmitter<boolean>()

  private readonly injector = inject(Injector)
  private readonly onValueChange = injectStableCallback(
    () => (value: string) => this.valueChange.emit(value),
  )
  private readonly onOpenChange = injectStableCallback(
    () => (open: boolean) => this.openChange.emit(open),
  )

  machine!: SelectMachine
  readonly isOpen = signal(false)
  readonly selectedValueState = signal('')

  ngOnInit(): void {
    const getOptions = () => this.options
    const getValue = () => this.value
    const getPlacement = () => this.placement
    this.machine = runInInjectionContext(this.injector, () =>
      injectMachine(() =>
        createSelect({
          get options() {
            return getOptions()
          },
          get value() {
            return getValue()
          },
          defaultValue: this.defaultValue,
          onValueChange: this.onValueChange,
          onOpenChange: this.onOpenChange,
          get placement() {
            return getPlacement()
          },
        }),
      ),
    )
    this.syncState()
    this.machine.subscribe(() => this.syncState())
  }

  ngOnChanges(): void {
    if (this.machine) this.syncState()
  }

  get selectedValue(): string {
    return this.selectedValueState()
  }

  setTriggerEl(el: HTMLElement | null): void {
    this.machine.setTriggerEl(el)
  }

  setListboxEl(el: HTMLElement | null): void {
    this.machine.setListboxEl(el)
  }

  private syncState(): void {
    this.isOpen.set(this.machine.state.open)
    this.selectedValueState.set(this.value !== undefined ? this.value : this.machine.state.value)
  }
}

function injectSelect(): SelectRoot {
  const ctx = inject(SELECT, { optional: true })
  if (!ctx) throw new Error('SelectTrigger and SelectListbox must be used inside SelectRoot')
  return ctx
}

@Component({
  selector: 'button[fc-select-trigger]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="fc-select__trigger-value" [class.fc-select__trigger-value--placeholder]="isEmpty">
      {{ displayText }}
    </span>
    <span class="fc-select__trigger-icon" aria-hidden="true">▾</span>
  `,
  host: {
    class: 'fc-select__trigger',
    '[attr.type]': '"button"',
    '[disabled]': 'disabled',
    '[attr.role]': 'triggerProps.role',
    '[attr.tabindex]': 'triggerProps.tabIndex',
    '[attr.aria-expanded]': 'triggerProps["aria-expanded"]',
    '[attr.aria-haspopup]': 'triggerProps["aria-haspopup"]',
    '[attr.aria-controls]': 'triggerProps["aria-controls"]',
    '[attr.aria-activedescendant]': 'triggerProps["aria-activedescendant"]',
    '(click)': 'triggerProps.onClick()',
    '(keydown)': 'triggerProps.onKeyDown($event)',
  },
})
export class SelectTrigger implements AfterViewInit {
  private readonly el = inject(ElementRef<HTMLButtonElement>)
  protected readonly ctx = injectSelect()

  @Input() placeholder?: string
  @Input() disabled = false

  ngAfterViewInit(): void {
    this.ctx.setTriggerEl(this.el.nativeElement)
  }

  get triggerProps() {
    return this.ctx.machine.getTriggerProps()
  }

  get selectedLabel(): string | undefined {
    return this.ctx.options.find((opt) => opt.value === this.ctx.selectedValue)?.label
  }

  get isEmpty(): boolean {
    return !this.selectedLabel
  }

  get displayText(): string {
    return this.selectedLabel ?? this.placeholder ?? this.ctx.placeholder
  }
}

@Component({
  selector: 'div[fc-select-listbox]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (opt of ctx.options; track opt.value; let index = $index) {
      <div
        class="fc-select__option"
        [attr.id]="optionProps(opt.value, index).id"
        [attr.role]="optionProps(opt.value, index).role"
        [attr.aria-selected]="optionProps(opt.value, index)['aria-selected']"
        [attr.aria-disabled]="optionProps(opt.value, index)['aria-disabled']"
        [attr.data-highlighted]="optionProps(opt.value, index)['data-highlighted'] ? '' : null"
        [attr.data-value]="opt.value"
        (click)="optionProps(opt.value, index).onClick()"
        (mousemove)="optionProps(opt.value, index).onMouseMove()"
      >
        <span class="fc-select__option-label">{{ opt.label }}</span>
        <span class="fc-select__option-check" aria-hidden="true">{{
          ctx.selectedValue === opt.value ? '✓' : ''
        }}</span>
      </div>
    }
  `,
  host: {
    class: 'fc-select__listbox',
    '[attr.id]': 'listboxProps.id',
    '[attr.role]': 'listboxProps.role',
    '[attr.hidden]': 'listboxProps.hidden ? "" : null',
    '[attr.aria-label]': 'listboxProps["aria-label"]',
    '(keydown)': 'listboxProps.onKeyDown($event)',
  },
})
export class SelectListbox implements AfterViewInit {
  private readonly el = inject(ElementRef<HTMLElement>)
  protected readonly ctx = injectSelect()

  constructor() {
    attachToBody(this.el.nativeElement)
  }

  ngAfterViewInit(): void {
    this.ctx.setListboxEl(this.el.nativeElement)
  }

  get listboxProps() {
    return this.ctx.machine.getListboxProps()
  }

  optionProps(value: string, index: number) {
    return this.ctx.machine.getOptionProps(value, index)
  }
}
