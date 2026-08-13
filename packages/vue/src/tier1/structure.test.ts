import { defineComponent, h } from 'vue'
import { render, screen } from '@testing-library/vue'
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
  it('renders card parts, image, and media primitives', () => {
    const Example = defineComponent({
      setup() {
        return () =>
          h(Card, { variant: 'elevated', class: 'extra-card' }, {
            default: () => [
              h(CardBody, null, {
                default: () => [
                  h(CardTitle, null, { default: () => 'Project Atlas' }),
                  h(CardDescription, null, { default: () => 'Design system work.' }),
                ],
              }),
              h(CardFooter, null, {
                default: () => h(Link, { href: '/projects' }, { default: () => 'Open' }),
              }),
            ],
          })
      },
    })
    render(Example)
    expect(screen.getByRole('article')).toHaveClass('fc-card', 'extra-card')
    expect(screen.getByRole('article')).toHaveAttribute('data-variant', 'elevated')
    expect(screen.getByRole('heading', { name: 'Project Atlas' })).toHaveClass('fc-card__title')
    expect(screen.getByRole('link', { name: 'Open' })).toHaveClass('fc-link')

    render(Image, { props: { variant: 'circle' }, attrs: { src: '/avatar.png', alt: 'Ada', class: 'extra-image' } })
    expect(screen.getByRole('img', { name: 'Ada' })).toHaveClass('fc-image', 'extra-image')

    render(Video, { props: { variant: 'bordered' }, attrs: { 'aria-label': 'Demo', class: 'extra-video' } })
    expect(screen.getByLabelText('Demo')).toHaveClass('fc-video', 'extra-video')

    render(VideoEmbed, { attrs: { 'data-testid': 'embed', class: 'extra-embed' } })
    expect(screen.getByTestId('embed')).toHaveClass('fc-video-embed', 'extra-embed')
  })

  it('renders typography, list, and quote primitives', () => {
    render(List, {
      props: { variant: 'numbered' },
      attrs: { class: 'extra-list' },
      slots: { default: '<li>One</li>' },
    })
    expect(screen.getByRole('list')).toHaveAttribute('data-variant', 'numbered')
    expect(screen.getByRole('list')).toHaveClass('fc-list', 'extra-list')

    render(Quote, {
      props: { citeText: 'A. Lovelace' },
      attrs: { class: 'extra-quote' },
      slots: { default: 'That brain of mine is something more than merely mortal.' },
    })
    expect(screen.getByText('A. Lovelace')).toHaveClass('fc-quote__cite')
    expect(screen.getByText('A. Lovelace').parentElement).toHaveClass('fc-quote', 'extra-quote')
  })

  it('renders progress, skip link, and stack utilities', () => {
    render(ProgressBar, { props: { label: 'Upload progress', value: 25 }, attrs: { class: 'extra-progress' } })
    expect(screen.getByRole('progressbar', { name: 'Upload progress' })).toHaveAttribute('aria-valuenow', '25')
    expect(screen.getByRole('progressbar', { name: 'Upload progress' })).toHaveClass('fc-progress-bar', 'extra-progress')

    render(ProgressBar, { props: { label: 'Loading assets' } })
    expect(screen.getByRole('progressbar', { name: 'Loading assets' })).toHaveAttribute('data-state', 'indeterminate')

    render(SkipLink, { attrs: { href: '#main', class: 'extra-skip' } })
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveClass('fc-skip-link', 'extra-skip')

    render(Stack, { props: { gap: '8', align: 'center' }, attrs: { 'data-testid': 'stack', class: 'extra-stack' } })
    const stack = screen.getByTestId('stack')
    expect(stack).toHaveAttribute('data-gap', '8')
    expect(stack).toHaveAttribute('data-align', 'center')
    expect(stack).toHaveClass('fc-stack', 'extra-stack')
  })

  it('renders breadcrumbs as a labelled navigation list', () => {
    const Example = defineComponent({
      setup() {
        return () =>
          h(Breadcrumbs, { class: 'extra-crumbs' }, {
            default: () => [
              h(BreadcrumbItem, null, { default: () => h('a', { href: '/' }, 'Home') }),
              h(BreadcrumbItem, null, {
                default: () => h('span', { 'aria-current': 'page' }, 'Projects'),
              }),
            ],
          })
      },
    })
    render(Example)
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
    expect(screen.getByRole('list')).toHaveClass('fc-breadcrumbs', 'extra-crumbs')
    expect(screen.getByText('Projects')).toHaveAttribute('aria-current', 'page')
  })

  it('renders button group, empty state, and table classes', () => {
    const Example = defineComponent({
      setup() {
        return () =>
          h(ButtonGroup, { orientation: 'vertical', 'aria-label': 'Text alignment', class: 'extra-group' }, {
            default: () => [
              h(Button, null, { default: () => 'Left' }),
              h(Button, null, { default: () => 'Right' }),
            ],
          })
      },
    })
    render(Example)
    expect(screen.getByRole('group', { name: 'Text alignment' })).toHaveAttribute('data-orientation', 'vertical')
    expect(screen.getByRole('group', { name: 'Text alignment' })).toHaveClass('fc-button-group', 'extra-group')

    render(EmptyState, {
      props: { title: 'No projects', description: 'Create one to get started.' },
      attrs: { class: 'extra-empty' },
    })
    expect(screen.getByText('No projects')).toHaveClass('fc-empty-state__title')
    expect(screen.getByText('No projects').parentElement).toHaveClass('fc-empty-state', 'extra-empty')

    render(Table, {
      props: { variant: 'striped' },
      attrs: { class: 'extra-table' },
      slots: { default: '<tbody><tr><td>Atlas</td></tr></tbody>' },
    })
    expect(screen.getByRole('table')).toHaveAttribute('data-variant', 'striped')
    expect(screen.getByRole('table')).toHaveClass('fc-table', 'extra-table')
  })
})
