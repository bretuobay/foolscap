import { Component } from '@angular/core'
import type { Meta, StoryObj } from '@storybook/angular'
import { CarouselRoot } from '@web-loom/foolscap-angular'

const SLIDES = [
  'Design system updates — ship consistent interface primitives across products.',
  'Accessible defaults — keyboard and screen-reader semantics are part of the component contract.',
  'Composable Angular — use the default renderer or replace individual parts.',
]

const carouselImports = [CarouselRoot]

const meta = {
  title: 'Tier 3/Carousel',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

@Component({
  selector: 'demo-carousel-default',
  standalone: true,
  imports: carouselImports,
  template: `<section fc-carousel [slides]="slides" label="Featured updates"></section>`,
})
class DefaultDemo {
  slides = SLIDES
}

@Component({
  selector: 'demo-carousel-loop',
  standalone: true,
  imports: carouselImports,
  template: `<section fc-carousel [slides]="slides" label="Featured updates" [loop]="true"></section>`,
})
class LoopingDemo {
  slides = SLIDES
}

@Component({
  selector: 'demo-carousel-autoplay',
  standalone: true,
  imports: carouselImports,
  template: `<section fc-carousel [slides]="slides" label="Featured updates" [loop]="true" [autoPlay]="true" [autoPlayInterval]="2500"></section>`,
})
class AutoPlayDemo {
  slides = SLIDES
}

@Component({
  selector: 'demo-carousel-controlled',
  standalone: true,
  imports: carouselImports,
  template: `<section fc-carousel [slides]="slides" label="Featured updates" [index]="index" (slideChange)="index = $event"></section>`,
})
class ControlledDemo {
  slides = SLIDES
  index = 1
}

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [DefaultDemo] },
    template: `<demo-carousel-default></demo-carousel-default>`,
  }),
}

export const Looping: Story = {
  render: () => ({
    moduleMetadata: { imports: [LoopingDemo] },
    template: `<demo-carousel-loop></demo-carousel-loop>`,
  }),
}

export const AutoPlay: Story = {
  name: 'Auto play',
  render: () => ({
    moduleMetadata: { imports: [AutoPlayDemo] },
    template: `<demo-carousel-autoplay></demo-carousel-autoplay>`,
  }),
}

export const Controlled: Story = {
  render: () => ({
    moduleMetadata: { imports: [ControlledDemo] },
    template: `<demo-carousel-controlled></demo-carousel-controlled>`,
  }),
}
