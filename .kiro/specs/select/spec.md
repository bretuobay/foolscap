# Select

> Displays a list of options for the user to pick from, triggered by a button.
> **Tier:** 3 — Headless machine
> **Also known as:** Dropdown, Listbox, Combobox (select-only)
> **Native element:** `<select>` (hidden; for form submission) + custom listbox overlay

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-select` | Outer wrapper; positions trigger + listbox |
| `label` | `<label>` | `.fc-select__label` | Associates with hidden `<select>` via `for` |
| `trigger` | `<button>` | `.fc-select__trigger` | Opens the listbox; displays selected value |
| `trigger-value` | `<span>` | `.fc-select__trigger-value` | Text of selected item or placeholder |
| `trigger-icon` | `<span>` | `.fc-select__trigger-icon` | Chevron icon; `aria-hidden="true"` |
| `listbox` | `<div>` | `.fc-select__listbox` | `role="listbox"`; positioned via Floating UI |
| `option` | `<div>` | `.fc-select__option` | `role="option"`; one per choice |
| `option-label` | `<span>` | `.fc-select__option-label` | Option display text |
| `option-check` | `<span>` | `.fc-select__option-check` | Checkmark shown on selected option |
| `native` | `<select>` | `.fc-select__native` | Visually hidden; synced for form submission |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Listbox open/closed | `data-state` | `open \| closed` | `root` |
| Expanded (a11y) | `aria-expanded` | `true \| false` | `trigger` |
| Active option | `aria-activedescendant` | `[option id]` | `trigger` |
| Option selected | `aria-selected` | `true \| false` | `option` |
| Option highlighted | `data-state` | `highlighted` | `option` |
| Disabled | `data-state` | `disabled` | `root` or individual `option` |
| Required | `aria-required` | `true` | `trigger` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-select-trigger-height` | `height` on `trigger` | `40px` |
| `--fc-select-trigger-padding` | `padding` on `trigger` | `0 var(--fc-space-3)` |
| `--fc-select-trigger-border` | `border` on `trigger` | `1px solid var(--ink)` |
| `--fc-select-trigger-radius` | `border-radius` on `trigger` | `2px` |
| `--fc-select-listbox-bg` | `background` on `listbox` | `var(--paper-raised)` |
| `--fc-select-listbox-shadow` | `box-shadow` on `listbox` | `0 4px 16px rgba(0,0,0,0.12)` |
| `--fc-select-option-padding` | `padding` on `option` | `var(--fc-space-2) var(--fc-space-3)` |
| `--fc-select-option-highlight-bg` | `background` on highlighted `option` | `var(--grey-100)` |
| `--fc-select-listbox-max-height` | `max-height` on `listbox` | `240px` |
| `--fc-select-z-index` | `z-index` on `listbox` | `1000` |

---

## HTML — Classless

```html
<!-- Native <select> — fully accessible, no JS needed -->
<label for="country">Country</label>
<select id="country" name="country">
  <option value="">Select a country</option>
  <option value="us">United States</option>
  <option value="ca">Canada</option>
  <option value="gb">United Kingdom</option>
</select>
```

---

## HTML — Class-based

```html
<div class="fc-select" data-state="closed">
  <label class="fc-select__label" for="select-native-country">Country</label>

  <!-- Hidden native select for form submission -->
  <select class="fc-select__native" id="select-native-country" name="country" aria-hidden="true" tabindex="-1">
    <option value="">Select a country</option>
    <option value="us">United States</option>
    <option value="ca">Canada</option>
    <option value="gb">United Kingdom</option>
  </select>

  <!-- Custom trigger -->
  <button
    class="fc-select__trigger"
    type="button"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-labelledby="select-label-country select-value-country"
    aria-activedescendant=""
    id="select-trigger-country"
  >
    <span class="fc-select__trigger-value" id="select-value-country">Select a country</span>
    <span class="fc-select__trigger-icon" aria-hidden="true">▾</span>
  </button>

  <!-- Floating listbox -->
  <div
    class="fc-select__listbox"
    role="listbox"
    aria-label="Country"
    id="select-listbox-country"
    hidden
  >
    <div class="fc-select__option" role="option" id="opt-us" aria-selected="false" data-value="us">
      <span class="fc-select__option-label">United States</span>
      <span class="fc-select__option-check" aria-hidden="true">✓</span>
    </div>
    <div class="fc-select__option" role="option" id="opt-ca" aria-selected="false" data-value="ca">
      <span class="fc-select__option-label">Canada</span>
      <span class="fc-select__option-check" aria-hidden="true">✓</span>
    </div>
    <div class="fc-select__option" role="option" id="opt-gb" aria-selected="false" data-value="gb">
      <span class="fc-select__option-label">United Kingdom</span>
      <span class="fc-select__option-check" aria-hidden="true">✓</span>
    </div>
  </div>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [Select-Only Combobox (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/) |
| **Role(s)** | `button` with `aria-haspopup="listbox"` on trigger; `listbox` on list; `option` on each item |
| **Required attributes** | `aria-expanded` on trigger; `aria-haspopup="listbox"` on trigger; `aria-activedescendant` on trigger when open; `aria-selected` on each option; `aria-label` on listbox |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

**Keyboard interaction**

| Key | Action |
|-----|--------|
| `Enter` / `Space` / `ArrowDown` on trigger | Open listbox; highlight selected (or first) option |
| `ArrowDown` | Move highlight to next option |
| `ArrowUp` | Move highlight to previous option |
| `Home` | Move highlight to first option |
| `End` | Move highlight to last option |
| `Enter` / `Space` | Select highlighted option; close listbox |
| `Escape` | Close listbox; return focus to trigger |
| `Tab` | Close listbox; move focus out |
| Printable char | Type-ahead: jump to first option starting with typed character |

---

## Behavior

**Native element / API used:** Custom `role="listbox"` + hidden `<select>` for form submission. Floating UI for listbox positioning.

**Machine responsibilities:**
- Open/close listbox on trigger click and keyboard events
- Track `highlightedIndex` and `selectedValue`
- On open: position listbox via Floating UI (`placement: 'bottom-start'`, flip/shift middleware); set `aria-activedescendant` on trigger to highlighted option's `id`
- Keyboard navigation: ArrowDown/Up move highlight; wrap at boundaries (optional); Home/End jump to first/last
- Type-ahead: buffer pressed printable characters (reset after 500ms timeout); jump to first matching option
- On selection: close listbox; update trigger display value; sync hidden `<select>` value; emit `fc:change`
- Close on outside click (`pointerdown`) and `Escape`
- Keep DOM focus on trigger at all times (not on options) — `aria-activedescendant` pattern

**`@foolscap/core` API sketch:**

```ts
createSelect(options?: {
  items: Array<{ value: string; label: string; disabled?: boolean }>
  defaultValue?: string
  placeholder?: string
  name?: string                   // passed to hidden <select>
}): {
  getRootProps(): Record<string, unknown>
  getLabelProps(): Record<string, unknown>
  getTriggerProps(): Record<string, unknown>
  getTriggerValueProps(): Record<string, unknown>
  getListboxProps(): Record<string, unknown>
  getOptionProps(value: string): Record<string, unknown>
  getNativeSelectProps(): Record<string, unknown>
  state: {
    isOpen: boolean
    selectedValue: string | null
    selectedLabel: string | null
    highlightedValue: string | null
  }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:change` | `{ value: string, label: string, prevValue: string \| null }` | User selects an option |
| `fc:open` | `{}` | Listbox opens |
| `fc:close` | `{}` | Listbox closes |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-size` | `sm \| md \| lg` | Trigger height and font size |
| `data-state` | `open \| closed` | Current listbox visibility (CSS hooks) |

---

## Notes

- The hidden `<select>` must be `aria-hidden="true"` and `tabindex="-1"` — it exists only for form serialization, not AT.
- **Why not just use `<select>`?** Native `<select>` is not styleable across browsers. This pattern provides full visual control while keeping form compatibility.
- Floating UI's `flip` middleware ensures the listbox appears above the trigger when near the bottom of the viewport.
- For large datasets (100+ options), add a search input (Combobox pattern) rather than type-ahead alone.
- Groups (`optgroup` equivalent) can be added as `role="group"` containers within the listbox with `aria-label`.
