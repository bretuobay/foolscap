import { render, screen } from '@testing-library/angular'
import { describe, expect, it } from 'vitest'
import { BreadcrumbItem, Breadcrumbs } from './Breadcrumbs'
import { Button } from './Button'
import { ButtonGroup } from './ButtonGroup'
import { Card, CardBody, CardDescription, CardFooter, CardTitle } from './Card'
import { EmptyState } from './EmptyState'
import { Image } from './Image'
import { Link } from './Link'
import { List } from './List'
import { ProgressBar } from './ProgressBar'
import { Quote } from './Quote'
import { SkipLink } from './SkipLink'
import { Stack } from './Stack'
import { Table } from './Table'
import { Video, VideoEmbed } from './Video'

describe('tier 1 structure (wave 1C)', () => {
  it('renders card parts, image, and media primitives', async () => {
    await render(
      `
      <article fc-card variant="elevated" class="extra-card">
        <fc-card-body>
          <h3 fc-card-title>Project Atlas</h3>
          <p fc-card-description>Design system work.</p>
        </fc-card-body>
        <fc-card-footer>
          <a fc-link href="/projects">Open</a>
        </fc-card-footer>
      </article>
      `,
      { imports: [Card, CardBody, CardTitle, CardDescription, CardFooter, Link] },
    )
    expect(screen.getByRole('article')).toHaveClass('fc-card', 'extra-card')
    expect(screen.getByRole('article')).toHaveAttribute('data-variant', 'elevated')
    expect(screen.getByRole('heading', { name: 'Project Atlas' })).toHaveClass('fc-card__title')
    expect(screen.getByRole('link', { name: 'Open' })).toHaveClass('fc-link')

    await render(`<img fc-image variant="circle" src="/avatar.png" alt="Ada" class="extra-image" />`, {
      imports: [Image],
    })
    expect(screen.getByRole('img', { name: 'Ada' })).toHaveClass('fc-image', 'extra-image')

    await render(`<video fc-video variant="bordered" aria-label="Demo" class="extra-video"></video>`, {
      imports: [Video],
    })
    expect(screen.getByLabelText('Demo')).toHaveClass('fc-video', 'extra-video')

    await render(`<fc-video-embed data-testid="embed"></fc-video-embed>`, { imports: [VideoEmbed] })
    expect(screen.getByTestId('embed')).toHaveClass('fc-video-embed')
  })

  it('renders list, quote, table, stack, and progress', async () => {
    await render(`<ul fc-list variant="numbered"><li>One</li></ul>`, { imports: [List] })
    expect(screen.getByRole('list')).toHaveClass('fc-list')
    expect(screen.getByRole('list')).toHaveAttribute('data-variant', 'numbered')

    await render(`<blockquote fc-quote citeText="Ada">Make it simple.</blockquote>`, { imports: [Quote] })
    expect(screen.getByText('Make it simple.')).toHaveClass('fc-quote')

    await render(`<table fc-table variant="striped"><caption>Rows</caption></table>`, { imports: [Table] })
    expect(screen.getByRole('table')).toHaveClass('fc-table')

    await render(`<fc-stack gap="8" align="center" class="extra-stack">Hi</fc-stack>`, { imports: [Stack] })
    expect(screen.getByText('Hi')).toHaveClass('fc-stack', 'extra-stack')
    expect(screen.getByText('Hi')).toHaveAttribute('data-gap', '8')

    await render(`<fc-progress-bar label="Upload" [value]="40" />`, { imports: [ProgressBar] })
    expect(screen.getByRole('progressbar', { name: 'Upload' })).toHaveClass('fc-progress-bar')
  })

  it('renders breadcrumbs, skip link, empty state, and button group', async () => {
    await render(
      `
      <nav fc-breadcrumbs>
        <li fc-breadcrumb-item><a href="/">Home</a></li>
      </nav>
      `,
      { imports: [Breadcrumbs, BreadcrumbItem] },
    )
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeTruthy()
    expect(document.querySelector('.fc-breadcrumbs')).toBeTruthy()

    await render(`<a fc-skip-link href="#main">Skip to main content</a>`, { imports: [SkipLink] })
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveClass('fc-skip-link')

    await render(`<fc-empty-state title="Nothing here" description="Try another filter." />`, {
      imports: [EmptyState],
    })
    expect(screen.getByText('Nothing here')).toHaveClass('fc-empty-state__title')

    await render(
      `
      <fc-button-group>
        <button fc-button>A</button>
        <button fc-button>B</button>
      </fc-button-group>
      `,
      { imports: [ButtonGroup, Button] },
    )
    expect(screen.getByRole('group')).toHaveClass('fc-button-group')
  })
})
