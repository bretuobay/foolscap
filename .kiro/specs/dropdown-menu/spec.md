# Dropdown Menu

> A menu whose options are hidden until a button is interacted with; shows actions or navigation rather than acting as a form input.
> **Tier:** 3 — Headless machine
> **Also known as:** —
> **Native element:** —

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-dropdown-menu` | Wrapper; carries `data-state` |
| `trigger` | `<button>` | `.fc-dropdown-menu__trigger` | Opens/closes the menu |
| `menu` | `<ul>` | `.fc-dropdown-menu__menu` | `role="menu"`; positioned via Floating UI |
| `item` | `<li>` | `.fc-dropdown-menu__item` | `role="menuitem"` — an action |
| `item-icon` | `<span>` | `.fc-dropdown-menu__item-icon` | Optional icon inside item (`aria-hidden`) |
| `item-label` | `<span>` | `.fc-dropdown-menu__item-label` | Item text |
| `separator` | `<li>` | `.fc-dropdown-menu__separator` | `role="separator"` — visual divider |
| `group` | `<li>` | `.fc-dropdown-menu__group` | `role="group"` — optional item grouping |
| `group-label` | `<span>` | `.fc-dropdown-menu__group-label` | Visual label for a group (`aria-hidden`) |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Menu open/closed | `data-state` | `open \| closed` | `root` |
| Expanded | `aria-expanded` | `true \| false` | `trigger` |
| Has popup | `aria-haspopup` | `menu` | `trigger` |
| Menu ref | `aria-controls` | `[menu id]` | `trigger` |
| Active item | `data-state` | `active` | `item` |
| Disabled item | `data-state` | `disabled` | `item` |
| Disabled item (a11y) | `aria-disabled` | `true` | `item` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-dropdown-menu-min-width` | `min-width` on `menu` | `160px` |
| `--fc-dropdown-menu-border` | `border` on `menu` | `1px solid var(--ink)` |
| `--fc-dropdown-menu-shadow` | `box-shadow` on `menu` | `0 4px 12px rgb(0 0 0 / 0.1)` |
| `--fc-dropdown-menu-bg` | `background` on `menu` | `var(--paper-raised)` |
| `--fc-dropdown-menu-item-padding` | `padding` on `item` | `var(--fc-space-2) var(--fc-space-3)` |
| `--fc-dropdown-menu-item-active-bg` | `background` on active `item` | `var(--grey-100)` |
| `--fc-dropdown-menu-separator-color` | `border-color` on `separator` | `var(--grey-200)` |

---

## HTML — Classless

```html
<!-- No native equivalent for an action menu with hidden/shown items.
     Minimal HTML-only approximation — always visible, no keyboard management. -->
<button>Actions ▾</button>
<ul>
  <li><a href="/edit">Edit</a></li>
  <li><a href="/duplicate">Duplicate</a></li>
  <li><a href="/delete">Delete</a></li>
</ul>
```

---

## HTML — Class-based

```html
<div class="fc-dropdown-menu" data-state="open">
  <button
    class="fc-dropdown-menu__trigger"
    aria-haspopup="menu"
    aria-expanded="true"
    aria-controls="actions-menu"
  >
    Actions ▾
  </button>

  <ul class="fc-dropdown-menu__menu" id="actions-menu" role="menu">
    <li class="fc-dropdown-menu__item" role="menuitem" data-state="active">
      <span class="fc-dropdown-menu__item-icon" aria-hidden="true">✎</span>
      <span class="fc-dropdown-menu__item-label">Edit</span>
    </li>
    <li class="fc-dropdown-menu__item" role="menuitem">
      <span class="fc-dropdown-menu__item-label">Duplicate</span>
    </li>
    <li class="fc-dropdown-menu__separator" role="separator"></li>
    <li class="fc-dropdown-menu__item" role="menuitem" data-state="disabled" aria-disabled="true">
      <span class="fc-dropdown-menu__item-label">Delete</span>
    </li>
  </ul>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [Menu Button (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) |
| **Role(s)** | `menu` on list; `menuitem` on each item; `separator` on dividers |
| **Required attributes** | `aria-haspopup="menu"` + `aria-expanded` + `aria-controls` on trigger |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

**Keyboard interaction**

| Key | Action |
|-----|--------|
| `Enter` / `Space` / `ArrowDown` on trigger | Open menu; move focus to first item |
| `ArrowUp` on trigger | Open menu; move focus to last item |
| `ArrowDown` | Move focus to next item (wraps to first) |
| `ArrowUp` | Move focus to previous item (wraps to last) |
| `Home` | Move focus to first item |
| `End` | Move focus to last item |
| `Enter` / `Space` on item | Activate item; close menu |
| `Escape` | Close menu; return focus to trigger |
| Printable character | Move focus to next item starting with that character |
| `Tab` | Close menu; move focus to next element in page |

---

## Behavior

**Native element / API used:** `<button>` trigger + `<ul role="menu">`; Floating UI for positioning.

**Machine responsibilities:**
- Toggle menu open/close on trigger click; set `aria-expanded`
- Move DOM focus into menu on open (first non-disabled item)
- Manage `activeIndex` — DOM focus moves to each item (not `aria-activedescendant`)
- Skip disabled items in keyboard navigation
- Close on: item activation, `Escape`, `Tab`, outside `pointerdown`
- Return focus to trigger on close
- Type-ahead: on printable key press, move focus to next item whose label starts with that character
- Floating UI: position below trigger, flip above if insufficient space
- Emit `fc:select` when an item is activated, `fc:open` / `fc:close`

**`@foolscap/core` API sketch:**

```ts
createDropdownMenu(options?: {
  items: Array<{
    value: string
    label: string
    disabled?: boolean
    separator?: boolean
  }>
}): {
  getTriggerProps(): Record<string, unknown>
  getMenuProps(): Record<string, unknown>
  getItemProps(index: number): Record<string, unknown>
  getSeparatorProps(): Record<string, unknown>
  open(): void
  close(): void
  state: {
    isOpen: boolean
    activeIndex: number | null
  }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:select` | `{ value: string, label: string }` | User activates a menu item |
| `fc:open` | `{}` | Menu opens |
| `fc:close` | `{}` | Menu closes |

---

## Notes

- This component is for **actions**, not form selection. Use `Select` for choosing a form value.
- Disabled items remain in the DOM and are focusable with keyboard navigation (`aria-disabled="true"`) so screen readers can announce them as disabled — they do not respond to `Enter`/`Space`.
- Sub-menus (nested menus) are out of v1 scope. Extension: add `role="menuitem" aria-haspopup="menu"` on trigger items for nested menus.
- `Dropdown menu` ≠ `Select` ≠ `Navigation` — they share visual similarity but differ in ARIA semantics.
