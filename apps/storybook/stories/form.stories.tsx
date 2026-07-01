import { useRef } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
  FormRoot,
  FormFields,
  FormErrorSummary,
  FormActions,
  useFormContext,
  Button,
} from '@web-loom/foolscap-react'

const meta = {
  title: 'React/Form',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

// ─── Field helper ─────────────────────────────────────────────────────────────
// Demonstrates consuming useFormContext to get field/error props from within the form

function Field({ name, label, type = 'text' }: { name: string; label: string; type?: string }) {
  const { machine } = useFormContext()
  const fieldProps = machine?.getFieldProps(name) ?? { name, 'aria-invalid': false, 'aria-describedby': `${name}-error`, onBlur: () => {} }
  const errorProps = machine?.getErrorProps(name) ?? { id: `${name}-error`, role: 'alert' as const, hidden: true }
  const errors = machine?.state.errors ?? {}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <label htmlFor={name} style={{ fontWeight: 500, fontSize: '0.9375rem' }}>
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={fieldProps.name}
        aria-invalid={fieldProps['aria-invalid']}
        aria-describedby={fieldProps['aria-describedby']}
        onBlur={fieldProps.onBlur}
        style={{
          height: '2.5rem',
          padding: '0 0.75rem',
          border: `1px solid ${fieldProps['aria-invalid'] ? 'red' : 'rgb(26 26 26 / 0.3)'}`,
          borderRadius: '2px',
          font: 'inherit',
          fontSize: '0.9375rem',
        }}
      />
      <span
        id={errorProps.id}
        role={errorProps.role}
        hidden={errorProps.hidden}
        style={{ color: 'red', fontSize: '0.8125rem' }}
      >
        {errors[name]}
      </span>
    </div>
  )
}

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: function DefaultDemo() {
    const handleSubmit = async (values: Record<string, string>) => {
      await new Promise((r) => setTimeout(r, 800))
      alert(`Submitted:\n${JSON.stringify(values, null, 2)}`)
    }

    return (
      <div style={{ maxWidth: '400px' }}>
        <FormRoot
          aria-label="Contact form"
          fields={{
            name: { required: true },
            email: {
              required: true,
              validate: (v) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Enter a valid email address',
            },
          }}
          onSubmit={handleSubmit}
        >
          <FormErrorSummary />
          <FormFields>
            <Field name="name" label="Full name" />
            <Field name="email" label="Email" type="email" />
          </FormFields>
          <FormActions>
            <Button type="submit">Submit</Button>
          </FormActions>
        </FormRoot>
      </div>
    )
  },
}

// ─── Pre-filled ───────────────────────────────────────────────────────────────

export const WithValidation: Story = {
  name: 'Validation on blur',
  render: function ValidationDemo() {
    return (
      <div style={{ maxWidth: '400px' }}>
        <FormRoot
          aria-label="Registration form"
          fields={{
            username: {
              required: true,
              validate: (v) =>
                v.length < 3 ? 'Username must be at least 3 characters' : null,
            },
            password: {
              required: true,
              validate: (v) =>
                v.length < 8 ? 'Password must be at least 8 characters' : null,
            },
          }}
          onSubmit={async (values) => {
            alert(`Registered as "${values.username}"`)
          }}
        >
          <FormErrorSummary heading="Fix these issues before submitting:" />
          <FormFields>
            <Field name="username" label="Username" />
            <Field name="password" label="Password" type="password" />
          </FormFields>
          <FormActions>
            <Button variant="ghost" type="reset">Reset</Button>
            <Button type="submit">Register</Button>
          </FormActions>
        </FormRoot>
        <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--fc-ink-muted, #666)' }}>
          Tab through fields and leave them empty to trigger validation errors.
        </p>
      </div>
    )
  },
}
