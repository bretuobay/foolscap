import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { CarouselRoot } from '@web-loom/foolscap-react'

const slides = [
  <div className="carousel-demo-slide" style={{ background: 'var(--fc-grey-100, rgb(245 245 245))' }}>
    <h3>Design system updates</h3>
    <p>Ship consistent interface primitives across products.</p>
  </div>,
  <div className="carousel-demo-slide" style={{ background: 'var(--fc-grey-200, rgb(229 229 229))' }}>
    <h3>Accessible defaults</h3>
    <p>Keyboard and screen-reader semantics are part of the component contract.</p>
  </div>,
  <div className="carousel-demo-slide" style={{ background: 'var(--fc-grey-100, rgb(245 245 245))' }}>
    <h3>Composable React</h3>
    <p>Use the default renderer or replace individual parts.</p>
  </div>,
]

const meta = {
  title: 'React/Carousel',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div>
        <style>{`
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
        `}</style>
        <Story />
      </div>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <CarouselRoot slides={slides} label="Featured updates" />,
}

export const Looping: Story = {
  render: () => <CarouselRoot slides={slides} label="Featured updates" loop />,
}

export const AutoPlay: Story = {
  name: 'Auto play',
  render: () => <CarouselRoot slides={slides} label="Featured updates" loop autoPlay autoPlayInterval={2500} />,
}

export const Controlled: Story = {
  render: function ControlledCarousel() {
    const [index, setIndex] = useState(1)
    return <CarouselRoot slides={slides} label="Featured updates" index={index} onSlideChange={setIndex} />
  },
}
