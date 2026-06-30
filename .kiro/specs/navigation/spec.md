# Navigation

> A container for navigation links, to other pages or to elements within the current page.
> **Tier:** 3 — Headless machine
> **Also known as:** Nav, Menu
> **Native element:** `<nav>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<nav>` | `.fc-navigation` | `aria-label` required |
| `list` | `<ul>` | `.fc-navigation__list` | Top-level item list |
| `item` | `<li>` | `.fc-navigation__item` | One per nav entry |
| `link` | `<a>` | `.fc-navigation__link` | Navigation link |
| `trigger` | `<button>` | `.fc-navigation__trigger` | Disclosure button for items with sub-menus |
| `submenu` | `<ul>` | `.fc-navigation__submenu` | Nested link list |
| `submenu-item` | `<li>` | `.fc-navigation__submenu-item` | Item inside submenu |
| `submenu-link` | `<a>` | `.fc-navigation__submenu-link` | Link inside submenu |
| `toggle` | `<button>` | `.fc-navigation__toggle` | Mobile hamburger toggle |
| `icon` | `<span>` | `.fc-navigation__icon` | Hamburger icon (decorative, `aria-hidden`) |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Submenu open/closed | `data-state` | `open \| closed` | `item` (with submenu) |
| Expanded (a11y) | `aria-expanded` | `true \| false` | `trigger` |
| Active page | `aria-current` | `page` | `link` or `submenu-link` |
| Mobile expanded | `data-state` | `expanded \| collapsed` | `root` |
| Mobile toggle label | `aria-expanded` | `true \| false` | `toggle` |
| Toggle controls | `aria-controls` | `[list id]` | `toggle` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-navigation-link-padding` | `padding` on `link` | `var(--fc-space-2) var(--fc-space-3)` |
| `--fc-navigation-link-active-decoration` | `text-decoration` on active `link` | `underline` |
| `--fc-navigation-submenu-indent` | `padding-inline-start` on `submenu` | `var(--fc-space-4)` |
| `--fc-navigation-submenu-border` | `border-inline-start` on `submenu` | `1px solid var(--grey-300)` |
| `--fc-navigation-gap` | `gap` on horizontal `list` | `var(--fc-space-2)` |
| `--fc-navigation-toggle-size` | `width` + `height` on `toggle` | `44px` |

---

## HTML — Classless

```html
<!-- Fully styled with zero classes — semantic <nav> + <ul> -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/" aria-current="page">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

---

## HTML — Class-based

```html
<nav class="fc-navigation" aria-label="Main navigation" data-state="collapsed">
  <button
    class="fc-navigation__toggle"
    aria-expanded="false"
    aria-controls="nav-list"
    aria-label="Open navigation"
  >
    <span class="fc-navigation__icon" aria-hidden="true">☰</span>
  </button>

  <ul class="fc-navigation__list" id="nav-list">
    <li class="fc-navigation__item">
      <a class="fc-navigation__link" href="/" aria-current="page">Home</a>
    </li>

    <li class="fc-navigation__item" data-state="closed">
      <button
        class="fc-navigation__trigger"
        aria-expanded="false"
        aria-controls="products-submenu"
      >
        Products ▾
      </button>
      <ul class="fc-navigation__submenu" id="products-submenu" hidden>
        <li class="fc-navigation__submenu-item">
          <a class="fc-navigation__submenu-link" href="/products/a">Product A</a>
        </li>
        <li class="fc-navigation__submenu-item">
          <a class="fc-navigation__submenu-link" href="/products/b">Product B</a>
        </li>
      </ul>
    </li>

    <li class="fc-navigation__item">
      <a class="fc-navigation__link" href="/contact">Contact</a>
    </li>
  </ul>
</nav>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [Disclosure Navigation (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) |
| **Role(s)** | `navigation` (native `<nav>`); no additional ARIA roles needed on list items |
| **Required attributes** | `aria-label` on `<nav>`; `aria-expanded` + `aria-controls` on disclosure `trigger`; `aria-current="page"` on active link |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

**Keyboard interaction**

| Key | Action |
|-----|--------|
| `Tab` | Move focus between top-level links and triggers |
| `Enter` / `Space` on `trigger` | Toggle submenu open/closed |
| `Escape` | Close open submenu; return focus to its trigger |
| `ArrowDown` inside open submenu | Move to next submenu link |
| `ArrowUp` inside open submenu | Move to previous submenu link |
| `Tab` from last submenu link | Close submenu; move focus out |
| `Enter` / `Space` on `toggle` | Toggle mobile navigation expanded/collapsed |

---

## Behavior

**Native element / API used:** `<nav>`, `<ul>`, `<a>`, `<button>` — all native.

**Machine responsibilities:**
- Track which `item` (if any) has its submenu open; toggle on `trigger` click
- Close open submenu on `Escape` key; return focus to its `trigger`
- Close open submenu on outside `pointerdown`
- Only one submenu open at a time (close others when a new one opens)
- Mobile toggle: toggle `data-state="expanded|collapsed"` on `root`; update `aria-expanded` on `toggle`; show/hide `list` via CSS or `hidden` attribute
- Emit `fc:toggle` on any submenu or mobile nav state change

**`@foolscap/core` API sketch:**

```ts
createNavigation(options?: {
  items: Array<{
    label: string
    href?: string
    current?: boolean
    children?: Array<{ label: string; href: string; current?: boolean }>
  }>
}): {
  getRootProps(): Record<string, unknown>
  getToggleProps(): Record<string, unknown>
  getListProps(): Record<string, unknown>
  getItemProps(index: number): Record<string, unknown>
  getLinkProps(index: number): Record<string, unknown>
  getTriggerProps(index: number): Record<string, unknown>
  getSubmenuProps(index: number): Record<string, unknown>
  getSubmenuLinkProps(parentIndex: number, childIndex: number): Record<string, unknown>
  state: {
    openIndex: number | null
    isMobileExpanded: boolean
  }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:toggle` | `{ index: number | null, isOpen: boolean }` | Submenu opens or closes |
| `fc:mobile-toggle` | `{ isExpanded: boolean }` | Mobile nav expands or collapses |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-orientation` | `horizontal \| vertical` | Layout direction of top-level list |

---

## Notes

- The disclosure pattern (button + hidden list) is preferred over `role="menu"` for navigation — it doesn't imply the strict keyboard contract of a menu widget and plays better with screen reader virtual cursor navigation.
- `aria-current="page"` should be set server-side or by the routing layer — the machine exposes a `current` prop but does not infer it.
- Mobile breakpoint management (when to show the toggle) is handled by CSS container queries, not JS.
- Multi-level submenus (sub-sub-menus) are not supported in v1.
