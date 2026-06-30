# Pagination

> Splitting information over multiple pages, and the component used for navigating between them.
> **Tier:** 3 — Headless machine
> **Also known as:** —
> **Native element:** `<nav>` + `<ol>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<nav>` | `.fc-pagination` | `aria-label="Pagination"` |
| `list` | `<ol>` | `.fc-pagination__list` | Ordered list of page items |
| `item` | `<li>` | `.fc-pagination__item` | Wrapper for each page link or control |
| `link` | `<a>` or `<button>` | `.fc-pagination__link` | Individual page number element |
| `prev` | `<button>` | `.fc-pagination__prev` | Navigate to previous page |
| `next` | `<button>` | `.fc-pagination__next` | Navigate to next page |
| `ellipsis` | `<span>` | `.fc-pagination__ellipsis` | Truncation indicator (…); `aria-hidden="true"` |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Current page | `aria-current` | `page` | `link` for current page |
| Prev disabled | `data-state` | `disabled` | `prev` item when on page 1 |
| Next disabled | `data-state` | `disabled` | `next` item when on last page |
| Disabled (a11y) | `aria-disabled` | `true` | `prev` / `next` when at boundary |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-pagination-item-size` | `min-width` + `height` on `link` | `44px` |
| `--fc-pagination-gap` | `gap` on `list` | `var(--fc-space-1)` |
| `--fc-pagination-link-border` | `border` on `link` | `1px solid transparent` |
| `--fc-pagination-link-active-border` | `border` on current `link` | `1px solid var(--ink)` |
| `--fc-pagination-link-hover-bg` | `background` on hovered `link` | `var(--grey-100)` |
| `--fc-pagination-link-radius` | `border-radius` on `link` | `2px` |

---

## HTML — Classless

```html
<nav aria-label="Pagination">
  <ol>
    <li><a href="?page=1">1</a></li>
    <li><a href="?page=2" aria-current="page">2</a></li>
    <li><a href="?page=3">3</a></li>
  </ol>
</nav>
```

---

## HTML — Class-based

```html
<nav class="fc-pagination" aria-label="Pagination">
  <ol class="fc-pagination__list">
    <li class="fc-pagination__item">
      <button class="fc-pagination__prev" aria-label="Previous page" aria-disabled="true" data-state="disabled">
        ‹ Prev
      </button>
    </li>

    <li class="fc-pagination__item">
      <a class="fc-pagination__link" href="?page=1" aria-current="page">1</a>
    </li>
    <li class="fc-pagination__item">
      <a class="fc-pagination__link" href="?page=2">2</a>
    </li>
    <li class="fc-pagination__item">
      <span class="fc-pagination__ellipsis" aria-hidden="true">…</span>
    </li>
    <li class="fc-pagination__item">
      <a class="fc-pagination__link" href="?page=10">10</a>
    </li>

    <li class="fc-pagination__item">
      <button class="fc-pagination__next" aria-label="Next page">
        Next ›
      </button>
    </li>
  </ol>
</nav>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern; uses landmark + list semantics |
| **Role(s)** | `navigation` (native `<nav>`); `list` (native `<ol>`) |
| **Required attributes** | `aria-label="Pagination"` on `root`; `aria-current="page"` on current page link; `aria-label="Previous page"` / `aria-label="Next page"` on prev/next; `aria-disabled="true"` when at boundary |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

**Keyboard interaction**

| Key | Action |
|-----|--------|
| `Tab` | Move focus between prev, page links, and next |
| `Enter` | Activate focused link or button |
| `Shift+Tab` | Move focus backward |

---

## Behavior

**Native element / API used:** `<nav>`, `<ol>`, `<a>` / `<button>` — all native; no positioning library needed.

**Machine responsibilities:**
- Track `currentPage` and `totalPages`
- Compute visible page range: always show first, last, current, and siblings (±1); insert ellipsis where pages are skipped
- Handle prev/next button clicks: decrement/increment `currentPage`; disable at boundaries
- Handle page link clicks: set `currentPage`; emit `fc:page-change`
- Update `aria-current="page"` on the active link
- Update `aria-disabled` on prev/next at boundaries

**`@foolscap/core` API sketch:**

```ts
createPagination(options?: {
  totalPages: number
  defaultPage?: number          // default: 1
  siblingCount?: number         // pages shown on each side of current, default: 1
}): {
  getRootProps(): Record<string, unknown>
  getListProps(): Record<string, unknown>
  getPrevProps(): Record<string, unknown>
  getNextProps(): Record<string, unknown>
  getLinkProps(page: number): Record<string, unknown>
  state: {
    currentPage: number
    totalPages: number
    pages: Array<number | 'ellipsis'>  // computed visible page range
    hasPrev: boolean
    hasNext: boolean
  }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:page-change` | `{ page: number, prevPage: number }` | User navigates to a new page |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-size` | `sm \| md \| lg` | Adjusts item size and font size |

---

## Notes

- When used with server-side routing, use `<a href="?page=N">` — the browser handles navigation natively. The machine only computes state.
- When used in a SPA, use `<button>` elements and handle `fc:page-change` to update the data source.
- The ellipsis `<span>` is `aria-hidden="true"` — screen readers don't need to announce it.
- Infinite scroll and load-more patterns are not modelled here; those are handled by the Infinite List pattern (CSS only + JS fetch).
