# Tabs

> A way of navigating between multiple panels, reducing clutter and fitting more into a smaller space.
> **Tier:** 3 — Headless machine
> **Also known as:** Tabbed interface
> **Native element:** —

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-tabs` | Outermost wrapper |
| `tablist` | `<div>` | `.fc-tabs__tablist` | `role="tablist"` container |
| `tab` | `<button>` | `.fc-tabs__tab` | `role="tab"`; one per panel |
| `panel` | `<div>` | `.fc-tabs__panel` | `role="tabpanel"`; one per tab |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Selected | `aria-selected` | `"true"` · `"false"` | `tab` |
| Selected (CSS hook) | `data-state` | `"active"` · `"inactive"` | `tab` |
| Hidden panel | `hidden` | — | `panel` (inactive) |
| Panel focus | `tabindex` | `"0"` | `panel` (active) |
| Inactive tab focus | `tabindex` | `"-1"` | `tab` (inactive) |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-tabs-tab-padding` | `padding` on tab | `0.5rem 1rem` |
| `--fc-tabs-indicator-color` | `border-bottom-color` on active tab | `var(--ink)` |
| `--fc-tabs-indicator-width` | `border-bottom-width` on active tab | `2px` |
| `--fc-tabs-list-border` | `border-bottom` on tablist | `1px solid var(--grey-200)` |
| `--fc-tabs-panel-padding` | `padding` on panel | `1rem 0` |

---

## HTML — Classless

```html
<!-- No native tablist element; show all panels stacked without JS -->
<div>
  <div role="tablist" aria-label="Content sections">
    <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1">Overview</button>
    <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2" tabindex="-1">Details</button>
  </div>
  <div role="tabpanel" id="panel-1" aria-labelledby="tab-1">
    <p>Overview content.</p>
  </div>
  <div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>
    <p>Details content.</p>
  </div>
</div>
```

---

## HTML — Class-based

```html
<div class="fc-tabs" data-variant="underline">
  <div class="fc-tabs__tablist" role="tablist" aria-label="Content sections">
    <button
      class="fc-tabs__tab"
      role="tab"
      id="tab-overview"
      aria-selected="true"
      aria-controls="panel-overview"
      data-state="active"
    >Overview</button>
    <button
      class="fc-tabs__tab"
      role="tab"
      id="tab-details"
      aria-selected="false"
      aria-controls="panel-details"
      data-state="inactive"
      tabindex="-1"
    >Details</button>
  </div>
  <div
    class="fc-tabs__panel"
    role="tabpanel"
    id="panel-overview"
    aria-labelledby="tab-overview"
    tabindex="0"
  >
    <p>Overview content.</p>
  </div>
  <div
    class="fc-tabs__panel"
    role="tabpanel"
    id="panel-details"
    aria-labelledby="tab-details"
    tabindex="0"
    hidden
  >
    <p>Details content.</p>
  </div>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [Tabs — APG](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) |
| **Role(s)** | `tablist` on tab container; `tab` on each button; `tabpanel` on each panel |
| **Required attributes** | `aria-selected` on tabs; `aria-controls` (tab→panel); `aria-labelledby` (panel←tab); unique `id` on every tab and panel |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

**Keyboard interaction**

| Key | Action |
|-----|--------|
| `Tab` | Enter tablist (focuses active tab); subsequent Tab moves to active panel content |
| `ArrowRight` | Next tab (roving tabindex, wraps to first) |
| `ArrowLeft` | Previous tab (roving tabindex, wraps to last) |
| `Home` | First tab |
| `End` | Last tab |
| `Enter` / `Space` | Activate focused tab (auto-activation mode) |

---

## Behavior

**Native element / API used:** —

**Machine responsibilities:**
- Track active tab index
- Implement roving tabindex: only active tab has `tabindex="0"`; all others have `tabindex="-1"`
- Show active panel (`hidden` removed); hide inactive panels (`hidden` set)
- Auto-activation: tab activates on arrow-key focus (default); manual mode available (activate only on Enter/Space)
- Emit `fc:change` on tab switch

**`@foolscap/core` API sketch:**

```ts
createTabs(options?: {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  activationMode?: 'automatic' | 'manual'
}): {
  getTablistProps(): Record<string, unknown>
  getTabProps(value: string): Record<string, unknown>
  getPanelProps(value: string): Record<string, unknown>
  state: {
    value: string
  }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:change` | `{ value: string }` | Tab selection changes |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-variant` | `underline` (default) · `contained` | Underline: only active tab has bottom border rule. Contained: tab bar has bottom border; active tab is visually inset. |
| `data-orientation` | `horizontal` (default) · `vertical` | Vertical: tablist stacks left of panels; Arrow keys change to Up/Down |

---

## Notes

- Panels use `hidden` attribute for hiding — no CSS `display:none` workaround needed; it's accessible and terse
- `tabindex="0"` on the panel allows keyboard users to Tab into panel content from the active tab
- Roving tabindex means keyboard users do not Tab through every tab — they Tab to the list, arrow through, then Tab out
