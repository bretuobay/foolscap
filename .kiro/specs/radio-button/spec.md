# Radio Button

> Allows a user to select a single option from a list of predefined options.
> **Tier:** 1 — CSS only
> **Also known as:** Radio, Radio group
> **Native element:** `<input type="radio">`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-radio` | Wrapper for a single radio + label |
| `input` | `<input type="radio">` | `.fc-radio__input` | Native; visually hidden but focusable |
| `control` | `<span>` | `.fc-radio__control` | Custom visual circle (CSS only) |
| `label` | `<label>` | `.fc-radio__label` | Associated via `for` |
| `hint` | `<p>` | `.fc-radio__hint` | Optional per-option helper text |

> Group multiple radios in a `<fieldset class="fc-fieldset"><legend>…</legend>` wrapper.

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-radio-size` | `width` + `height` on control | `1.125rem` |
| `--fc-radio-border` | `border` on control | `1px solid var(--ink)` |
| `--fc-radio-dot-size` | inner dot size when checked | `0.5rem` |
| `--fc-radio-dot-color` | inner dot color | `var(--ink)` |
| `--fc-radio-gap` | `gap` between control and label | `var(--fc-space-2)` |

---

## HTML — Classless

```html
<fieldset>
  <legend>Preferred contact method</legend>
  <label><input type="radio" name="contact" value="email"> Email</label>
  <label><input type="radio" name="contact" value="phone"> Phone</label>
  <label><input type="radio" name="contact" value="post"> Post</label>
</fieldset>
```

---

## HTML — Class-based

```html
<fieldset class="fc-fieldset">
  <legend class="fc-fieldset__legend">Preferred contact method</legend>
  <div class="fc-radio">
    <input class="fc-radio__input" type="radio" id="contact-email" name="contact" value="email">
    <span class="fc-radio__control" aria-hidden="true"></span>
    <label class="fc-radio__label" for="contact-email">Email</label>
  </div>
  <div class="fc-radio">
    <input class="fc-radio__input" type="radio" id="contact-phone" name="contact" value="phone">
    <span class="fc-radio__control" aria-hidden="true"></span>
    <label class="fc-radio__label" for="contact-phone">Phone</label>
  </div>
  <div class="fc-radio">
    <input class="fc-radio__input" type="radio" id="contact-post" name="contact" value="post">
    <span class="fc-radio__control" aria-hidden="true"></span>
    <label class="fc-radio__label" for="contact-post">Post</label>
    <p class="fc-radio__hint">Allow 5–7 business days.</p>
  </div>
</fieldset>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) |
| **Role(s)** | `<input type="radio">` has implicit `radio` role; `<fieldset>` provides `group` |
| **Required attributes** | All radios in a group share the same `name`; `<fieldset>` + `<legend>` names the group; `id`/`for` associates each input with its label |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Notes

- Custom visual control (`.fc-radio__control`) is `aria-hidden="true"`. The native `<input>` is visually hidden but remains keyboard-focusable and screen-reader-accessible.
- Keyboard navigation within a radio group: browsers handle arrow-key selection natively on `<input type="radio">` groups.
- For a button-group style radio (pill/segmented), see the Segmented Control spec (Tier 3).
