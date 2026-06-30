# Form

> A grouping of input controls that allow a user to submit information to a server.
> **Tier:** 2 — Platform + shim
> **Also known as:** —
> **Native element:** `<form>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<form>` | `.fc-form` | Carries `data-state`; native form semantics |
| `fields` | `<div>` | `.fc-form__fields` | Slot wrapper for form field components |
| `error-summary` | `<div>` | `.fc-form__error-summary` | Top-level error list; `role="alert"`; hidden until errors exist |
| `actions` | `<div>` | `.fc-form__actions` | Slot for submit / cancel buttons |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Submission state | `data-state` | `idle` · `submitting` · `error` · `success` | `root` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-form-gap` | `gap` between fields | `1.25rem` |
| `--fc-form-actions-gap` | `gap` between action buttons | `0.75rem` |
| `--fc-form-error-summary-border` | `border` on error summary | `1px solid var(--ink)` |
| `--fc-form-error-summary-padding` | `padding` on error summary | `0.75rem 1rem` |
| `--fc-form-error-summary-bg` | `background` on error summary | `var(--grey-100)` |

---

## HTML — Classless

```html
<form method="post" action="/submit">
  <label for="name">Name</label>
  <input id="name" name="name" type="text" required />

  <label for="email">Email</label>
  <input id="email" name="email" type="email" required />

  <button type="submit">Submit</button>
</form>
```

---

## HTML — Class-based

```html
<form class="fc-form" data-state="idle" novalidate>
  <div class="fc-form__error-summary" role="alert" hidden>
    <p>Please fix the following errors:</p>
    <ul>
      <!-- error links injected by shim -->
    </ul>
  </div>

  <div class="fc-form__fields">
    <!-- fc-text-input, fc-select, etc. slotted here -->
  </div>

  <div class="fc-form__actions">
    <button type="submit" class="fc-button" data-variant="primary">Submit</button>
    <button type="button" class="fc-button" data-variant="ghost">Cancel</button>
  </div>
</form>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern — native `<form>` semantics apply |
| **Role(s)** | `form` (implicit on `<form>` with `aria-label`); `alert` on error summary |
| **Required attributes** | `aria-label` or `aria-labelledby` on `<form>` when multiple forms exist on a page; `role="alert"` on error summary so screen readers announce it on injection |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

**Keyboard interaction**

| Key | Action |
|-----|--------|
| `Tab` / `Shift+Tab` | Traverse form fields and actions (native) |
| `Enter` (in text field) | Submit form (native) |
| `Enter` / `Space` (on submit button) | Submit form (native) |

---

## Behavior

**Native element / API used:** `<form>` with `novalidate` attribute — disables browser native validation UI so the shim can provide consistent cross-browser error presentation.

**Shim responsibilities:**
- **Submit interception:** Attach `submit` event listener; prevent default; set `data-state="submitting"` and dispatch `fc:submit` (cancellable via `event.preventDefault()`).
- **Validation orchestration:** Run the consumer-supplied `validate` function; collect errors keyed by field `name`; set `data-state="error"` and populate the error summary; move focus to error summary.
- **Success / error handling:** After `onSubmit` resolves, set `data-state="success"` or `"error"` accordingly and dispatch `fc:success` / `fc:error`.
- **Re-submission guard:** While `data-state="submitting"`, disable the submit button via `aria-disabled` + `disabled` to prevent duplicate submissions.

**`@foolscap/core` API sketch:**

```ts
createForm(options: {
  onSubmit: (data: FormData) => Promise<void>
  validate?: (data: FormData) => Record<string, string> | null
}): {
  getFormProps(): Record<string, unknown>
  state: {
    status: 'idle' | 'submitting' | 'error' | 'success'
    errors: Record<string, string>
  }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:submit` | `{ formData: FormData }` | Before async `onSubmit`; cancellable |
| `fc:success` | `{}` | After `onSubmit` resolves |
| `fc:error` | `{ errors: Record<string, string> }` | After validation fails or `onSubmit` rejects |

---

## Notes

- `novalidate` is set by the shim (or by the consumer in class-based mode) so the error presentation is fully controlled by Foolscap rather than the browser's native tooltip UI.
- The error summary lists each error as a link (`<a href="#field-id">`) so keyboard users can jump directly to the offending field.
- Field-level error wiring is the responsibility of individual input components (e.g. `fc-text-input`); the form shim only orchestrates the summary and state.
- Future expansion: multi-step / wizard form composition, dirty-state tracking, auto-save.
