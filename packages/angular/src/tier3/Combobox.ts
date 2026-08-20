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
  type OnInit,
  Output,
  runInInjectionContext,
  signal,
  ViewChild,
} from '@angular/core'
import {
  createCombobox,
  type Combobox as ComboboxMachine,
  type SelectOption,
} from '@web-loom/foolscap-core'
import { injectMachine } from '../bindings/inject-machine'
import { injectStableCallback } from '../bindings/inject-stable-callback'
import { nextId } from '../utils/ids'
import { attachToBody } from '../utils/portal'

export const COMBOBOX = new InjectionToken<ComboboxRoot>('fc-combobox')

export interface ComboboxRootProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  filterFn?: (option: SelectOption, inputValue: string) => boolean
  loading?: boolean
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
}

export interface ComboboxInputProps {
  label?: string
  placeholder?: string
  disabled?: boolean
}

export interface ComboboxListboxProps {
  emptyText?: string
}

@Component({
  selector: 'fc-combobox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-combobox',
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
  },
  providers: [{ provide: COMBOBOX, useExisting: ComboboxRoot }],
})
export class ComboboxRoot implements OnInit {
  @Input({ required: true }) options: SelectOption[] = []
  @Input() value?: string
  @Input() defaultValue?: string
  @Input() filterFn?: ComboboxRootProps['filterFn']
  @Input() loading = false
  @Input() placement?: ComboboxRootProps['placement']
  @Output() valueChange = new EventEmitter<string>()
  @Output() openChange = new EventEmitter<boolean>()

  private readonly injector = inject(Injector)
  private readonly generated = nextId('fc-combobox')
  private readonly onValueChange = injectStableCallback(
    () => (value: string) => this.valueChange.emit(value),
  )
  private readonly onOpenChange = injectStableCallback(
    () => (open: boolean) => this.openChange.emit(open),
  )

  readonly inputId = `fc-combobox-input-${this.generated}`
  readonly labelId = `fc-combobox-label-${this.generated}`
  machine!: ComboboxMachine
  readonly isOpen = signal(false)
  readonly filteredOptions = signal<SelectOption[]>([])
  readonly inputValue = signal('')

  ngOnInit(): void {
    const getOptions = () => this.options
    const getValue = () => this.value
    const getFilterFn = () => this.filterFn
    const getLoading = () => this.loading
    const getPlacement = () => this.placement
    this.machine = runInInjectionContext(this.injector, () =>
      injectMachine(() =>
        createCombobox({
          get options() {
            return getOptions()
          },
          get value() {
            return getValue()
          },
          defaultValue: this.defaultValue,
          get filterFn() {
            return getFilterFn()
          },
          get loading() {
            return getLoading()
          },
          get placement() {
            return getPlacement()
          },
          onValueChange: this.onValueChange,
          onOpenChange: this.onOpenChange,
        }),
      ),
    )
    this.syncState()
    this.machine.subscribe(() => this.syncState())
  }

  setInputEl(el: HTMLElement | null): void {
    this.machine.setInputEl(el)
  }

  setListboxEl(el: HTMLElement | null): void {
    this.machine.setListboxEl(el)
  }

  private syncState(): void {
    this.isOpen.set(this.machine.state.open)
    this.filteredOptions.set([...this.machine.state.filteredOptions])
    this.inputValue.set(this.machine.state.inputValue)
  }
}

function injectCombobox(): ComboboxRoot {
  const ctx = inject(COMBOBOX, { optional: true })
  if (!ctx) throw new Error('ComboboxInput and ComboboxListbox must be used inside ComboboxRoot')
  return ctx
}

@Component({
  selector: 'fc-combobox-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (label) {
      <label [id]="ctx.labelId" [attr.for]="ctx.inputId" class="fc-combobox__label">{{ label }}</label>
    }
    <div class="fc-combobox__input-wrapper">
      <input
        #inputEl
        class="fc-combobox__input"
        [id]="ctx.inputId"
        [attr.role]="inputProps.role"
        [attr.aria-expanded]="inputProps['aria-expanded']"
        [attr.aria-haspopup]="inputProps['aria-haspopup']"
        [attr.aria-controls]="inputProps['aria-controls']"
        [attr.aria-activedescendant]="inputProps['aria-activedescendant']"
        [attr.aria-autocomplete]="inputProps['aria-autocomplete']"
        [attr.aria-labelledby]="label ? ctx.labelId : null"
        [value]="inputProps.value"
        [placeholder]="placeholder"
        [disabled]="disabled"
        autocomplete="off"
        (input)="onInput($event)"
        (keydown)="inputProps.onKeyDown($event)"
        (focus)="inputProps.onFocus()"
        (blur)="inputProps.onBlur()"
      />
      <button
        type="button"
        tabindex="-1"
        aria-label="Toggle options"
        class="fc-combobox__toggle"
        (click)="toggle()"
      >
        ▾
      </button>
    </div>
  `,
})
export class ComboboxInput implements AfterViewInit {
  @ViewChild('inputEl') private inputEl?: ElementRef<HTMLInputElement>
  protected readonly ctx = injectCombobox()

  @Input() label?: string
  @Input() placeholder?: string
  @Input() disabled = false

  ngAfterViewInit(): void {
    this.ctx.setInputEl(this.inputEl?.nativeElement ?? null)
  }

  get inputProps() {
    return this.ctx.machine.getInputProps()
  }

  onInput(event: Event): void {
    this.ctx.machine.setInputValue((event.target as HTMLInputElement).value)
  }

  toggle(): void {
    if (this.ctx.machine.state.open) this.ctx.machine.closeMenu()
    else this.ctx.machine.openMenu()
  }
}

@Component({
  selector: 'ul[fc-combobox-listbox]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (ctx.filteredOptions().length === 0) {
      <li class="fc-combobox__empty">{{ emptyText }}</li>
    } @else {
      @for (opt of ctx.filteredOptions(); track opt.value; let index = $index) {
        <li
          class="fc-combobox__option"
          [attr.id]="optionProps(opt.value, index).id"
          [attr.role]="optionProps(opt.value, index).role"
          [attr.aria-selected]="optionProps(opt.value, index)['aria-selected']"
          [attr.aria-disabled]="optionProps(opt.value, index)['aria-disabled']"
          [attr.data-highlighted]="optionProps(opt.value, index)['data-highlighted'] ? '' : null"
          [attr.data-value]="opt.value"
          (click)="optionProps(opt.value, index).onClick()"
          (mousemove)="optionProps(opt.value, index).onMouseMove()"
        >
          {{ opt.label }}
        </li>
      }
    }
  `,
  host: {
    class: 'fc-combobox__listbox',
    '[attr.id]': 'listboxProps.id',
    '[attr.role]': 'listboxProps.role',
    '[attr.hidden]': 'listboxProps.hidden ? "" : null',
    '[attr.aria-busy]': 'listboxProps["aria-busy"] ? true : null',
  },
})
export class ComboboxListbox implements AfterViewInit {
  private readonly el = inject(ElementRef<HTMLElement>)
  protected readonly ctx = injectCombobox()

  @Input() emptyText = 'No options found'

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
