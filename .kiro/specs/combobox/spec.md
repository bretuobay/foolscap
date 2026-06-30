# Combobox

> An input that behaves like a select with the addition of a free text input to filter options.
> **Tier:** 3 — Headless machine
> **Also known as:** Autocomplete, Autosuggest
> **Native element:** `<input>` + `<datalist>` (classless fallback)

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-combobox` | Wrapper; `data-state` carries open/closed |
| `label` | `<label>` | `.fc-combobox__label` | Associates with `input` via `for`/`id` |
| `input-wrapper` | `<div>` | `.fc-combobox__input-wrapper` | Groups input + toggle button |
| `input` | `<input type="text">` | `.fc-combobox__input` | `role="combobox"` — the primary interactive element |
| `toggle` | `<button>` | `.fc-combobox__toggle` | Optional chevron button to open/close listbox |
| `listbox` | `<ul>` | `.fc-combobox__listbox` | `role="listbox"`; positioned via Floating UI |
| `option` | `<li>` | `.fc-combobox__option` | `role="option"` |
| `empty` | `<li>` | `.fc-combobox__empty` | Shown when no options match |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Open / closed | `data-state` | `open \| closed` | `root` |
| Listbox expanded | `aria-expanded` | `true \| false` | `input` |
| Autocomplete mode | `aria-autocomplete` | `list` | `input` |
| Listbox ref | `aria-controls` | `[listbox id]` | `input` |
| Active option | `aria-activedescendant` | `[option id]` | `input` |
| Selected option | `aria-selected` | `true \| false` | `option` |
| Focused option | `data-state` | `active` | `option` |
| Disabled option | `data-state` | `disabled` | `option` |
| Disabled input | `disabled` / `aria-disabled` | — | `input` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-combobox-listbox-max-height` | `max-height` on `listbox` | `320px` |
| `--fc-combobox-listbox-border` | `border` on `listbox` | `1px solid var(--ink)` |
| `--fc-combobox-listbox-shadow` | `box-shadow` on `listbox` | `0 2px 8px rgb(0 0 0 / 0.08)` |
| `--fc-combobox-option-padding` | `padding` on `option` | `var(--fc-space-2) var(--fc-space-3)` |
| `--fc-combobox-option-active-bg` | `background` on active `option` | `var(--grey-100)` |
| `--fc-combobox-option-selected-bg` | `background` on selected `option` | `var(--grey-200)` |

---

## HTML — Classless

```html
<!-- Native datalist fallback — no filtering UX, browser-native dropdown -->
<label for="fruit">Fruit</label>
<input id="fruit" list="fruit-options" type="text" autocomplete="off" />
<datalist id="fruit-options">
  <option value="Apple"></option>
  <option value="Banana"></option>
  <option value="Cherry"></option>
</datalist>
```

---

## HTML — Class-based

```html
<div class="fc-combobox" data-state="closed">
  <label class="fc-combobox__label" for="fruit-input">Fruit</label>
  <div class="fc-combobox__input-wrapper">
    <input
      class="fc-combobox__input"
      id="fruit-input"
      type="text"
      role="combobox"
      aria-expanded="false"
      aria-autocomplete="list"
      aria-controls="fruit-listbox"
      aria-activedescendant=""
      autocomplete="off"
    />
    <button class="fc-combobox__toggle" tabindex="-1" aria-label="Toggle options">▾</button>
  </div>
  <ul
    class="fc-combobox__listbox"
    id="fruit-listbox"
    role="listbox"
    aria-label="Fruit options"
  >
    <li class="fc-combobox__option" id="opt-apple" role="option" aria-selected="false">Apple</li>
    <li class="fc-combobox__option" id="opt-banana" role="option" aria-selected="false">Banana</li>
    <li class="fc-combobox__option" id="opt-cherry" role="option" aria-selected="true" data-state="active">Cherry</li>
  </ul>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [Combobox (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) |
| **Role(s)** | `combobox` on input; `listbox` on dropdown; `option` on each item |
| **Required attributes** | `aria-expanded`, `aria-autocomplete="list"`, `aria-controls` on input; `aria-selected` on each option; unique `id` on each option for `aria-activedescendant` |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

**Keyboard interaction**

| Key | Action |
|-----|--------|
| `ArrowDown` | Open listbox (if closed); move focus to next option |
| `ArrowUp` | Move focus to previous option; if at top, return focus to input |
| `Enter` | Select the focused option; close listbox |
| `Escape` | Clear input and close listbox; or just close if no selection |
| `Home` | Move focus to first option |
| `End` | Move focus to last option |
| `Tab` | Accept current value and move focus out of component |
| Printable characters | Filter the options list in real time |

---

## Behavior

**Native element / API used:** `<input type="text" role="combobox">` + `<ul role="listbox">`; Floating UI for listbox positioning.

**Machine responsibilities:**
- Filter `options` array against input value on each keystroke (case-insensitive substring match by default)
- Open listbox when input receives focus + has value, or on `ArrowDown`
- Track `activeIndex` for keyboard navigation via `aria-activedescendant` (DOM focus stays on input)
- Close listbox on selection, `Escape`, or outside click (`pointerdown` outside root)
- On option select: write display value to input, emit `fc:select`, close listbox
- On clear (Escape or ×): clear input value, reset filter, emit `fc:clear`
- Floating UI: position listbox below input, flip to above when insufficient space below, shift to stay in viewport
- Handle `toggle` button: clicking opens/closes listbox without moving DOM focus to listbox

**`@foolscap/core` API sketch:**

```ts
createCombobox(options?: {
  options: Array<{ value: string; label: string; disabled?: boolean }>
  placeholder?: string
  defaultValue?: string
  filterFn?: (option: { label: string }, inputValue: string) => boolean
}): {
  getRootProps(): Record<string, unknown>
  getLabelProps(): Record<string, unknown>
  getInputProps(): Record<string, unknown>
  getToggleProps(): Record<string, unknown>
  getListboxProps(): Record<string, unknown>
  getOptionProps(index: number): Record<string, unknown>
  state: {
    isOpen: boolean
    inputValue: string
    selectedValue: string | null
    activeIndex: number | null
    filteredOptions: Array<{ value: string; label: string; disabled?: boolean }>
  }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:select` | `{ value: string, label: string }` | User selects an option |
| `fc:input-change` | `{ value: string }` | Input value changes (each keystroke) |
| `fc:clear` | `{}` | Input is cleared |
| `fc:open` | `{}` | Listbox opens |
| `fc:close` | `{}` | Listbox closes |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-size` | `sm \| md \| lg` | Adjusts input + option padding and font size |

---

## Notes

- DOM focus never moves to the listbox — keyboard navigation is managed via `aria-activedescendant` on the input. This matches the APG combobox pattern.
- The `toggle` button uses `tabindex="-1"` so it is not in the Tab order; it's a click-only affordance.
- For async/remote options (search-as-you-type): the consumer passes a new `options` array on each `fc:input-change` event; the machine renders whatever is provided.
- Extension: `fc-combobox__group` + `fc-combobox__group-label` parts can be added for grouped options in v2.
