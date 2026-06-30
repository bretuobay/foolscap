# Label

> A text label for form inputs.
> **Tier:** 1 — CSS only
> **Also known as:** Form label
> **Native element:** `<label>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<label>` | `.fc-label` | Associated with input via `for`/`id` |
| `required-indicator` | `<span>` | `.fc-label__required` | `aria-hidden="true"`; visual asterisk only |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-label-font-size` | `font-size` | `0.875rem` |
| `--fc-label-font-weight` | `font-weight` | `500` |
| `--fc-label-color` | `color` | `var(--ink)` |
| `--fc-label-gap` | `margin-bottom` (space to input) | `var(--fc-space-1)` |
| `--fc-label-required-color` | `color` on required indicator | `var(--ink)` |

---

## HTML — Classless

```html
<label for="email">Email address</label>
<input type="email" id="email" name="email" required>

<!-- With required indicator -->
<label for="name">Full name <span aria-hidden="true">*</span></label>
<input type="text" id="name" name="name" required>
```

---

## HTML — Class-based

```html
<label class="fc-label" for="email">Email address</label>
<input type="email" id="email" name="email">

<!-- Required field -->
<label class="fc-label" for="name">
  Full name
  <span class="fc-label__required" aria-hidden="true">*</span>
</label>
<input type="text" id="name" name="name" required aria-required="true">
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern (native HTML) |
| **Role(s)** | Inherited (`<label>` has no explicit ARIA role) |
| **Required attributes** | `for` attribute matching the input's `id`; the required indicator `<span>` must be `aria-hidden="true"` — communicate required status via `required`/`aria-required` on the input |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Notes

- The asterisk (`*`) is a visual convention only. Screen readers must be informed of required fields via the `required` HTML attribute or `aria-required="true"` on the input — not by the asterisk.
- Label can wrap the input directly (`<label><input>…</label>`) in classless mode; in class-based mode `for`/`id` association is preferred for styling flexibility.
- Disabled input labels: apply `opacity` or `--ink-muted` colour via CSS `input:disabled + label` selector or by setting `data-state="disabled"` on the wrapper.
