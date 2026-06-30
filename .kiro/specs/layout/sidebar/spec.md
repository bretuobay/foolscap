# Layout / Sidebar

> A two-column layout with one fixed-width sidebar and one fluid main content area. Collapses to a single column below a threshold.
> **Tier:** 1 — CSS only
> **Also known as:** Sidebar layout, Holy grail, Content + aside
> **Native element:** `<div>` with `display: flex`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-sidebar` | Flex row container |
| `sidebar` | `<aside>` (or `<div>`) | `.fc-sidebar__aside` | Fixed-width panel; can be on left or right |
| `main` | `<div>` | `.fc-sidebar__main` | Fluid main area (`flex-grow: 1`) |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-sidebar-width` | `width` of sidebar | `16rem` |
| `--fc-sidebar-gap` | `gap` between sidebar and main | `var(--fc-space-6)` |
| `--fc-sidebar-threshold` | minimum width before collapse | `30rem` |

---

## HTML — Classless

```html
<!-- No dedicated classless form -->
```

---

## HTML — Class-based

```html
<!-- Left sidebar (default) -->
<div class="fc-sidebar">
  <aside class="fc-sidebar__aside">
    Navigation or filters
  </aside>
  <main class="fc-sidebar__main">
    Page content
  </main>
</div>

<!-- Right sidebar (swap order in HTML; CSS handles visual position) -->
<div class="fc-sidebar" data-side="right">
  <main class="fc-sidebar__main">
    Page content
  </main>
  <aside class="fc-sidebar__aside">
    Supporting panel
  </aside>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | N/A — layout primitive |
| **Role(s)** | Use semantic `<aside>` with `aria-label` for the sidebar landmark; `<main>` for the primary content landmark |
| **Contrast** | N/A |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-side` | `left` (default) · `right` | Controls which side the aside appears |

---

## Notes

- Collapse logic: when the container is narrower than `--fc-sidebar-threshold` (via container query or media query), set `flex-direction: column` and `width: 100%` on the sidebar.
- For a collapsible/dismissible sidebar drawer, use the Drawer component (Tier 3) — this primitive is for persistent, always-visible sidebars only.
