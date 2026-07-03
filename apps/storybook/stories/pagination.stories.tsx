import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PaginationRoot } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 3/Pagination',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <PaginationRoot totalPages={10} defaultPage={1} />,
}

export const Controlled: Story = {
  render: function ControlledPagination() {
    const [page, setPage] = useState(5)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <PaginationRoot totalPages={20} page={page} onPageChange={setPage} />
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--fc-ink-muted, rgb(26 26 26 / 0.6))' }}>
          Current page: <strong>{page}</strong>
        </p>
      </div>
    )
  },
}

export const LinkMode: Story = {
  name: 'Link mode',
  render: () => (
    <PaginationRoot totalPages={10} defaultPage={2} getPageHref={(page) => `?page=${page}`} />
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
      <PaginationRoot totalPages={5} defaultPage={2} size="sm" />
      <PaginationRoot totalPages={5} defaultPage={2} />
      <PaginationRoot totalPages={5} defaultPage={2} size="lg" />
    </div>
  ),
}
