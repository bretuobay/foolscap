# Slider

> An input where the user selects a value from within a given range.
> **Tier:** 1 (native styled) + Tier 3 (custom headless)
> **Also known as:** Range input, Scrubber
> **Native element:** `<input type="range">` (Tier 1); custom `<div role="slider">` (Tier 3)

---

## Anatomy

### Tier 1 — Native styled

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-slider` | Layout wrapper |
| `label` | `<label>` | `.fc-slider__label` | Associates `for` with input id |
| `input` | `<input type="range">` | `.fc-slider__input` | Native slider; fully accessible |
| `track` | `<span>` | `.fc-slider__track` | Decorative overlay; CSS only |
| `fill` | `<span>` | `.fc-slider__fill` | Width driven by `--fc-slider-pct` CSS var |
| `output` | `<output>` | `.fc-slider__output` | Live value display |

### Tier 3 — Custom headless

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-slider` | Track container + overall wrapper |
| `label` | `<label>` | `.fc-slider__label` | Associated label |
| `track` | `<div>` | `.fc-slider__track` | Full track area; drag target |
| `range` | `<div>` | `.fc-slider__range` | Filled portion from origin to thumb |
| `thumb` | `<div>` | `.fc-slider__thumb` | Draggable handle; `role="slider"` |
| `output` | `<output>` | `.fc-slider__output` | Current value display |
| `tick` | `<span>` | `.fc-slider__tick` | Optional step mark |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Dragging | `data-state` | `dragging` | `thumb` (Tier 3) |
| Disabled | native `disabled` (T1) / `data-state="disabled"` (T3) | — | `input` or `root` |
| Orientation | `data-orientation` | `horizontal \| vertical` | `root` |
| Min/max/value | `aria-valuemin` / `aria-valuemax` / `aria-valuenow` | Numbers | `thumb` (T3) |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-slider-track-height` | `height` on `track` (horizontal) | `4px` |
| `--fc-slider-track-bg` | `background` on `track` | `var(--grey-200)` |
| `--fc-slider-fill-color` | `background` on `fill` / `range` | `var(--ink)` |
| `--fc-slider-thumb-size` | `width` + `height` on `thumb` | `18px` |
| `--fc-slider-thumb-bg` | `background` on `thumb` | `var(--ink)` |
| `--fc-slider-thumb-border` | `border` on `thumb` | `2px solid var(--paper-raised)` |
| `--fc-slider-thumb-shadow` | `box-shadow` on `thumb` | `0 1px 4px rgba(0,0,0,0.25)` |
| `--fc-slider-focus-ring` | `outline` on focused `thumb` | `2px solid var(--ink)` |
| `--fc-slider-pct` | (T1) CSS custom prop set by JS | `0%` |

---

## HTML — Classless (Tier 1)

```html
<label for="volume">Volume</label>
<input id="volume" type="range" name="volume" min="0" max="100" step="1" value="60" />
<output for="volume">60</output>
```

---

## HTML — Class-based (Tier 1 — native, styled)

```html
<div class="fc-slider">
  <label class="fc-slider__label" for="slider-vol">Volume</label>
  <div class="fc-slider__track">
    <span class="fc-slider__fill" style="--fc-slider-pct: 60%;"></span>
    <input
      class="fc-slider__input"
      id="slider-vol"
      type="range"
      name="volume"
      min="0"
      max="100"
      step="5"
      value="60"
      aria-valuetext="60%"
    />
  </div>
  <output class="fc-slider__output" for="slider-vol">60</output>
</div>
```

---

## HTML — Class-based (Tier 3 — custom headless)

```html
<div class="fc-slider" data-orientation="horizontal">
  <label class="fc-slider__label" id="slider-label-price">Price</label>

  <div class="fc-slider__track" id="slider-track">
    <div class="fc-slider__range" style="left: 0%; width: 60%;"></div>

    <div
      class="fc-slider__thumb"
      role="slider"
      tabindex="0"
      aria-labelledby="slider-label-price"
      aria-valuemin="0"
      aria-valuemax="500"
      aria-valuenow="300"
      aria-valuetext="$300"
      style="left: 60%;"
    ></div>
  </div>

  <output class="fc-slider__output" aria-hidden="true">$300</output>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [Slider (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/slider/); Tier 1 uses native `<input type="range">` — no ARIA needed |
| **Role(s)** | `slider` implicit on `<input type="range">` (T1); explicit `role="slider"` on `thumb` (T3) |
| **Required attributes** | T3: `aria-valuemin`, `aria-valuemax`, `aria-valuenow` on `thumb`; `aria-valuetext` when value text differs from number; `aria-label` or `aria-labelledby` on `thumb` |
| **Contrast** | Thumb and track: WCAG 2.2 AA non-text contrast (3:1 minimum) |

**Keyboard interaction (Tier 3 custom thumb)**

| Key | Action |
|-----|--------|
| `ArrowRight` / `ArrowUp` | Increase value by one step |
| `ArrowLeft` / `ArrowDown` | Decrease value by one step |
| `PageUp` | Increase value by 10% of range |
| `PageDown` | Decrease value by 10% of range |
| `Home` | Set value to min |
| `End` | Set value to max |

---

## Behavior

**Native element / API used:**
- **Tier 1**: `<input type="range">` — CSS-only styling via `::-webkit-slider-thumb` / `::-moz-range-thumb`. Minimal JS required only to update `--fc-slider-pct`.
- **Tier 3**: Custom `<div role="slider">` with pointer + keyboard events.

**Machine responsibilities (Tier 3):**
- Track `value` between `min` and `max`, snapping to `step`
- Pointer drag: `pointerdown` on thumb → `pointermove` on document → compute percentage from track `getBoundingClientRect()` → clamp and snap to step → update `value` → `pointerup` stops drag; `setPointerCapture` ensures `pointermove` fires even when pointer leaves thumb
- Set `data-state="dragging"` on thumb during drag
- Keyboard: ArrowUp/Right +1 step; ArrowDown/Left −1 step; PageUp/Down ±10% of range; Home → min; End → max
- Update `aria-valuenow` and `aria-valuetext` on every change
- Emit `fc:input` on every intermediate drag value; `fc:change` on committed value (pointer-up or keydown)
- Vertical orientation: compute percentage from `clientY` vs. track rect height

**Tier 1 JS shim (only line needed):**
```js
input.addEventListener('input', () => {
  const pct = (input.value - input.min) / (input.max - input.min) * 100
  input.style.setProperty('--fc-slider-pct', `${pct}%`)
})
```

**`@foolscap/core` API sketch (Tier 3):**

```ts
createSlider(options?: {
  min?: number                    // default: 0
  max?: number                    // default: 100
  step?: number                   // default: 1
  defaultValue?: number           // default: min
  orientation?: 'horizontal' | 'vertical'
  formatValue?: (value: number) => string  // for aria-valuetext
}): {
  getRootProps(): Record<string, unknown>
  getLabelProps(): Record<string, unknown>
  getTrackProps(): Record<string, unknown>
  getRangeProps(): Record<string, unknown>
  getThumbProps(): Record<string, unknown>
  getOutputProps(): Record<string, unknown>
  state: {
    value: number
    isDragging: boolean
    percentage: number            // 0–100, useful for CSS positioning
  }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:input` | `{ value: number }` | Every value change during drag or keyboard |
| `fc:change` | `{ value: number, prevValue: number }` | Committed change (pointer-up or key) |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-orientation` | `horizontal \| vertical` | Axis direction |
| `data-size` | `sm \| md \| lg` | Track thickness and thumb size |

---

## Notes

- **Use Tier 1 whenever possible**: `<input type="range">` is fully keyboard accessible with all AT. The custom Tier 3 version should only be used when native styling is insufficient (multi-thumb range, vertical on iOS, custom tick marks).
- Range slider (two thumbs) is out of scope for v1 — it requires two `role="slider"` elements inside a `role="group"`.
- `formatValue` callback powers `aria-valuetext` for values like `"$300"` or `"3 stars"`.
- On touch devices, `pointerdown` / `pointermove` / `pointerup` unify mouse and touch events. No separate touch event handling needed.
- Vertical orientation requires vendor-prefixed styles (`-webkit-appearance: slider-vertical`) for older WebKit in Tier 1.
