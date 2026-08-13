import { h } from 'vue'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NavigationRoot, type NavigationItem } from './Navigation'

const ITEMS: NavigationItem[] = [
  { label: 'Home', href: '/', current: true },
  {
    label: 'Products',
    children: [
      { label: 'Product A', href: '/products/a' },
      { label: 'Product B', href: '/products/b' },
    ],
  },
  { label: 'Contact', href: '/contact' },
]

describe('Navigation', () => {
  it('renders a labelled nav and links', () => {
    render(h(NavigationRoot, { items: ITEMS, label: 'Main navigation' }))
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toHaveClass('fc-navigation')
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
  })

  it('toggles mobile navigation', async () => {
    const user = userEvent.setup()
    render(h(NavigationRoot, { items: ITEMS }))
    const nav = screen.getByRole('navigation')
    const toggle = screen.getByRole('button', { name: 'Open navigation' })
    await user.click(toggle)
    expect(nav).toHaveAttribute('data-state', 'expanded')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })

  it('opens a submenu from trigger click', async () => {
    const user = userEvent.setup()
    render(h(NavigationRoot, { items: ITEMS }))
    await user.click(screen.getByRole('button', { name: /products/i }))
    expect(screen.getByRole('link', { name: 'Product A' })).toBeVisible()
    expect(screen.getByRole('button', { name: /products/i })).toHaveAttribute('aria-expanded', 'true')
  })

  it('moves focus inside submenu with arrow keys', async () => {
    const user = userEvent.setup()
    render(h(NavigationRoot, { items: ITEMS }))
    await user.click(screen.getByRole('button', { name: /products/i }))
    const productA = screen.getByRole('link', { name: 'Product A' })
    productA.focus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('link', { name: 'Product B' })).toHaveFocus()
  })

  it('emits toggle callbacks', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    const onMobileToggle = vi.fn()
    render(h(NavigationRoot, { items: ITEMS, onToggle, onMobileToggle }))
    await user.click(screen.getByRole('button', { name: 'Open navigation' }))
    await user.click(screen.getByRole('button', { name: /products/i }))
    expect(onMobileToggle).toHaveBeenCalledWith({ isExpanded: true })
    expect(onToggle).toHaveBeenCalledWith({ index: 1, isOpen: true })
  })
})
