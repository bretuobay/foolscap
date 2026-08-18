import {
  ChangeDetectionStrategy,
  Component,
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
import { createTabs, type Tabs } from '@web-loom/foolscap-core'
import { injectMachine } from '../bindings/inject-machine'
import { injectStableCallback } from '../bindings/inject-stable-callback'

export const TABS = new InjectionToken<TabsRoot>('fc-tabs')

export interface TabsRootProps {
  defaultValue?: string
  value?: string
  activationMode?: 'automatic' | 'manual'
  orientation?: 'horizontal' | 'vertical'
  variant?: 'underline' | 'contained'
  loop?: boolean
}

export interface TabProps {
  value: string
  disabled?: boolean
}

export interface TabPanelProps {
  value: string
}

@Component({
  selector: 'fc-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-tabs',
    '[attr.data-variant]': 'variant',
    '[attr.data-orientation]': 'orientation ?? "horizontal"',
  },
  providers: [{ provide: TABS, useExisting: TabsRoot }],
})
export class TabsRoot implements OnInit, OnChanges {
  @Input() defaultValue?: string
  @Input() value?: string
  @Input() activationMode?: TabsRootProps['activationMode']
  @Input() orientation?: TabsRootProps['orientation']
  @Input() variant?: TabsRootProps['variant']
  @Input() loop?: boolean
  @Output() valueChange = new EventEmitter<string>()

  private readonly injector = inject(Injector)
  private readonly onValueChange = injectStableCallback(
    () => (value: string) => this.valueChange.emit(value),
  )

  machine!: Tabs
  readonly valueState = signal('')

  ngOnInit(): void {
    const getValue = () => this.value
    this.machine = runInInjectionContext(this.injector, () =>
      injectMachine(() =>
        createTabs({
          defaultValue: this.defaultValue,
          get value() {
            return getValue()
          },
          activationMode: this.activationMode,
          orientation: this.orientation,
          loop: this.loop,
          onValueChange: this.onValueChange,
        }),
      ),
    )
    this.syncValue()
    this.machine.subscribe(() => this.syncValue())
  }

  ngOnChanges(): void {
    this.syncValue()
  }

  get selectedValue(): string {
    return this.valueState()
  }

  private syncValue(): void {
    if (this.value !== undefined) {
      this.valueState.set(this.value)
      return
    }
    if (!this.machine) return
    this.valueState.set(this.machine.state.value)
  }
}

function injectTabs(): TabsRoot {
  const ctx = inject(TABS, { optional: true })
  if (!ctx) throw new Error('Tab/TabsList/TabPanel must be used inside TabsRoot')
  return ctx
}

@Component({
  selector: '[fc-tabs-list]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-tabs__tablist',
    '[attr.role]': 'tablistProps.role',
    '[attr.aria-orientation]': 'tablistProps["aria-orientation"]',
  },
})
export class TabsList {
  private readonly ctx = injectTabs()

  get tablistProps() {
    return this.ctx.machine.getTablistProps()
  }
}

@Component({
  selector: 'button[fc-tab]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-tabs__tab',
    '[attr.type]': '"button"',
    '[attr.role]': '"tab"',
    '[attr.id]': 'tabProps.id',
    '[attr.aria-controls]': 'tabProps["aria-controls"]',
    '[attr.aria-selected]': 'isSelected',
    '[attr.tabindex]': 'isSelected ? 0 : -1',
    '[attr.data-state]': 'isSelected ? "active" : "inactive"',
    '[disabled]': 'disabled',
    '(click)': 'onClick()',
    '(keydown)': 'onKeyDown($event)',
  },
})
export class Tab {
  private readonly ctx = injectTabs()

  @Input({ required: true }) value!: string
  @Input() disabled = false

  get tabProps() {
    return this.ctx.machine.getTabProps(this.value)
  }

  get isSelected(): boolean {
    return this.ctx.selectedValue === this.value
  }

  onClick(): void {
    this.ctx.machine.getTabProps(this.value).onClick()
  }

  onKeyDown(event: KeyboardEvent): void {
    this.ctx.machine.getTabProps(this.value).onKeyDown(event)
  }
}

@Component({
  selector: '[fc-tab-panel]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-tabs__panel',
    '[attr.role]': '"tabpanel"',
    '[attr.id]': 'panelProps.id',
    '[attr.aria-labelledby]': 'panelProps["aria-labelledby"]',
    '[attr.hidden]': 'isHidden ? "" : null',
  },
})
export class TabPanel {
  private readonly ctx = injectTabs()

  @Input({ required: true }) value!: string

  get panelProps() {
    return this.ctx.machine.getPanelProps(this.value)
  }

  get isHidden(): boolean {
    return this.ctx.selectedValue !== this.value
  }
}
