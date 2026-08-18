import {
  type AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  InjectionToken,
  Input,
  Output,
  signal,
} from '@angular/core'
import {
  createForm,
  type FieldConfig,
  type Form as FormMachine,
  type FormOptions,
} from '@web-loom/foolscap-core'
import { injectStableCallback } from '../bindings/inject-stable-callback'

export type { FieldConfig }

export const FORM = new InjectionToken<FormRoot>('fc-form')

export interface FormRootProps {
  fields?: FormOptions['fields']
}

export interface FormErrorSummaryProps {
  heading?: string
}

@Component({
  selector: 'form[fc-form]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-form',
    '[attr.novalidate]': 'true',
    '[attr.data-state]': 'dataState()',
    '(submit)': 'onSubmit($event)',
  },
  providers: [{ provide: FORM, useExisting: FormRoot }],
})
export class FormRoot implements AfterViewInit {
  @Input() fields?: FormOptions['fields']
  @Output() formSubmit = new EventEmitter<Record<string, string>>()
  @Output() invalid = new EventEmitter<Record<string, string>>()

  private readonly el = inject(ElementRef<HTMLFormElement>)
  private readonly onSubmitCallback = injectStableCallback(
    () => (values: Record<string, string>) => this.formSubmit.emit(values),
  )
  private readonly onInvalidCallback = injectStableCallback(
    () => (errors: Record<string, string>) => this.invalid.emit(errors),
  )

  machine: FormMachine | null = null
  readonly errors = signal<Record<string, string>>({})
  readonly dataState = signal<'idle' | 'error' | 'submitting'>('idle')
  private unsubscribe?: () => void

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.unsubscribe?.()
      this.machine?.destroy()
      this.machine = null
    })
  }

  ngAfterViewInit(): void {
    const el = this.el.nativeElement
    const getFields = () => this.fields
    const instance = createForm(el, {
      get fields() {
        return getFields()
      },
      onSubmit: this.onSubmitCallback,
      onInvalid: this.onInvalidCallback,
    })
    this.machine = instance
    this.unsubscribe = instance.subscribe(() => this.syncFromMachine())
    this.syncFromMachine()
  }

  getFieldProps(name: string) {
    return (
      this.machine?.getFieldProps(name) ?? {
        name,
        'aria-invalid': false,
        'aria-describedby': `${name}-error`,
        onBlur: () => undefined,
      }
    )
  }

  getErrorProps(name: string) {
    return (
      this.machine?.getErrorProps(name) ?? {
        id: `${name}-error`,
        role: 'alert' as const,
        hidden: true,
      }
    )
  }

  onSubmit(event: Event): void {
    event.preventDefault()
    this.machine?.getFormProps().onSubmit(event as SubmitEvent)
  }

  private syncFromMachine(): void {
    const state = this.machine?.state
    if (!state) return
    this.errors.set({ ...state.errors })
    this.dataState.set(
      state.isSubmitting ? 'submitting' : Object.keys(state.errors).length > 0 ? 'error' : 'idle',
    )
  }
}

export function injectFormContext(): FormRoot | null {
  return inject(FORM, { optional: true })
}

/** Cross-framework alias matching Vue `useFormContext`. */
export const useFormContext = injectFormContext

@Component({
  selector: '[fc-form-error-summary]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p>{{ heading }}</p>
    <ul>
      @for (entry of errorEntries; track entry.name) {
        <li>
          <a [href]="'#' + entry.name">{{ entry.message }}</a>
        </li>
      }
    </ul>
  `,
  host: {
    class: 'fc-form__error-summary',
    '[attr.role]': '"alert"',
    '[attr.hidden]': 'hasErrors ? null : ""',
  },
})
export class FormErrorSummary {
  private readonly form = injectFormContext()

  @Input() heading = 'Please fix the following errors:'

  get hasErrors(): boolean {
    return Object.keys(this.form?.errors() ?? {}).length > 0
  }

  get errorEntries(): { name: string; message: string }[] {
    return Object.entries(this.form?.errors() ?? {}).map(([name, message]) => ({ name, message }))
  }
}

@Component({
  selector: '[fc-form-fields]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-form__fields',
  },
})
export class FormFields {
  readonly role = 'fields'
}

@Component({
  selector: '[fc-form-actions]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-form__actions',
  },
})
export class FormActions {
  readonly role = 'actions'
}
