# Checkbox

> An input for choosing from predefined options: a binary choice when used alone, or multiple selections in a group.
> **Tier:** 1 — CSS only (indeterminate state requires one line of JS)
> **Also known as:** —
> **Native element:** `<input type="checkbox">`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-checkbox` | Wrapper; carries `data-state` for indeterminate |
| `input` | `<input type="checkbox">` | `.fc-checkbox__input` | Native; visually hidden but focusable |
| `control` | `<span>` | `.fc-checkbox__control` | Custom visual checkbox (CSS only) |
| `label` | `<label>` | `.fc-checkbox__label` | Wraps or is associated via `for` |
| `hint` | `<p>` | `.fc-checkbox__hint` | Optional helper text |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Indeterminate | `data-state` | `indeterminate` | `root` |

> Checked/unchecked/disabled are handled by CSS `:checked` / `:disabled` pseudo-classes on the native input.

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-checkbox-size` | `width` + `height` on control | `1.125rem` |
| `--fc-checkbox-radius` | `border-radius` on control | `0` |
| `--fc-checkbox-border` | `border` on control | `1px solid var(--ink)` |
| `--fc-checkbox-check-color` | checkmark color | `var(--paper)` |
| `--fc-checkbox-bg-checked` | `background-color` when checked | `var(--ink)` |

---

## HTML — Classless

```html
<label>
  <input type="checkbox" name="agree" value="yes">
  I agree to the terms
</label>
```

---

## HTML — Class-based

```html
<div class="fc-checkbox">
  <input class="fc-checkbox__input" type="checkbox" id="agree" name="agree" value="yes">
  <span class="fc-checkbox__control" aria-hidden="true"></span>
  <label class="fc-checkbox__label" for="agree">I agree to the terms</label>
  <p class="fc-checkbox__hint">You must agree to continue.</p>
</div>

<!-- Indeterminate (set .indeterminate = true via JS; data-state set alongside) -->
<div class="fc-checkbox" data-state="indeterminate">
  <input class="fc-checkbox__input" type="checkbox" id="select-all">
  <span class="fc-checkbox__control" aria-hidden="true"></span>
  <label class="fc-checkbox__label" for="select-all">Select all</label>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [Checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) |
| **Role(s)** | Inherited (`<input type="checkbox">` is implicit `checkbox` role) |
| **Required attributes** | `id` + `for` association, or wrapping `<label>`; `aria-checked="mixed"` when indeterminate (set alongside `input.indeterminate`) |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Notes

- The visible custom control (`.fc-checkbox__control`) is `aria-hidden="true"`. All state is on the native `<input>`, which is visually hidden but not `display:none` (must remain focusable).
- Indeterminate: the caller sets `input.indeterminate = true` and `aria-checked="mixed"` via a single JS call. This is the minimum JS touch acceptable at Tier 1.
- Group multiple checkboxes with `<fieldset>` + `<legend>` (see Fieldset spec).
