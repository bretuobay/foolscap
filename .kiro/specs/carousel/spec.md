# Carousel

> A means of displaying multiple slides of content, one or more at a time, navigated by swiping, scrolling, or buttons.
> **Tier:** 3 — Headless machine
> **Also known as:** Content slider
> **Native element:** —

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<section>` | `.fc-carousel` | `role="region" aria-roledescription="carousel"` — `aria-label` required |
| `viewport` | `<div>` | `.fc-carousel__viewport` | Overflow-hidden clipping window |
| `track` | `<div>` | `.fc-carousel__track` | Flex container; CSS `scroll-snap-type: x mandatory` |
| `slide` | `<div>` | `.fc-carousel__slide` | `role="group" aria-roledescription="slide"` — `aria-label="N of M"` |
| `prev` | `<button>` | `.fc-carousel__prev` | Previous slide control |
| `next` | `<button>` | `.fc-carousel__next` | Next slide control |
| `indicators` | `<div>` | `.fc-carousel__indicators` | Optional dot-nav container; `role="tablist"` |
| `indicator` | `<button>` | `.fc-carousel__indicator` | One per slide; `role="tab"` |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Auto-play | `data-state` | `playing \| paused` | `root` |
| Active slide | `data-state` | `active` | `slide`, `indicator` |
| Active indicator | `aria-current` | `true` | `indicator` |
| Active tab | `aria-selected` | `true \| false` | `indicator` (`role="tab"`) |
| Live region | `aria-live` | `off \| polite` | `root` (`off` during auto-play, `polite` on manual nav) |
| Prev disabled | `disabled` | — | `prev` (at start, non-looping) |
| Next disabled | `disabled` | — | `next` (at end, non-looping) |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-carousel-gap` | `gap` on `track` | `0` |
| `--fc-carousel-radius` | `border-radius` on `viewport` | `0` |
| `--fc-carousel-indicator-size` | `width` + `height` on `indicator` | `8px` |
| `--fc-carousel-indicator-gap` | `gap` on `indicators` | `var(--fc-space-2)` |
| `--fc-carousel-control-size` | `width` + `height` on `prev`/`next` | `44px` |
| `--fc-carousel-indicator-color` | `background` on `indicator` | `var(--grey-400)` |
| `--fc-carousel-indicator-active-color` | `background` on active `indicator` | `var(--ink)` |

---

## HTML — Classless

```html
<!-- No meaningful classless fallback: show slides stacked or only first slide visible.
     Use the class-based markup below for all real usage. -->
<section aria-label="Featured articles">
  <div>
    <p>Slide 1 content</p>
  </div>
  <div>
    <p>Slide 2 content</p>
  </div>
</section>
```

---

## HTML — Class-based

```html
<section
  class="fc-carousel"
  aria-label="Featured articles"
  aria-roledescription="carousel"
  data-state="paused"
>
  <div class="fc-carousel__viewport">
    <div class="fc-carousel__track">
      <div
        class="fc-carousel__slide"
        role="group"
        aria-roledescription="slide"
        aria-label="1 of 3"
        data-state="active"
      >
        <!-- slide content -->
      </div>
      <div
        class="fc-carousel__slide"
        role="group"
        aria-roledescription="slide"
        aria-label="2 of 3"
      >
        <!-- slide content -->
      </div>
      <div
        class="fc-carousel__slide"
        role="group"
        aria-roledescription="slide"
        aria-label="3 of 3"
      >
        <!-- slide content -->
      </div>
    </div>
  </div>

  <button class="fc-carousel__prev" aria-label="Previous slide">‹</button>
  <button class="fc-carousel__next" aria-label="Next slide">›</button>

  <div class="fc-carousel__indicators" role="tablist" aria-label="Slides">
    <button class="fc-carousel__indicator" role="tab" aria-label="Slide 1" aria-selected="true" aria-current="true" data-state="active"></button>
    <button class="fc-carousel__indicator" role="tab" aria-label="Slide 2" aria-selected="false"></button>
    <button class="fc-carousel__indicator" role="tab" aria-label="Slide 3" aria-selected="false"></button>
  </div>
</section>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [Carousel (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) |
| **Role(s)** | `region` on root; `group` on each slide; `tab` on indicators; `tablist` on indicators container |
| **Required attributes** | `aria-label` on root and each slide; `aria-roledescription="carousel"` on root; `aria-roledescription="slide"` on each slide; `aria-label="N of M"` on each slide |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

**Keyboard interaction**

| Key | Action |
|-----|--------|
| `Tab` | Move focus between prev, next, and indicator controls |
| `Enter` / `Space` | Activate focused control (prev, next, or indicator) |
| `ArrowLeft` | Previous slide (when focus is on prev/next controls or indicators) |
| `ArrowRight` | Next slide (when focus is on prev/next controls or indicators) |
| Inside slide content | `Tab` navigates normally within the slide |

---

## Behavior

**Native element / API used:** CSS `scroll-snap-type` + `scrollIntoView` for snapping; no native carousel element.

**Machine responsibilities:**
- Track current slide index; update `data-state="active"` on active slide and indicator
- Handle `prev` / `next` button clicks — update index, scroll track to new slide
- Handle indicator click — jump directly to slide
- Optional auto-play: advance slide on a configurable interval timer
- Pause auto-play on `mouseenter`, `focusin` inside root; resume on `mouseleave`, `focusout`
- Set `aria-live="polite"` on manual nav; `aria-live="off"` during auto-play
- Loop mode: wrap from last → first and first → last; non-loop mode: disable prev/next at bounds
- Emit `fc:slide-change` on every index change

**`@foolscap/core` API sketch:**

```ts
createCarousel(options?: {
  initialIndex?: number         // default: 0
  loop?: boolean                // default: false
  autoPlay?: boolean            // default: false
  autoPlayInterval?: number     // ms, default: 4000
}): {
  getRootProps(): Record<string, unknown>
  getViewportProps(): Record<string, unknown>
  getTrackProps(): Record<string, unknown>
  getSlideProps(index: number): Record<string, unknown>
  getPrevProps(): Record<string, unknown>
  getNextProps(): Record<string, unknown>
  getIndicatorsProps(): Record<string, unknown>
  getIndicatorProps(index: number): Record<string, unknown>
  state: {
    currentIndex: number
    isPlaying: boolean
    slideCount: number
  }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:slide-change` | `{ index: number, prevIndex: number }` | Slide transition completes |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-loop` | `true \| false` | Enables wrap-around at boundaries |
| `data-autoplay` | `true \| false` | Enables auto-advance |

---

## Notes

- `aria-label` on the root `<section>` is mandatory — the component API should warn if omitted.
- Items past the first position receive dramatically less engagement — the spec intentionally doesn't enforce usage, but docs should note this.
- Multi-slide-visible mode (showing 2+ slides at once) is a future extension; v1 is single-slide-per-view.
- Touch swipe is handled by native scroll-snap; no custom pointer event handling needed for swipe.
