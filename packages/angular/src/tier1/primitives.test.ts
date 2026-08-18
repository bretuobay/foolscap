import { render, screen } from '@testing-library/angular'
import { describe, expect, it, vi } from 'vitest'
import { Alert } from './Alert'
import { Avatar, AvatarGroup } from './Avatar'
import { Badge } from './Badge'
import { Button } from './Button'
import { Heading } from './Heading'
import { Icon } from './Icon'
import { Label } from './Label'
import { Link } from './Link'
import { Separator } from './Separator'
import { Skeleton } from './Skeleton'
import { Spinner } from './Spinner'
import { VisuallyHidden } from './VisuallyHidden'

describe('tier 1 primitives (wave 1A)', () => {
  it('renders a button with variant, size, and merged class', async () => {
    await render(`<button fc-button class="extra" variant="ghost" size="lg">Save</button>`, {
      imports: [Button],
    })
    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toHaveClass('fc-button', 'extra')
    expect(button).toHaveAttribute('data-variant', 'ghost')
    expect(button).toHaveAttribute('data-size', 'lg')
  })

  it('renders alert live-region semantics and dismiss action', async () => {
    const onDismiss = vi.fn()
    await render(
      `<fc-alert variant="error" title="Session expired" description="Sign in again." (dismiss)="onDismiss()" />`,
      {
        imports: [Alert],
        componentProperties: { onDismiss },
      },
    )
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('fc-alert')
    expect(alert).toHaveAttribute('data-variant', 'error')
    screen.getByRole('button', { name: 'Dismiss alert' }).click()
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('renders avatar, badge, and merges class', async () => {
    await render(`<fc-avatar class="extra-avatar" fallback="AL" size="lg" />`, { imports: [Avatar] })
    const avatar = screen.getByText('AL')
    expect(avatar).toHaveClass('fc-avatar', 'extra-avatar')
    expect(avatar).toHaveAttribute('data-size', 'lg')

    await render(`<fc-badge class="extra-badge" variant="subtle">Beta</fc-badge>`, { imports: [Badge] })
    expect(screen.getByText('Beta')).toHaveClass('fc-badge', 'extra-badge')
    expect(screen.getByText('Beta')).toHaveAttribute('data-variant', 'subtle')

    await render(`<fc-avatar-group class="extra-group" data-testid="group"></fc-avatar-group>`, {
      imports: [AvatarGroup],
    })
    expect(screen.getByTestId('group')).toHaveClass('fc-avatar-group', 'extra-group')
  })

  it('renders typography and utility primitives', async () => {
    await render(`<h1 fc-heading class="extra-heading">Dashboard</h1>`, { imports: [Heading] })
    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('fc-heading', 'extra-heading')

    await render(`<label fc-label required for="name" class="extra-label">Name</label>`, { imports: [Label] })
    expect(screen.getByText('Name')).toHaveAttribute('data-required', 'true')
    expect(screen.getByText('Name')).toHaveClass('fc-label', 'extra-label')

    await render(`<a fc-link href="/projects" class="extra-link">Open</a>`, { imports: [Link] })
    expect(screen.getByRole('link', { name: 'Open' })).toHaveClass('fc-link', 'extra-link')

    await render(`<fc-icon class="extra-icon" label="Warning">!</fc-icon>`, { imports: [Icon] })
    expect(screen.getByRole('img', { name: 'Warning' })).toHaveClass('fc-icon', 'extra-icon')

    await render(`<fc-visually-hidden class="extra-hidden">Hidden context</fc-visually-hidden>`, {
      imports: [VisuallyHidden],
    })
    expect(screen.getByText('Hidden context')).toHaveClass('fc-visually-hidden', 'extra-hidden')
  })

  it('renders status utilities accessibly', async () => {
    await render(`<fc-separator [decorative]="false" orientation="vertical" class="extra-sep" />`, {
      imports: [Separator],
    })
    const separator = screen.getByRole('separator')
    expect(separator).toHaveAttribute('aria-orientation', 'vertical')
    expect(separator).toHaveClass('fc-separator', 'extra-sep')

    await render(`<fc-skeleton data-testid="skeleton" class="extra-skel" />`, { imports: [Skeleton] })
    expect(screen.getByTestId('skeleton')).toHaveClass('fc-skeleton', 'extra-skel')

    await render(`<fc-spinner class="extra-spin" label="Saving" />`, { imports: [Spinner] })
    expect(screen.getByRole('status', { name: 'Saving' })).toHaveClass('fc-spinner', 'extra-spin')
  })
})
