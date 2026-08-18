import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h, ref } from 'vue'
import { PaginationRoot } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

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
  render: renderStory(() => h(PaginationRoot, { totalPages: 10, defaultPage: 1 })),
}

const ControlledPagination = defineComponent({
  setup() {
    const page = ref(5)
    return () =>
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' } },
        [
          h(PaginationRoot, {
            totalPages: 20,
            page: page.value,
            onPageChange: (next: number) => {
              page.value = next
            },
          }),
          h(
            'p',
            { style: { margin: 0, fontSize: '0.875rem', color: 'var(--fc-ink-muted, rgb(26 26 26 / 0.6))' } },
            ['Current page: ', h('strong', null, String(page.value))],
          ),
        ],
      )
  },
})

export const Controlled: Story = {
  render: renderStory(() => h(ControlledPagination)),
}

export const LinkMode: Story = {
  name: 'Link mode',
  render: renderStory(() =>
    h(PaginationRoot, { totalPages: 10, defaultPage: 2, getPageHref: (page: number) => `?page=${page}` }),
  ),
}

export const Sizes: Story = {
  render: renderStory(() =>
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' } },
      [
        h(PaginationRoot, { totalPages: 5, defaultPage: 2, size: 'sm' }),
        h(PaginationRoot, { totalPages: 5, defaultPage: 2 }),
        h(PaginationRoot, { totalPages: 5, defaultPage: 2, size: 'lg' }),
      ],
    ),
  ),
}
