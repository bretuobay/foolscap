import { Component, Input } from '@angular/core'
import type { Meta, StoryObj } from '@storybook/angular'
import {
  Button,
  FormActions,
  FormErrorSummary,
  FormFields,
  FormRoot,
  injectFormContext,
} from '@web-loom/foolscap-angular'

@Component({
  selector: 'demo-form-field',
  standalone: true,
  template: `
    <div style="display:flex;flex-direction:column;gap:0.25rem">
      <label [attr.for]="name" style="font-weight:500;font-size:0.9375rem">{{ label }}</label>
      <input
        [id]="name"
        [type]="type"
        [name]="fieldProps.name"
        [attr.aria-invalid]="fieldProps['aria-invalid']"
        [attr.aria-describedby]="fieldProps['aria-describedby']"
        (blur)="fieldProps.onBlur()"
        [style.height]="'2.5rem'"
        [style.padding]="'0 0.75rem'"
        [style.border]="fieldProps['aria-invalid'] ? '1px solid red' : '1px solid rgb(26 26 26 / 0.3)'"
        [style.border-radius]="'2px'"
        [style.font]="'inherit'"
        [style.font-size]="'0.9375rem'"
      />
      <span
        [id]="errorProps.id"
        [attr.role]="errorProps.role"
        [hidden]="errorProps.hidden"
        style="color:red;font-size:0.8125rem"
      >
        {{ errors[name] }}
      </span>
    </div>
  `,
})
class DemoField {
  private readonly form = injectFormContext()

  @Input({ required: true }) name!: string
  @Input({ required: true }) label!: string
  @Input() type = 'text'

  get fieldProps() {
    void this.form?.errors()
    return this.form?.getFieldProps(this.name) ?? {
      name: this.name,
      'aria-invalid': false,
      'aria-describedby': `${this.name}-error`,
      onBlur: () => undefined,
    }
  }

  get errorProps() {
    void this.form?.errors()
    return this.form?.getErrorProps(this.name) ?? {
      id: `${this.name}-error`,
      role: 'alert' as const,
      hidden: true,
    }
  }

  get errors() {
    return this.form?.errors() ?? {}
  }
}

@Component({
  selector: 'demo-form-default',
  standalone: true,
  imports: [FormRoot, FormErrorSummary, FormFields, FormActions, Button, DemoField],
  template: `
    <div style="max-width:400px">
      <form
        fc-form
        aria-label="Contact form"
        [fields]="fields"
        (formSubmit)="onSubmit($event)"
      >
        <div fc-form-error-summary></div>
        <div fc-form-fields>
          <demo-form-field name="name" label="Full name"></demo-form-field>
          <demo-form-field name="email" label="Email" type="email"></demo-form-field>
        </div>
        <div fc-form-actions>
          <button fc-button type="submit">Submit</button>
        </div>
      </form>
    </div>
  `,
})
class DefaultDemo {
  fields = {
    name: { required: true },
    email: {
      required: true,
      validate: (value: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Enter a valid email address',
    },
  }

  async onSubmit(values: Record<string, string>): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    alert(`Submitted:\n${JSON.stringify(values, null, 2)}`)
  }
}

@Component({
  selector: 'demo-form-validation',
  standalone: true,
  imports: [FormRoot, FormErrorSummary, FormFields, FormActions, Button, DemoField],
  template: `
    <div style="max-width:400px">
      <form
        fc-form
        aria-label="Registration form"
        [fields]="fields"
        (formSubmit)="onSubmit($event)"
      >
        <div fc-form-error-summary heading="Fix these issues before submitting:"></div>
        <div fc-form-fields>
          <demo-form-field name="username" label="Username"></demo-form-field>
          <demo-form-field name="password" label="Password" type="password"></demo-form-field>
        </div>
        <div fc-form-actions>
          <button fc-button variant="ghost" type="reset">Reset</button>
          <button fc-button type="submit">Register</button>
        </div>
      </form>
      <p style="margin-top:0.75rem;font-size:0.875rem;color:var(--fc-ink-muted, #666)">
        Tab through fields and leave them empty to trigger validation errors.
      </p>
    </div>
  `,
})
class ValidationDemo {
  fields = {
    username: {
      required: true,
      validate: (value: string) => (value.length < 3 ? 'Username must be at least 3 characters' : null),
    },
    password: {
      required: true,
      validate: (value: string) => (value.length < 8 ? 'Password must be at least 8 characters' : null),
    },
  }

  onSubmit(values: Record<string, string>): void {
    alert(`Registered as "${values.username}"`)
  }
}

const meta = {
  title: 'Tier 2/Form',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [DefaultDemo] },
    template: `<demo-form-default></demo-form-default>`,
  }),
}

export const WithValidation: Story = {
  name: 'Validation on blur',
  render: () => ({
    moduleMetadata: { imports: [ValidationDemo] },
    template: `<demo-form-validation></demo-form-validation>`,
  }),
}
