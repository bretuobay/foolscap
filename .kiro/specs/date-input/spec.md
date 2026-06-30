# Date Input

> A means of inputting a date, often separated into individual fields for day/month/year.
> **Tier:** 1 — CSS only
> **Also known as:** —
> **Native element:** `<input type="date">`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-date-input` | Wrapper; carries `data-state` for error |
| `label` | `<label>` | `.fc-date-input__label` | Associated via `for` |
| `input` | `<input type="date">` | `.fc-date-input__input` | Native date input |
| `hint` | `<p>` | `.fc-date-input__hint` | Optional helper text |
| `error` | `<p>` | `.fc-date-input__error` | Error message; `role="alert"` |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Error | `data-state` | `error` | `root` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-date-input-border` | `border` on input | `1px solid var(--ink)` |
| `--fc-date-input-border-error` | `border` when `data-state="error"` | `1px solid var(--ink)` (thicker/bolder in paper theme) |
| `--fc-date-input-padding` | `padding` on input | `0.5rem 0.75rem` |
| `--fc-date-input-radius` | `border-radius` | `0` |
| `--fc-date-input-focus-ring` | `outline` on focus | `2px solid var(--ink)` |

---

## HTML — Classless

```html
<label for="dob">Date of birth</label>
<input type="date" id="dob" name="dob" min="1900-01-01" max="2026-12-31">
```

---

## HTML — Class-based

```html
<div class="fc-date-input">
  <label class="fc-date-input__label" for="dob">Date of birth</label>
  <input class="fc-date-input__input" type="date" id="dob" name="dob"
         min="1900-01-01" max="2026-12-31" aria-describedby="dob-hint">
  <p class="fc-date-input__hint" id="dob-hint">Use the format DD/MM/YYYY</p>
</div>

<!-- Error state -->
<div class="fc-date-input" data-state="error">
  <label class="fc-date-input__label" for="dob2">Date of birth</label>
  <input class="fc-date-input__input" type="date" id="dob2" name="dob"
         aria-describedby="dob2-error" aria-invalid="true">
  <p class="fc-date-input__error" id="dob2-error" role="alert">Please enter a valid date.</p>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | Inherited from native `<input type="date">` |
| **Required attributes** | `<label>` via `for`/`id`; `aria-describedby` for hint/error; `aria-invalid="true"` when in error state |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Notes

- `input[type=date]` renders a browser-native date picker. Cross-browser appearance varies significantly; Foolscap styles the text area but cannot fully restyle the calendar pop-up in all browsers.
- For a fully styled calendar, use the Datepicker component (Tier 3).
- 3-part field fallback (separate day/month/year `<input type="number">` fields): not included in this spec — appropriate for accessibility-heavy forms where `input[type=date]` support is insufficient.
