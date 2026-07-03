import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import {
  Alert,
  Avatar,
  Badge,
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardTitle,
  Heading,
  Icon,
  Image,
  Label,
  Link,
  List,
  ProgressBar,
  Quote,
  Separator,
  Skeleton,
  SkipLink,
  Spinner,
  Stack,
  Video,
  VideoEmbed,
  VisuallyHidden,
} from '../index'

describe('tier 1 primitives', () => {
  it('renders alert live-region semantics and dismiss action', () => {
    const onDismiss = vi.fn()
    render(<Alert variant="error" title="Session expired" description="Sign in again." onDismiss={onDismiss} />)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('fc-alert')
    expect(alert).toHaveAttribute('data-variant', 'error')
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss alert' }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('renders avatar, badge, and media primitives with class contracts', () => {
    render(
      <>
        <Avatar fallback="AL" size="lg" />
        <Badge variant="subtle">Beta</Badge>
        <Image src="/avatar.png" alt="Ada" variant="circle" />
        <Video aria-label="Demo" variant="bordered" />
      </>
    )
    expect(screen.getByText('AL')).toHaveClass('fc-avatar')
    expect(screen.getByText('AL')).toHaveAttribute('data-size', 'lg')
    expect(screen.getByText('Beta')).toHaveClass('fc-badge')
    expect(screen.getByText('Beta')).toHaveAttribute('data-variant', 'subtle')
    expect(screen.getByRole('img', { name: 'Ada' })).toHaveClass('fc-image')
    expect(screen.getByLabelText('Demo')).toHaveClass('fc-video')
  })

  it('renders structural content primitives', () => {
    render(
      <Card variant="elevated">
        <CardBody>
          <CardTitle>Project Atlas</CardTitle>
          <CardDescription>Design system work.</CardDescription>
        </CardBody>
        <CardFooter>
          <Link href="/projects">Open</Link>
        </CardFooter>
      </Card>
    )
    expect(screen.getByRole('article')).toHaveClass('fc-card')
    expect(screen.getByRole('article')).toHaveAttribute('data-variant', 'elevated')
    expect(screen.getByRole('heading', { name: 'Project Atlas' })).toHaveClass('fc-card__title')
    expect(screen.getByRole('link', { name: 'Open' })).toHaveClass('fc-link')
  })

  it('renders typography, list, and utility primitives', () => {
    render(
      <>
        <Heading level={1}>Dashboard</Heading>
        <Label htmlFor="name" required>
          Name
        </Label>
        <List variant="numbered">
          <li>One</li>
        </List>
        <Quote citeText="A. Lovelace">That brain of mine is something more than merely mortal.</Quote>
        <Icon label="Warning">!</Icon>
        <VisuallyHidden>Hidden context</VisuallyHidden>
      </>
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('fc-heading')
    expect(screen.getByText('Name')).toHaveAttribute('data-required', 'true')
    expect(screen.getByRole('list')).toHaveAttribute('data-variant', 'numbered')
    expect(screen.getByText('A. Lovelace')).toHaveClass('fc-quote__cite')
    expect(screen.getByRole('img', { name: 'Warning' })).toHaveClass('fc-icon')
    expect(screen.getByText('Hidden context')).toHaveClass('fc-visually-hidden')
  })

  it('renders status and layout utilities accessibly', () => {
    render(
      <>
        <ProgressBar label="Upload progress" value={25} />
        <ProgressBar label="Loading assets" />
        <Separator decorative={false} orientation="vertical" />
        <Skeleton data-testid="skeleton" />
        <SkipLink href="#main" />
        <Spinner label="Saving" />
        <Stack gap="8" align="center" data-testid="stack" />
        <VideoEmbed data-testid="embed" />
      </>
    )
    expect(screen.getByRole('progressbar', { name: 'Upload progress' })).toHaveAttribute('aria-valuenow', '25')
    expect(screen.getByRole('progressbar', { name: 'Loading assets' })).toHaveAttribute(
      'data-state',
      'indeterminate'
    )
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical')
    expect(screen.getByTestId('skeleton')).toHaveClass('fc-skeleton')
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveClass('fc-skip-link')
    expect(screen.getByRole('status', { name: 'Saving' })).toHaveClass('fc-spinner')
    expect(screen.getByTestId('stack')).toHaveAttribute('data-gap', '8')
    expect(screen.getByTestId('embed')).toHaveClass('fc-video-embed')
  })
})
