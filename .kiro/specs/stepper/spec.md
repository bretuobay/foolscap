# Stepper

> A numeric input with increment and decrement controls, for entering or adjusting a quantity.
> **Tier:** 3 — Headless machine
> **Also known as:** Number stepper, Spinbutton, Quantity input
> **Native element:** `<input type="number">` (fallback)

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-stepper` | `role="group"` grouping label + controls |
| `label` | `<label>` | `.fc-stepper__label` | Associates with the hidden or visible input |
| `decrement` | `<button>` | `.fc-stepper__decrement` | Decrease value by step; `aria-label="Decrease"` |
| `input` | `<input>` or `<div>` | `.fc-stepper__input` | `role="spinbutton"` with `aria-valuemin/max/now/text` |
| `increment` | `<button>` | `.fc-stepper__increment` | Increase value by step; `aria-label="Increase"` |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Min reached | `data-state` | `at-min` | `root` |
| Max reached | `data-state` | `at-max` | `root` |
| Decrement disabled | `aria-disabled` + `disabled` | `true` | `decrement` when at min |
| Increment disabled | `aria-disabled` + `disabled` | `true` | `increment` when at max |
| Disabled (whole) | `data-state` | `disabled` | `root` |
| Value | `aria-valuenow` | Number | `input` |
| Min | `aria-valuemin` | Number | `input` |
| Max | `aria-valuemax` | Number | `input` |
| Text | `aria-valuetext` | String | `input` (when value needs unit suffix) |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-stepper-height` | `height` on `root` | `40px` |
| `--fc-stepper-button-width` | `width` on `decrement` / `increment` | `40px` |
| `--fc-stepper-input-width` | `width` on `input` | `56px` |
| `--fc-stepper-border` | `border` on `root` | `1px solid var(--ink)` |
| `--fc-stepper-radius` | `border-radius` on `root` | `2px` |
| `--fc-stepper-divider` | `border-inline` on `input` | `1px solid var(--grey-300)` |
| `--fc-stepper-font-size` | `font-size` on `input` | `var(--fc-font-size-base)` |

---

## HTML — Classless

```html
<!-- Native number input — fully accessible, no JS needed -->
<label for="qty">Quantity</label>
<input id="qty" type="number" name="qty" min="1" max="99" value="1" step="1" />
```

---

## HTML — Class-based

```html
<div class="fc-stepper" role="group" aria-labelledby="stepper-label-qty">
  <label class="fc-stepper__label" id="stepper-label-qty">Quantity</label>

  <div class="fc-stepper__controls">
    <button
      class="fc-stepper__decrement"
      type="button"
      aria-label="Decrease quantity"
      aria-controls="stepper-input-qty"
      disabled
      aria-disabled="true"
    >
      −
    </button>

    <div
      class="fc-stepper__input"
      id="stepper-input-qty"
      role="spinbutton"
      tabindex="0"
      aria-label="Quantity"
      aria-labelledby="stepper-label-qty"
      aria-valuemin="1"
      aria-valuemax="99"
      aria-valuenow="1"
      aria-valuetext="1"
    >
      1
    </div>

    <button
      class="fc-stepper__increment"
      type="button"
      aria-label="Increase quantity"
      aria-controls="stepper-input-qty"
    >
      +
    </button>
  </div>

  <!-- Hidden native input for form submission -->
  <input type="hidden" name="qty" value="1" />
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [Spinbutton (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/) |
| **Role(s)** | `spinbutton` on the input element; `group` on root |
| **Required attributes** | `aria-valuemin`, `aria-valuemax`, `aria-valuenow` on `input`; `aria-valuetext` when value includes a unit; `aria-label` on decrement/increment buttons |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

**Keyboard interaction**

| Key | Action |
|-----|--------|
| `Tab` | Focus the spinbutton input |
| `ArrowUp` | Increase value by step |
| `ArrowDown` | Decrease value by step |
| `PageUp` | Increase value by larger step (10× step) |
| `PageDown` | Decrease value by larger step (10× step) |
| `Home` | Set value to min |
| `End` | Set value to max |

---

## Behavior

**Native element / API used:** Custom `role="spinbutton"` display div + hidden `<input type="hidden">` for form submission. Falls back to `<input type="number">` for classless/no-JS usage.

**Machine responsibilities:**
- Track `value` clamped to `[min, max]` and snapped to `step`
- Increment/decrement button clicks: `value ± step`, clamped; update ARIA attrs and visible text; disable buttons at boundaries
- Keyboard on spinbutton: ArrowUp +step; ArrowDown −step; PageUp +largeStep; PageDown −largeStep; Home → min; End → max
- Hold-to-repeat: `pointerdown` on buttons — after 500ms initial delay, fire repeat at 60fps interval; stop on `pointerup` / `pointercancel` / `keyup`
- Inline editing: if `contenteditable` variant, accept numeric input only; parse and clamp on `blur`
- Sync hidden `<input type="hidden">` value for form submission
- Emit `fc:change` on every value commit

**`@foolscap/core` API sketch:**

```ts
createStepper(options?: {
  min?: number                    // default: 0
  max?: number                    // default: Infinity
  step?: number                   // default: 1
  largeStep?: number              // default: 10 × step
  defaultValue?: number           // default: min
  name?: string                   // hidden input name
  formatValue?: (value: number) => string  // for aria-valuetext display
}): {
  getRootProps(): Record<string, unknown>
  getLabelProps(): Record<string, unknown>
  getDecrementProps(): Record<string, unknown>
  getInputProps(): Record<string, unknown>
  getIncrementProps(): Record<string, unknown>
  increment(): void
  decrement(): void
  setValue(value: number): void
  state: {
    value: number
    isAtMin: boolean
    isAtMax: boolean
    isDisabled: boolean
  }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:change` | `{ value: number, prevValue: number }` | Value changes |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-size` | `sm \| md \| lg` | Height and font size |
| `data-state` | `at-min \| at-max \| disabled` | CSS state hooks |

---

## Notes

- **Hold-to-repeat** (the ability to hold the +/- button for continuous incrementing) should have an initial delay before starting to repeat. 500ms delay → then repeat every ~16ms (rAF) is a common pattern.
- When used in a form, the hidden `<input type="hidden">` holds the committed value. The custom `role="spinbutton"` display div is `aria-hidden="false"` (the AT target).
- Do NOT use `<input type="number">` as the custom spinbutton target — its browser spinners and text rendering are too inconsistent. Use it only as a classless/no-JS fallback.
- `formatValue` supports unit suffixes (e.g., `"5 items"`, `"$10"`). The raw numeric value is always stored in `aria-valuenow`; `aria-valuetext` carries the formatted string.
- This is a **numeric stepper** (spinbutton), not to be confused with the **Progress Indicator** (step tracker) — those are separate components.
