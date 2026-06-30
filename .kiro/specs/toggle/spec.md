# Toggle

> A control used to switch between two states, often on or off.
> **Tier:** 2 — Platform + shim
> **Also known as:** Switch, Lightswitch, Toggle button
> **Native element:** `<input type="checkbox">`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<label>` | `.fc-toggle` | Wrapper; associates label with input |
| `input` | `<input type="checkbox">` | `.fc-toggle__input` | Visually hidden; source of truth for checked state |
| `track` | `<span>` | `.fc-toggle__track` | Visual pill; styled via `:checked` on sibling input |
| `thumb` | `<span>` | `.fc-toggle__thumb` | Circle that slides within the track; child of `track` |
| `label` | `<span>` | `.fc-toggle__label` | Visible text label (optional) |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Checked | `:checked` CSS pseudo-class | — | `input` |
| Disabled | `disabled` attribute | — | `input`; `root` gains `data-disabled` |

> States are driven by native CSS pseudo-classes on the `<input>`. No `data-state` attribute is needed on the root for the basic checked/unchecked toggle.

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-toggle-track-width` | `width` on track | `2.75rem` |
| `--fc-toggle-track-height` | `height` on track | `1.5rem` |
| `--fc-toggle-track-radius` | `border-radius` on track | `full (9999px)` |
| `--fc-toggle-thumb-size` | `width` and `height` on thumb | `1.125rem` |
| `--fc-toggle-thumb-offset` | `margin` / `translate` on thumb (unchecked) | `0.1875rem` |
| `--fc-toggle-checked-bg` | `background` on track when checked | `var(--ink)` |
| `--fc-toggle-unchecked-bg` | `background` on track when unchecked | `var(--grey-300)` |
| `--fc-toggle-thumb-bg` | `background` on thumb | `var(--paper-raised)` |
| `--fc-toggle-transition` | `transition` on track and thumb | `background 120ms ease, transform 120ms ease` |
| `--fc-toggle-gap` | `gap` between track and label | `0.5rem` |

---

## HTML — Classless

```html
<!-- Minimal: a styled checkbox that the classless sheet renders as a switch -->
<label>
  <input type="checkbox" role="switch" aria-checked="false" />
  Enable notifications
</label>
```

---

## HTML — Class-based

```html
<label class="fc-toggle">
  <input
    class="fc-toggle__input"
    type="checkbox"
    role="switch"
    id="notifications"
    aria-checked="false"
    aria-label="Enable notifications"
  />
  <span class="fc-toggle__track" aria-hidden="true">
    <span class="fc-toggle__thumb"></span>
  </span>
  <span class="fc-toggle__label">Enable notifications</span>
</label>

<!-- Disabled state -->
<label class="fc-toggle" data-disabled>
  <input class="fc-toggle__input" type="checkbox" role="switch" disabled />
  <span class="fc-toggle__track" aria-hidden="true">
    <span class="fc-toggle__thumb"></span>
  </span>
  <span class="fc-toggle__label">Dark mode</span>
</label>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [APG Switch Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/) |
| **Role(s)** | `switch` (set via `role="switch"` on the `<input>`) |
| **Required attributes** | `role="switch"` on input; `aria-checked` kept in sync with `checked` property; `aria-label` or visible `<label>` text required; `disabled` attribute disables both interaction and CSS |
| **Contrast** | Meets WCAG 2.2 AA — unchecked track uses `--grey-300`; ensure this clears 3:1 against page background for non-text contrast (WCAG 1.4.11) |

**Keyboard interaction**

| Key | Action |
|-----|--------|
| `Tab` | Move focus to the toggle |
| `Space` | Toggle checked / unchecked (native checkbox behavior) |

---

## Behavior

**Native element / API used:** `<input type="checkbox">` — the browser handles checked state, keyboard activation, and `disabled` natively.

**Shim responsibilities:**
- **`role="switch"` injection:** Set `role="switch"` on the input at init (in framework adapters this is a static prop; in the classless path it must be set in HTML).
- **`aria-checked` sync:** On each `change` event, update `aria-checked` on the input to match `input.checked` (browsers do not automatically maintain `aria-checked` when `role="switch"` is set).
- **`data-disabled` propagation:** When `input.disabled` is true, set `data-disabled` on the `root` label so CSS can dim the entire control.
- **Emit** `fc:change` with `{ checked: boolean }` on each `change` event.

**`@foolscap/core` API sketch:**

```ts
createToggle(options?: {
  defaultChecked?: boolean
  checked?: boolean       // controlled mode
  onChange?: (checked: boolean) => void
}): {
  getInputProps(): Record<string, unknown>
  state: { checked: boolean }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:change` | `{ checked: boolean }` | After native `change` event fires |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-size` | `sm` · `md` · `lg` | Scales track dimensions and thumb size via token overrides |

---

## Notes

- `aria-hidden="true"` on `track` and `thumb` prevents screen readers from announcing the decorative spans; the `<input>` with `role="switch"` and `aria-checked` carries all semantics.
- The track/thumb are purely decorative CSS — the actual interactive element is the hidden `<input>`. This means no extra JavaScript is needed for click handling.
- The classless path styles `input[type="checkbox"]` as a simple checkbox; the track/thumb visual requires the class-based HTML. Consider documenting this limitation clearly.
- Future expansion: `indeterminate` state (three-way toggle), icon inside thumb, custom on/off labels.
