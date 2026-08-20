import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h, ref, type VNode } from 'vue'
import { CarouselRoot } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

function createSlides(): VNode[] {
  return [
    h(
      'div',
      { class: 'carousel-demo-slide', style: { background: 'var(--fc-grey-100, rgb(245 245 245))' } },
      [
        h('h3', null, 'Design system updates'),
        h('p', null, 'Ship consistent interface primitives across products.'),
      ],
    ),
    h(
      'div',
      { class: 'carousel-demo-slide', style: { background: 'var(--fc-grey-200, rgb(229 229 229))' } },
      [
        h('h3', null, 'Accessible defaults'),
        h('p', null, 'Keyboard and screen-reader semantics are part of the component contract.'),
      ],
    ),
    h(
      'div',
      { class: 'carousel-demo-slide', style: { background: 'var(--fc-grey-100, rgb(245 245 245))' } },
      [
        h('h3', null, 'Composable React'),
        h('p', null, 'Use the default renderer or replace individual parts.'),
      ],
    ),
  ]
}

const carouselDemoCss = `
          .carousel-demo-slide {
            min-height: 16rem;
            display: grid;
            align-content: center;
            gap: 0.5rem;
            padding: 3rem;
          }
          .carousel-demo-slide h3,
          .carousel-demo-slide p {
            margin: 0;
          }
        `

const meta = {
  title: 'Tier 3/Carousel',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    () =>
      defineComponent({
        setup(_, { slots }) {
          return () => h('div', null, [h('style', null, carouselDemoCss), slots.default?.()])
        },
      }),
  ],
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: renderStory(() => h(CarouselRoot, { slides: createSlides(), label: 'Featured updates' })),
}

export const Looping: Story = {
  render: renderStory(() =>
    h(CarouselRoot, { slides: createSlides(), label: 'Featured updates', loop: true }),
  ),
}

export const AutoPlay: Story = {
  name: 'Auto play',
  render: renderStory(() =>
    h(CarouselRoot, {
      slides: createSlides(),
      label: 'Featured updates',
      loop: true,
      autoPlay: true,
      autoPlayInterval: 2500,
    }),
  ),
}

const ControlledCarousel = defineComponent({
  setup() {
    const index = ref(1)
    return () =>
      h(CarouselRoot, {
        slides: createSlides(),
        label: 'Featured updates',
        index: index.value,
        onSlideChange: (next: number) => {
          index.value = next
        },
      })
  },
})

export const Controlled: Story = {
  render: renderStory(() => h(ControlledCarousel)),
}
