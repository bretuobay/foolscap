# Color Picker

> An input for choosing a color.
> **Tier:** 1 — CSS only
> **Also known as:** —
> **Native element:** `<input type="color">`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-color-picker` | Wrapper |
| `label` | `<label>` | `.fc-color-picker__label` | Associated via `for` |
| `swatch` | `<span>` | `.fc-color-picker__swatch` | Visual preview of current color (CSS `background-color` via inline style) |
| `input` | `<input type="color">` | `.fc-color-picker__input` | Native; may be visually overlaid by swatch |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-color-picker-swatch-size` | `width` + `height` on swatch | `2rem` |
| `--fc-color-picker-swatch-border` | `border` on swatch | `1px solid var(--ink)` |
| `--fc-color-picker-swatch-radius` | `border-radius` on swatch | `0` |

---

## HTML — Classless

```html
<label for="brand-color">Brand color</label>
<input type="color" id="brand-color" name="brand-color" value="#1A1A1A">
```

---

## HTML — Class-based

```html
<div class="fc-color-picker">
  <label class="fc-color-picker__label" for="brand-color">Brand color</label>
  <div class="fc-color-picker__wrapper">
    <span class="fc-color-picker__swatch" style="background-color: #1A1A1A;" aria-hidden="true"></span>
    <input class="fc-color-picker__input" type="color" id="brand-color" name="brand-color" value="#1A1A1A">
  </div>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | Inherited (`<input type="color">` is implicit) |
| **Required attributes** | `<label>` associated via `for`/`id` |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Notes

- Styling `input[type=color]` is inconsistent across browsers. The recommended approach: overlay the swatch `<span>` on top of the input, make the input transparent/nearly hidden, and update the swatch `background-color` via `input` event in JS — a thin progressive enhancement.
- In classless mode, the native color picker UI is used as-is; no swatch overlay.
- For a full hue/saturation/lightness picker with custom UI, a Tier 3 component is needed (out of scope for v1).
