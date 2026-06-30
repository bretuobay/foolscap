# Rating

> Lets users see and/or set a star rating for a product or item.
> **Tier:** 3 — Headless machine
> **Also known as:** —
> **Native element:** `<input type="radio">` (interactive); `<img>` / `<span>` (read-only)

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-rating` | `role="radiogroup"` (interactive) or `role="img"` (read-only) |
| `item` | `<label>` | `.fc-rating__item` | Wraps hidden radio + icon; one per star value |
| `input` | `<input type="radio">` | `.fc-rating__input` | Visually hidden; provides native radio semantics |
| `icon` | `<span>` | `.fc-rating__icon` | Star SVG/character; `aria-hidden="true"` |
| `value-label` | `<span>` | `.fc-rating__value-label` | Visually hidden current value announcement |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Read-only mode | `data-state` | `read-only` | `root` |
| Hovered item | `data-state` | `hovered` | `item` (up to and including hovered star) |
| Selected | `:checked` | — | `input` (native) |
| Active (hovered preview) | `data-state` | `active` | `item` |
| Disabled | `data-state` | `disabled` | `root` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-rating-star-size` | `font-size` / `width` + `height` on `icon` | `24px` |
| `--fc-rating-gap` | `gap` on `root` | `var(--fc-space-1)` |
| `--fc-rating-filled-color` | `color` on filled `icon` | `var(--ink)` |
| `--fc-rating-empty-color` | `color` on empty `icon` | `var(--grey-300)` |
| `--fc-rating-hover-color` | `color` on hovered `icon` | `var(--ink-muted)` |

---

## HTML — Classless

```html
<!-- No meaningful classless equivalent — falls back to plain radio inputs -->
<fieldset>
  <legend>Rating</legend>
  <label><input type="radio" name="rating" value="1" /> 1 star</label>
  <label><input type="radio" name="rating" value="2" /> 2 stars</label>
  <label><input type="radio" name="rating" value="3" /> 3 stars</label>
  <label><input type="radio" name="rating" value="4" /> 4 stars</label>
  <label><input type="radio" name="radio" value="5" /> 5 stars</label>
</fieldset>
```

---

## HTML — Class-based (interactive)

```html
<div
  class="fc-rating"
  role="radiogroup"
  aria-label="Rating"
  aria-required="false"
>
  <span class="fc-rating__value-label" aria-live="polite">3 out of 5 stars</span>

  <label class="fc-rating__item" data-state="active">
    <input class="fc-rating__input" type="radio" name="rating" value="1" aria-label="1 star" />
    <span class="fc-rating__icon" aria-hidden="true">★</span>
  </label>
  <label class="fc-rating__item" data-state="active">
    <input class="fc-rating__input" type="radio" name="rating" value="2" aria-label="2 stars" />
    <span class="fc-rating__icon" aria-hidden="true">★</span>
  </label>
  <label class="fc-rating__item" data-state="active">
    <input class="fc-rating__input" type="radio" name="rating" value="3" aria-label="3 stars" checked />
    <span class="fc-rating__icon" aria-hidden="true">★</span>
  </label>
  <label class="fc-rating__item">
    <input class="fc-rating__input" type="radio" name="rating" value="4" aria-label="4 stars" />
    <span class="fc-rating__icon" aria-hidden="true">☆</span>
  </label>
  <label class="fc-rating__item">
    <input class="fc-rating__input" type="radio" name="rating" value="5" aria-label="5 stars" />
    <span class="fc-rating__icon" aria-hidden="true">☆</span>
  </label>
</div>
```

---

## HTML — Class-based (read-only)

```html
<div
  class="fc-rating"
  role="img"
  aria-label="Rating: 3 out of 5 stars"
  data-state="read-only"
>
  <span class="fc-rating__icon" aria-hidden="true">★</span>
  <span class="fc-rating__icon" aria-hidden="true">★</span>
  <span class="fc-rating__icon" aria-hidden="true">★</span>
  <span class="fc-rating__icon" aria-hidden="true">☆</span>
  <span class="fc-rating__icon" aria-hidden="true">☆</span>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | Radio group (APG); `role="img"` for read-only display |
| **Role(s)** | `radiogroup` on root (interactive); `img` on root (read-only); `radio` (native, on each input) |
| **Required attributes** | `aria-label="Rating"` on root; `aria-label="N star(s)"` on each radio; `aria-label="Rating: N out of M stars"` on read-only root |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

**Keyboard interaction**

| Key | Action |
|-----|--------|
| `Tab` | Enter the rating group (focuses checked or first radio) |
| `ArrowRight` / `ArrowDown` | Increase rating by 1 (roving tabindex — native radio behavior) |
| `ArrowLeft` / `ArrowUp` | Decrease rating by 1 |
| `Space` | Select focused radio value |
| `Tab` (from last radio) | Exit the group |

---

## Behavior

**Native element / API used:** `<input type="radio">` for interaction — leverages native radio group roving tabindex.

**Machine responsibilities:**
- Track `hoveredValue` on `mouseenter`/`mouseleave` on items — set `data-state="active"` on items up to hovered value
- Clear hover state on `mouseleave` from root — revert icon fill to selected value
- Track `selectedValue` on radio `change` event
- Update `aria-live` `value-label` text on value change
- In read-only mode: render icons only; no inputs; root gets `role="img"` with full value label
- Emit `fc:change` on selection

**`@foolscap/core` API sketch:**

```ts
createRating(options?: {
  max?: number                  // default: 5
  defaultValue?: number         // default: 0
  readOnly?: boolean            // default: false
  name?: string                 // radio input name attribute
}): {
  getRootProps(): Record<string, unknown>
  getItemProps(value: number): Record<string, unknown>
  getInputProps(value: number): Record<string, unknown>
  getIconProps(value: number): Record<string, unknown>
  state: {
    selectedValue: number
    hoveredValue: number | null
    isReadOnly: boolean
    max: number
  }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:change` | `{ value: number }` | User selects a rating |
| `fc:hover` | `{ value: number \| null }` | User hovers over a star |

---

## Notes

- The hover-preview CSS relies on `data-state="active"` propagating to all items *up to and including* the hovered item. The machine sets this on all items ≤ `hoveredValue`.
- Half-star ratings are not in v1 scope.
- The `value-label` uses `aria-live="polite"` so changes are announced without interrupting screen reader navigation.
- In read-only mode the entire component is a single `role="img"` landmark — no interactive elements.
