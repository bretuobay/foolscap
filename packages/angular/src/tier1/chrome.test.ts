import { screen } from '@testing-library/angular'
import { describe, expect, it } from 'vitest'
import { render } from '../test-helpers'
import { Button } from './Button'
import { Footer, FooterBottom, FooterGrid, FooterLinks, FooterSectionTitle } from './Footer'
import { Header, HeaderActions, HeaderBrand, HeaderNav } from './Header'
import { Hero, HeroActions, HeroDescription, HeroEyebrow, HeroTitle } from './Hero'

describe('tier 1 page chrome (wave 1D)', () => {
  it('renders header parts with banner and navigation semantics', async () => {
    await render(
      `
      <header fc-header class="extra-header">
        <a fc-header-brand href="/" class="extra-brand">Foolscap</a>
        <nav fc-header-nav aria-label="Primary" class="extra-nav">
          <a href="/docs">Docs</a>
        </nav>
        <fc-header-actions class="extra-actions">
          <button fc-button>Sign in</button>
        </fc-header-actions>
      </header>
      `,
      { imports: [Header, HeaderBrand, HeaderNav, HeaderActions, Button] },
    )
    expect(screen.getByRole('banner')).toHaveClass('fc-header', 'extra-header')
    expect(screen.getByRole('link', { name: 'Foolscap' })).toHaveClass('fc-header__brand', 'extra-brand')
    expect(screen.getByRole('navigation', { name: 'Primary' })).toHaveClass('fc-header__nav', 'extra-nav')
    expect(screen.getByRole('button', { name: 'Sign in' }).parentElement).toHaveClass(
      'fc-header__actions',
      'extra-actions',
    )
  })

  it('renders hero parts and split variant', async () => {
    await render(
      `
      <section fc-hero variant="split">
        <p fc-hero-eyebrow>Paper</p>
        <h1 fc-hero-title>Design without chrome</h1>
        <p fc-hero-description>A quiet system.</p>
        <fc-hero-actions>
          <button fc-button>Start</button>
        </fc-hero-actions>
      </section>
      `,
      { imports: [Hero, HeroEyebrow, HeroTitle, HeroDescription, HeroActions, Button] },
    )
    expect(screen.getByText('Design without chrome').closest('.fc-hero')).toHaveAttribute('data-variant', 'split')
    expect(screen.getByRole('heading', { name: 'Design without chrome' })).toHaveClass('fc-hero__title')
  })

  it('renders footer parts', async () => {
    await render(
      `
      <footer fc-footer>
        <fc-footer-grid>
          <h2 fc-footer-section-title>Product</h2>
          <ul fc-footer-links><li><a href="/docs">Docs</a></li></ul>
        </fc-footer-grid>
        <fc-footer-bottom>© Foolscap</fc-footer-bottom>
      </footer>
      `,
      { imports: [Footer, FooterGrid, FooterSectionTitle, FooterLinks, FooterBottom] },
    )
    expect(screen.getByRole('contentinfo')).toHaveClass('fc-footer')
    expect(screen.getByRole('heading', { name: 'Product' })).toHaveClass('fc-footer__section-title')
  })
})
