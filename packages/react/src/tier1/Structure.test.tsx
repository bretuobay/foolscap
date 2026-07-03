import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  ButtonGroup,
  EmptyState,
  Fieldset,
  File,
  Footer,
  FooterBottom,
  FooterGrid,
  FooterLinks,
  FooterSectionTitle,
  Header,
  HeaderActions,
  HeaderBrand,
  HeaderNav,
  Hero,
  HeroActions,
  HeroDescription,
  HeroEyebrow,
  HeroTitle,
  Table,
  TextInput,
} from '../index'

describe('tier 1 structure wrappers', () => {
  it('renders breadcrumbs as a labelled navigation list', () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <a href="/">Home</a>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <span aria-current="page">Projects</span>
        </BreadcrumbItem>
      </Breadcrumbs>
    )
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
    expect(screen.getByRole('list')).toHaveClass('fc-breadcrumbs')
    expect(screen.getByText('Projects')).toHaveAttribute('aria-current', 'page')
  })

  it('renders button groups, fieldsets, and file inputs with native semantics', () => {
    render(
      <>
        <ButtonGroup aria-label="Text alignment" orientation="vertical">
          <Button>Left</Button>
          <Button>Right</Button>
        </ButtonGroup>
        <Fieldset legend="Profile" hint="Public details">
          <TextInput aria-label="Display name" />
        </Fieldset>
        <File label="Avatar" />
      </>
    )
    expect(screen.getByRole('group', { name: 'Text alignment' })).toHaveAttribute('data-orientation', 'vertical')
    expect(screen.getByRole('group', { name: 'Profile' })).toHaveClass('fc-fieldset')
    expect(screen.getByLabelText('Avatar')).toHaveAttribute('type', 'file')
  })

  it('renders page chrome and hero parts', () => {
    render(
      <>
        <Header>
          <HeaderBrand href="/">Foolscap</HeaderBrand>
          <HeaderNav aria-label="Primary">
            <a href="/docs">Docs</a>
          </HeaderNav>
          <HeaderActions>
            <Button>Sign in</Button>
          </HeaderActions>
        </Header>
        <Hero variant="split">
          <HeroEyebrow>Release</HeroEyebrow>
          <HeroTitle>Components ready for teams</HeroTitle>
          <HeroDescription>Ship consistent product surfaces.</HeroDescription>
          <HeroActions>
            <Button>Start</Button>
          </HeroActions>
        </Hero>
      </>
    )
    expect(screen.getByRole('banner')).toHaveClass('fc-header')
    expect(screen.getByRole('navigation', { name: 'Primary' })).toHaveClass('fc-header__nav')
    expect(screen.getByRole('heading', { name: 'Components ready for teams' })).toHaveClass('fc-hero__title')
  })

  it('renders footer, empty state, and table classes', () => {
    render(
      <>
        <Footer>
          <FooterGrid>
            <section>
              <FooterSectionTitle>Product</FooterSectionTitle>
              <FooterLinks>
                <li>
                  <a href="/docs">Docs</a>
                </li>
              </FooterLinks>
            </section>
          </FooterGrid>
          <FooterBottom>Copyright</FooterBottom>
        </Footer>
        <EmptyState title="No projects" description="Create one to get started." />
        <Table variant="striped">
          <tbody>
            <tr>
              <td>Atlas</td>
            </tr>
          </tbody>
        </Table>
      </>
    )
    expect(screen.getByRole('contentinfo')).toHaveClass('fc-footer')
    expect(screen.getByText('No projects')).toHaveClass('fc-empty-state__title')
    expect(screen.getByRole('table')).toHaveAttribute('data-variant', 'striped')
  })
})
