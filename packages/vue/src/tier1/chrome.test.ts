import { defineComponent, h } from 'vue'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'
import { Footer, FooterBottom, FooterGrid, FooterLinks, FooterSectionTitle } from './Footer'
import { Header, HeaderActions, HeaderBrand, HeaderNav } from './Header'
import { Hero, HeroActions, HeroDescription, HeroEyebrow, HeroTitle } from './Hero'

describe('tier 1 page chrome (wave 1D)', () => {
  it('renders header parts with banner and navigation semantics', () => {
    const Example = defineComponent({
      setup() {
        return () =>
          h(Header, { class: 'extra-header' }, {
            default: () => [
              h(HeaderBrand, { href: '/', class: 'extra-brand' }, { default: () => 'Foolscap' }),
              h(HeaderNav, { 'aria-label': 'Primary', class: 'extra-nav' }, {
                default: () => h('a', { href: '/docs' }, 'Docs'),
              }),
              h(HeaderActions, { class: 'extra-actions' }, {
                default: () => h(Button, null, { default: () => 'Sign in' }),
              }),
            ],
          })
      },
    })
    render(Example)
    expect(screen.getByRole('banner')).toHaveClass('fc-header', 'extra-header')
    expect(screen.getByRole('link', { name: 'Foolscap' })).toHaveClass('fc-header__brand', 'extra-brand')
    expect(screen.getByRole('navigation', { name: 'Primary' })).toHaveClass('fc-header__nav', 'extra-nav')
    expect(screen.getByRole('button', { name: 'Sign in' }).parentElement).toHaveClass(
      'fc-header__actions',
      'extra-actions',
    )
  })

  it('renders hero parts and split variant', () => {
    const Example = defineComponent({
      setup() {
        return () =>
          h(Hero, { variant: 'split', class: 'extra-hero' }, {
            default: () => [
              h(HeroEyebrow, { class: 'extra-eyebrow' }, { default: () => 'Release' }),
              h(HeroTitle, { class: 'extra-title' }, { default: () => 'Components ready for teams' }),
              h(HeroDescription, { class: 'extra-desc' }, { default: () => 'Ship consistent product surfaces.' }),
              h(HeroActions, { class: 'extra-hero-actions' }, {
                default: () => h(Button, null, { default: () => 'Start' }),
              }),
            ],
          })
      },
    })
    render(Example)
    const hero = screen.getByRole('heading', { name: 'Components ready for teams' }).parentElement
    expect(hero).toHaveClass('fc-hero', 'extra-hero')
    expect(hero).toHaveAttribute('data-variant', 'split')
    expect(screen.getByRole('heading', { name: 'Components ready for teams' })).toHaveClass(
      'fc-hero__title',
      'extra-title',
    )
    expect(screen.getByText('Release')).toHaveClass('fc-hero__eyebrow', 'extra-eyebrow')
    expect(screen.getByText('Ship consistent product surfaces.')).toHaveClass('fc-hero__description', 'extra-desc')
    expect(screen.getByRole('button', { name: 'Start' }).parentElement).toHaveClass(
      'fc-hero__actions',
      'extra-hero-actions',
    )
  })

  it('renders footer parts with contentinfo semantics', () => {
    const Example = defineComponent({
      setup() {
        return () =>
          h(Footer, { class: 'extra-footer' }, {
            default: () => [
              h(FooterGrid, { class: 'extra-grid' }, {
                default: () =>
                  h('section', null, [
                    h(FooterSectionTitle, { class: 'extra-section' }, { default: () => 'Product' }),
                    h(FooterLinks, { class: 'extra-links' }, {
                      default: () => h('li', null, h('a', { href: '/docs' }, 'Docs')),
                    }),
                  ]),
              }),
              h(FooterBottom, { class: 'extra-bottom' }, { default: () => 'Copyright' }),
            ],
          })
      },
    })
    render(Example)
    expect(screen.getByRole('contentinfo')).toHaveClass('fc-footer', 'extra-footer')
    expect(screen.getByRole('heading', { name: 'Product' })).toHaveClass('fc-footer__section-title', 'extra-section')
    expect(screen.getByRole('list')).toHaveClass('fc-footer__links', 'extra-links')
    expect(screen.getByText('Copyright')).toHaveClass('fc-footer__bottom', 'extra-bottom')
  })
})
