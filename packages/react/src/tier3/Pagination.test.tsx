import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PaginationRoot } from './Pagination'

describe('Pagination', () => {
  it('renders current page and boundary buttons', () => {
    render(<PaginationRoot totalPages={10} defaultPage={1} />)
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toHaveClass('fc-pagination')
    expect(screen.getByRole('button', { name: 'Previous page' })).toHaveAttribute(
      'aria-disabled',
      'true'
    )
    expect(screen.getByRole('button', { name: 'Page 1, current page' })).toHaveAttribute(
      'aria-current',
      'page'
    )
  })

  it('moves to the next page', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<PaginationRoot totalPages={10} defaultPage={1} onPageChange={onPageChange} />)
    await user.click(screen.getByRole('button', { name: 'Next page' }))
    expect(screen.getByRole('button', { name: 'Page 2, current page' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    expect(onPageChange).toHaveBeenCalledWith(2, 1)
  })

  it('navigates to a selected page', async () => {
    const user = userEvent.setup()
    render(<PaginationRoot totalPages={10} defaultPage={1} />)
    await user.click(screen.getByRole('button', { name: 'Go to page 4' }))
    expect(screen.getByRole('button', { name: 'Page 4, current page' })).toHaveAttribute(
      'aria-current',
      'page'
    )
  })

  it('renders links when getPageHref is provided', () => {
    render(<PaginationRoot totalPages={3} defaultPage={2} getPageHref={(page) => `?page=${page}`} />)
    expect(screen.getByRole('link', { name: 'Go to page 1' })).toHaveAttribute('href', '?page=1')
    expect(screen.getByRole('link', { name: 'Page 2, current page' })).toHaveAttribute(
      'aria-current',
      'page'
    )
  })

  it('reflects controlled page', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<PaginationRoot totalPages={10} page={5} onPageChange={onPageChange} />)
    await user.click(screen.getByRole('button', { name: 'Next page' }))
    expect(screen.getByRole('button', { name: 'Page 5, current page' })).toBeInTheDocument()
    expect(onPageChange).toHaveBeenCalledWith(6, 5)
  })
})
