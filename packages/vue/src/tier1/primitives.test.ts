import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { Alert } from './Alert'
import { Avatar, AvatarGroup } from './Avatar'
import { Badge } from './Badge'
import { Heading } from './Heading'
import { Icon } from './Icon'
import { Label } from './Label'
import { Link } from './Link'
import { Separator } from './Separator'
import { Skeleton } from './Skeleton'
import { Spinner } from './Spinner'
import { VisuallyHidden } from './VisuallyHidden'

describe('tier 1 primitives (wave 1A)', () => {
  it('renders alert live-region semantics and dismiss action', async () => {
    const onDismiss = vi.fn()
    render(Alert, {
      props: {
        variant: 'error',
        title: 'Session expired',
        description: 'Sign in again.',
        onDismiss,
      },
    })
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('fc-alert')
    expect(alert).toHaveAttribute('data-variant', 'error')
    await fireEvent.click(screen.getByRole('button', { name: 'Dismiss alert' }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('renders avatar, badge, and merges class', () => {
    render(Avatar, { props: { fallback: 'AL', size: 'lg' }, attrs: { class: 'extra-avatar' } })
    const avatar = screen.getByText('AL')
    expect(avatar).toHaveClass('fc-avatar', 'extra-avatar')
    expect(avatar).toHaveAttribute('data-size', 'lg')

    render(Badge, { props: { variant: 'subtle' }, attrs: { class: 'extra-badge' }, slots: { default: 'Beta' } })
    const badge = screen.getByText('Beta')
    expect(badge).toHaveClass('fc-badge', 'extra-badge')
    expect(badge).toHaveAttribute('data-variant', 'subtle')

    render(AvatarGroup, { attrs: { class: 'extra-group', 'data-testid': 'group' } })
    expect(screen.getByTestId('group')).toHaveClass('fc-avatar-group', 'extra-group')
  })

  it('renders typography and utility primitives', () => {
    render(Heading, { props: { level: 1 }, attrs: { class: 'extra-heading' }, slots: { default: 'Dashboard' } })
    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('fc-heading', 'extra-heading')

    render(Label, { props: { required: true }, attrs: { for: 'name', class: 'extra-label' }, slots: { default: 'Name' } })
    expect(screen.getByText('Name')).toHaveAttribute('data-required', 'true')
    expect(screen.getByText('Name')).toHaveClass('fc-label', 'extra-label')

    render(Link, { attrs: { href: '/projects', class: 'extra-link' }, slots: { default: 'Open' } })
    expect(screen.getByRole('link', { name: 'Open' })).toHaveClass('fc-link', 'extra-link')

    render(Icon, { props: { label: 'Warning' }, attrs: { class: 'extra-icon' }, slots: { default: '!' } })
    expect(screen.getByRole('img', { name: 'Warning' })).toHaveClass('fc-icon', 'extra-icon')

    render(VisuallyHidden, { attrs: { class: 'extra-hidden' }, slots: { default: 'Hidden context' } })
    expect(screen.getByText('Hidden context')).toHaveClass('fc-visually-hidden', 'extra-hidden')
  })

  it('renders status utilities accessibly', () => {
    render(Separator, { props: { decorative: false, orientation: 'vertical' }, attrs: { class: 'extra-sep' } })
    const separator = screen.getByRole('separator')
    expect(separator).toHaveAttribute('aria-orientation', 'vertical')
    expect(separator).toHaveClass('fc-separator', 'extra-sep')

    render(Skeleton, { attrs: { 'data-testid': 'skeleton', class: 'extra-skel' } })
    expect(screen.getByTestId('skeleton')).toHaveClass('fc-skeleton', 'extra-skel')

    render(Spinner, { props: { label: 'Saving' }, attrs: { class: 'extra-spin' } })
    expect(screen.getByRole('status', { name: 'Saving' })).toHaveClass('fc-spinner', 'extra-spin')
  })

  it('matches the alert primary variant snapshot', () => {
    const { container } = render(Alert, {
      props: { title: 'Saved', description: 'Your changes are stored.' },
    })
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        class="fc-alert"
        data-live="assertive"
        data-variant="info"
        role="alert"
      >
        <div
          class="fc-alert__body"
        >
          <p
            class="fc-alert__title"
          >
            Saved
          </p>
          <p
            class="fc-alert__description"
          >
            Your changes are stored.
          </p>
        </div>
      </div>
    `)
  })
})
