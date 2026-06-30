# Search Input

> Allows users to find content by entering a search term.
> **Tier:** 1 — CSS only
> **Also known as:** Search
> **Native element:** `<input type="search">`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-search-input` | Wrapper; carries `data-state` |
| `icon` | `<span>` | `.fc-search-input__icon` | Search icon slot (`aria-hidden="true"`) |
| `input` | `<input type="search">` | `.fc-search-input__input` | Native search input |
| `clear` | `<button>` | `.fc-search-input__clear` | Shown when value present; hidden by default |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Has value | `data-state` | `has-value` | `root` |

> `data-state="has-value"` reveals the clear button via CSS. Set by a lightweight JS `input` event listener — minimal progressive enhancement.

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-search-input-border` | `border` | `1px solid var(--ink)` |
| `--fc-search-input-padding` | `padding` on input | `0.5rem 0.75rem 0.5rem 2.25rem` (icon indent) |
| `--fc-search-input-radius` | `border-radius` | `0` |
| `--fc-search-input-focus-ring` | `outline` on focus | `2px solid var(--ink)` |

---

## HTML — Classless

```html
<label for="site-search">Search</label>
<input type="search" id="site-search" name="q" placeholder="Search…">
```

---

## HTML — Class-based

```html
<div class="fc-search-input">
  <span class="fc-search-input__icon" aria-hidden="true"><!-- search icon --></span>
  <input class="fc-search-input__input" type="search" id="site-search" name="q"
         placeholder="Search…" aria-label="Search" autocomplete="off">
  <button class="fc-search-input__clear" type="button" aria-label="Clear search" tabindex="-1">×</button>
</div>

<!-- Inside a form for submission -->
<form role="search" action="/search">
  <div class="fc-search-input">
    <span class="fc-search-input__icon" aria-hidden="true"><!-- icon --></span>
    <input class="fc-search-input__input" type="search" name="q" placeholder="Search…"
           aria-label="Search the site">
    <button class="fc-search-input__clear" type="button" aria-label="Clear" tabindex="-1">×</button>
  </div>
  <button class="fc-button" type="submit">Search</button>
</form>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | `<input type="search">` has implicit `searchbox` role; wrapping `<form role="search">` provides `search` landmark |
| **Required attributes** | `aria-label` on input when no visible `<label>` is present; `role="search"` on the wrapping `<form>` |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Notes

- The clear button uses `tabindex="-1"` by default to keep it out of the tab order; users can clear via the native browser clear button on `input[type=search]` or via the keyboard shortcut for the field.
- `input[type=search]` renders a native clear `×` button in some browsers (Chrome/Safari); hide it via `::-webkit-search-cancel-button { display: none }` to avoid duplication with the custom clear button.
- For autocomplete/suggestions dropdown, use the Combobox component (Tier 3).
