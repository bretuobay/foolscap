import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h } from 'vue'
import {
  FormRoot,
  FormFields,
  FormErrorSummary,
  FormActions,
  useFormContext,
  Button,
} from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 2/Form',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

const Field = defineComponent({
  props: {
    name: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, default: 'text' },
  },
  setup(props) {
    const { machine } = useFormContext()

    return () => {
      void machine.value?.state
      const fieldProps = machine.value?.getFieldProps(props.name) ?? {
        name: props.name,
        'aria-invalid': false,
        'aria-describedby': `${props.name}-error`,
        onBlur: () => {},
      }
      const errorProps = machine.value?.getErrorProps(props.name) ?? {
        id: `${props.name}-error`,
        role: 'alert' as const,
        hidden: true,
      }
      const errors = machine.value?.state.errors ?? {}

      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '0.25rem' } }, [
        h('label', { for: props.name, style: { fontWeight: 500, fontSize: '0.9375rem' } }, props.label),
        h('input', {
          id: props.name,
          type: props.type,
          name: fieldProps.name,
          'aria-invalid': fieldProps['aria-invalid'],
          'aria-describedby': fieldProps['aria-describedby'],
          onBlur: fieldProps.onBlur,
          style: {
            height: '2.5rem',
            padding: '0 0.75rem',
            border: `1px solid ${fieldProps['aria-invalid'] ? 'red' : 'rgb(26 26 26 / 0.3)'}`,
            borderRadius: '2px',
            font: 'inherit',
            fontSize: '0.9375rem',
          },
        }),
        h(
          'span',
          {
            id: errorProps.id,
            role: errorProps.role,
            hidden: errorProps.hidden,
            style: { color: 'red', fontSize: '0.8125rem' },
          },
          errors[props.name],
        ),
      ])
    }
  },
})

const DefaultDemo = defineComponent({
  setup() {
    const handleSubmit = async (values: Record<string, string>) => {
      await new Promise((r) => setTimeout(r, 800))
      alert(`Submitted:\n${JSON.stringify(values, null, 2)}`)
    }

    return () =>
      h('div', { style: { maxWidth: '400px' } }, [
        h(
          FormRoot,
          {
            'aria-label': 'Contact form',
            fields: {
              name: { required: true },
              email: {
                required: true,
                validate: (v: string) =>
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Enter a valid email address',
              },
            },
            onSubmit: handleSubmit,
          },
          {
            default: () => [
              h(FormErrorSummary),
              h(FormFields, null, {
                default: () => [
                  h(Field, { name: 'name', label: 'Full name' }),
                  h(Field, { name: 'email', label: 'Email', type: 'email' }),
                ],
              }),
              h(FormActions, null, {
                default: () => h(Button, { type: 'submit' }, { default: () => 'Submit' }),
              }),
            ],
          },
        ),
      ])
  },
})

export const Default: Story = {
  render: renderStory(() => h(DefaultDemo)),
}

const ValidationDemo = defineComponent({
  setup() {
    return () =>
      h('div', { style: { maxWidth: '400px' } }, [
        h(
          FormRoot,
          {
            'aria-label': 'Registration form',
            fields: {
              username: {
                required: true,
                validate: (v: string) => (v.length < 3 ? 'Username must be at least 3 characters' : null),
              },
              password: {
                required: true,
                validate: (v: string) => (v.length < 8 ? 'Password must be at least 8 characters' : null),
              },
            },
            onSubmit: async (values: Record<string, string>) => {
              alert(`Registered as "${values.username}"`)
            },
          },
          {
            default: () => [
              h(FormErrorSummary, { heading: 'Fix these issues before submitting:' }),
              h(FormFields, null, {
                default: () => [
                  h(Field, { name: 'username', label: 'Username' }),
                  h(Field, { name: 'password', label: 'Password', type: 'password' }),
                ],
              }),
              h(FormActions, null, {
                default: () => [
                  h(Button, { variant: 'ghost', type: 'reset' }, { default: () => 'Reset' }),
                  h(Button, { type: 'submit' }, { default: () => 'Register' }),
                ],
              }),
            ],
          },
        ),
        h(
          'p',
          { style: { marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--fc-ink-muted, #666)' } },
          'Tab through fields and leave them empty to trigger validation errors.',
        ),
      ])
  },
})

export const WithValidation: Story = {
  name: 'Validation on blur',
  render: renderStory(() => h(ValidationDemo)),
}
