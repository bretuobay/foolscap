import {
  type AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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
import { createAccordion, type Accordion } from '@web-loom/foolscap-core'
import { injectMachine } from '../bindings/inject-machine'
import { injectStableCallback } from '../bindings/inject-stable-callback'

export interface AccordionContext {
  machine: Accordion
  valueState: ReturnType<typeof signal<string | string[]>>
}

export const ACCORDION = new InjectionToken<AccordionRoot>('fc-accordion')

export interface AccordionRootProps {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
}

@Component({
  selector: 'fc-accordion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-accordion',
    '[attr.data-type]': 'type',
  },
  providers: [{ provide: ACCORDION, useExisting: AccordionRoot }],
})
export class AccordionRoot implements OnInit, AccordionContext {
  @Input() type: NonNullable<AccordionRootProps['type']> = 'single'
  @Input() defaultValue?: string | string[]
  @Output() valueChange = new EventEmitter<string | string[]>()

  private readonly injector = inject(Injector)
  private readonly onValueChange = injectStableCallback(
    () => (value: string | string[]) => this.valueChange.emit(value),
  )

  machine!: Accordion
  readonly valueState = signal<string | string[]>('')

  ngOnInit(): void {
    this.machine = runInInjectionContext(this.injector, () =>
      injectMachine(() =>
        createAccordion({
          type: this.type,
          defaultValue: this.defaultValue,
          onValueChange: this.onValueChange,
        }),
      ),
    )
    this.valueState.set(this.machine.state.value)
    this.machine.subscribe(() => {
      this.valueState.set(this.machine.state.value)
    })
  }
}

function injectAccordion(): AccordionRoot {
  const ctx = inject(ACCORDION, { optional: true })
  if (!ctx) throw new Error('AccordionItem must be used inside AccordionRoot')
  return ctx
}

export interface AccordionItemProps {
  value: string
}

@Component({
  selector: 'details[fc-accordion-item]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-accordion__item',
    '[attr.data-state]': 'isOpen ? "open" : "closed"',
  },
})
export class AccordionItem implements AfterViewInit, AccordionItemProps {
  private readonly el = inject(ElementRef<HTMLDetailsElement>)
  private readonly ctx = injectAccordion()
  private unregister?: () => void

  @Input({ required: true }) value!: string

  constructor() {
    inject(DestroyRef).onDestroy(() => this.unregister?.())
  }

  ngAfterViewInit(): void {
    this.unregister = this.ctx.machine.register({
      value: this.value,
      detailsEl: this.el.nativeElement,
    })
  }

  get isOpen(): boolean {
    const stateValue = this.ctx.valueState()
    return Array.isArray(stateValue) ? stateValue.includes(this.value) : stateValue === this.value
  }
}

@Component({
  selector: 'summary[fc-accordion-trigger]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-accordion__trigger',
  },
})
export class AccordionTrigger {
  readonly role = 'trigger'
}

@Component({
  selector: '[fc-accordion-panel]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-accordion__panel',
  },
})
export class AccordionPanel {
  readonly role = 'panel'
}
