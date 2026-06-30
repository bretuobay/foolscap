# Textarea

> A multi-line text field for capturing larger amounts of user input.
> **Tier:** 1 — CSS only
> **Also known as:** Text area, Multi-line input
> **Native element:** `<textarea>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-textarea` | Wrapper; carries `data-state` |
| `label` | `<label>` | `.fc-textarea__label` | Always visible; associated via `for` |
| `hint` | `<p>` | `.fc-textarea__hint` | Helper text below the label |
| `textarea` | `<textarea>` | `.fc-textarea__input` | Native multi-line input |
| `character-count` | `<p>` | `.fc-textarea__count` | Live character count; `aria-live="polite"` |
| `error` | `<p>` | `.fc-textarea__error` | Error message linked via `aria-describedby` |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Validation | `data-state` | `idle` · `error` · `success` | `root` |
| Resize axis | `data-resize` | `none` · `vertical` (default) · `both` | `root` |
| Disabled | native `disabled` on textarea | — | `textarea` |
| Read-only | native `readonly` on textarea | — | `textarea` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-textarea-border` | `border` | `1px solid var(--ink)` |
| `--fc-textarea-radius` | `border-radius` | `0` |
| `--fc-textarea-padding` | `padding` on textarea | `0.5rem 0.75rem` |
| `--fc-textarea-font-size` | `font-size` | `1rem` |
| `--fc-textarea-font-family` | `font-family` | `inherit` |
| `--fc-textarea-min-height` | `min-height` | `7rem` |
| `--fc-textarea-bg` | `background-color` | `var(--paper)` |
| `--fc-textarea-color` | `color` | `var(--ink)` |
| `--fc-textarea-focus-ring` | `outline` on focus | `2px solid var(--ink)` |
| `--fc-textarea-disabled-opacity` | `opacity` when disabled | `0.45` |

---

## HTML — Classless

```html
<label for="bio">Biography</label>
<textarea id="bio" name="bio" rows="5" maxlength="500"></textarea>
```

---

## HTML — Class-based

```html
<!-- Default -->
<div class="fc-textarea">
  <label class="fc-textarea__label" for="bio">Biography</label>
  <p class="fc-textarea__hint" id="bio-hint">Maximum 500 characters.</p>
  <textarea class="fc-textarea__input" id="bio" name="bio"
            rows="5" maxlength="500"
            aria-describedby="bio-hint bio-count"></textarea>
  <p class="fc-textarea__count" id="bio-count" aria-live="polite">0 / 500</p>
</div>

<!-- Error state -->
<div class="fc-textarea" data-state="error">
  <label class="fc-textarea__label" for="message">Message</label>
  <textarea class="fc-textarea__input" id="message" name="message"
            rows="4" aria-invalid="true" aria-describedby="message-error"></textarea>
  <p class="fc-textarea__error" id="message-error" role="alert">
    Message must be at least 10 characters.
  </p>
</div>

<!-- Non-resizable (fixed height) -->
<div class="fc-textarea" data-resize="none">
  <label class="fc-textarea__label" for="notes">Internal notes</label>
  <textarea class="fc-textarea__input" id="notes" name="notes" rows="3"></textarea>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | `<textarea>` has implicit `textbox` role with `aria-multiline="true"` |
| **Required attributes** | `<label>` + `for`/`id`; `aria-describedby` for hint and/or error; `aria-invalid="true"` in error state |
| **Contrast** | Text 4.5:1; border vs background 3:1 non-text contrast |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-resize` | `vertical` (default) · `none` · `both` | Controls CSS `resize` property on the textarea |
| `data-state` | `idle` · `error` · `success` | Visual state; `error` adds error border |

---

## Notes

- `font-family: inherit` is crucial — browsers default textarea to `monospace`.
- Auto-growing height (textarea expanding as user types) requires a small JS observer: set `textarea.style.height = 'auto'; textarea.style.height = textarea.scrollHeight + 'px'` on `input` events. This is optional progressive enhancement and does not move the component into Tier 2.
- Character count (`aria-live="polite"`) should debounce announcements — updating on every keystroke is distracting for screen reader users. Announce at milestones or when near/at the limit.
