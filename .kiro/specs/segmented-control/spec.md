# Segmented Control

> A horizontal set of connected segments used to select one option from a set, or to switch between views.
> **Tier:** 3 — Headless machine
> **Also known as:** Segment, Button group, Toggle group, Tab bar
> **Native element:** `<fieldset>/<input type="radio">` (form mode); `<div>` with `role="tablist"` (view mode)

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` or `<fieldset>` | `.fc-segmented-control` | `role="radiogroup"` (radio mode) or `role="tablist"` (tab mode) |
| `item` | `<label>` (radio) or `<button>` (tab) | `.fc-segmented-control__item` | Carries `data-state="selected"` when active |
| `input` | `<input type="radio">` | `.fc-segmented-control__input` | Radio mode only; visually hidden |
| `label-text` | `<span>` | `.fc-segmented-control__label-text` | Visible text; `aria-hidden` if icon-only |
| `icon` | `<span>` | `.fc-segmented-control__icon` | Optional icon; `aria-hidden="true"` |
| `indicator` | `<span>` | `.fc-segmented-control__indicator` | Animated background pill/underline (CSS transform) |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Selected | `data-state` | `selected` | `item` |
| Mode | `data-mode` | `radio \| tabs` | `root` |
| Disabled | `data-state` | `disabled` | `root` or individual `item` |
| Size | `data-size` | `sm \| md \| lg` | `root` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-segmented-bg` | `background` on `root` | `var(--grey-100)` |
| `--fc-segmented-border` | `border` on `root` | `1px solid var(--grey-300)` |
| `--fc-segmented-radius` | `border-radius` on `root` | `6px` |
| `--fc-segmented-item-padding` | `padding` on `item` | `var(--fc-space-1) var(--fc-space-3)` |
| `--fc-segmented-indicator-bg` | `background` on `indicator` | `var(--paper-raised)` |
| `--fc-segmented-indicator-shadow` | `box-shadow` on `indicator` | `0 1px 3px rgba(0,0,0,0.15)` |
| `--fc-segmented-selected-color` | `color` on selected `item` | `var(--ink)` |
| `--fc-segmented-gap` | `gap` on items layout | `2px` |

---

## HTML — Classless (radio mode)

```html
<fieldset>
  <legend>View</legend>
  <label><input type="radio" name="view" value="grid" checked /> Grid</label>
  <label><input type="radio" name="view" value="list" /> List</label>
  <label><input type="radio" name="view" value="map" /> Map</label>
</fieldset>
```

---

## HTML — Class-based (radio / form mode)

```html
<div
  class="fc-segmented-control"
  role="radiogroup"
  aria-label="View"
  data-mode="radio"
  data-size="md"
>
  <span class="fc-segmented-control__indicator" aria-hidden="true"></span>

  <label class="fc-segmented-control__item" data-state="selected">
    <input class="fc-segmented-control__input" type="radio" name="view" value="grid" checked />
    <span class="fc-segmented-control__label-text">Grid</span>
  </label>

  <label class="fc-segmented-control__item">
    <input class="fc-segmented-control__input" type="radio" name="view" value="list" />
    <span class="fc-segmented-control__label-text">List</span>
  </label>

  <label class="fc-segmented-control__item">
    <input class="fc-segmented-control__input" type="radio" name="view" value="map" />
    <span class="fc-segmented-control__label-text">Map</span>
  </label>
</div>
```

---

## HTML — Class-based (tab / view-switch mode)

```html
<div
  class="fc-segmented-control"
  role="tablist"
  aria-label="View"
  data-mode="tabs"
>
  <span class="fc-segmented-control__indicator" aria-hidden="true"></span>

  <button
    class="fc-segmented-control__item"
    role="tab"
    aria-selected="true"
    aria-controls="panel-grid"
    id="tab-grid"
    tabindex="0"
    data-state="selected"
  >
    Grid
  </button>

  <button
    class="fc-segmented-control__item"
    role="tab"
    aria-selected="false"
    aria-controls="panel-list"
    id="tab-list"
    tabindex="-1"
  >
    List
  </button>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [Radio Group (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) in `radio` mode; [Tabs (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) in `tabs` mode |
| **Role(s)** | `radiogroup` + native `radio` inputs (form mode); `tablist` + `tab` (view mode) |
| **Required attributes** | `aria-label` on root; in tab mode: `aria-selected`, `aria-controls`, `tabindex` on each tab |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

**Keyboard interaction (radio mode — native radio behavior)**

| Key | Action |
|-----|--------|
| `Tab` | Enter the group; focus lands on checked radio (or first if none) |
| `ArrowRight` / `ArrowDown` | Move to next option and select it |
| `ArrowLeft` / `ArrowUp` | Move to previous option and select it |
| `Tab` (from last item) | Exit the group |

**Keyboard interaction (tab mode — roving tabindex)**

| Key | Action |
|-----|--------|
| `Tab` | Focus the selected tab |
| `ArrowRight` | Move focus to next tab; select it |
| `ArrowLeft` | Move focus to previous tab; select it |
| `Home` | Focus and select first tab |
| `End` | Focus and select last tab |

---

## Behavior

**Native element / API used:** `<input type="radio">` (radio mode) or `<button role="tab">` with roving tabindex (tab mode).

**Machine responsibilities:**
- **Radio mode**: machine tracks selected value on radio `change`; moves `indicator` to selected item position via CSS custom properties (`--fc-segmented-indicator-left`, `--fc-segmented-indicator-width`)
- **Tab mode**: manage roving tabindex (only selected tab has `tabindex="0"`); update `aria-selected`; emit `fc:change` on selection
- Animate `indicator` position using `transform: translateX(...)` — compute target item's `offsetLeft`/`offsetWidth` on change and on resize (`ResizeObserver`)
- Disabled items: skip in arrow key navigation; set `aria-disabled="true"` and `tabindex="-1"` in tab mode; `disabled` attribute in radio mode

**`@foolscap/core` API sketch:**

```ts
createSegmentedControl(options?: {
  items: Array<{ value: string; label: string; disabled?: boolean }>
  defaultValue?: string
  mode?: 'radio' | 'tabs'         // default: 'radio'
  name?: string                   // radio input name (radio mode only)
}): {
  getRootProps(): Record<string, unknown>
  getItemProps(value: string): Record<string, unknown>
  getInputProps(value: string): Record<string, unknown>   // radio mode only
  getIndicatorProps(): Record<string, unknown>
  state: {
    selectedValue: string | null
    mode: 'radio' | 'tabs'
  }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:change` | `{ value: string, prevValue: string \| null }` | User selects a different segment |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-mode` | `radio \| tabs` | Semantic role + keyboard contract |
| `data-size` | `sm \| md \| lg` | Padding and font size |
| `data-full-width` | _(present/absent)_ | Items expand equally to fill container |

---

## Notes

- **Choose mode based on intent**: use `radio` mode when the selection persists in a form; use `tabs` mode when switching views with associated panels (`aria-controls`).
- The animated `indicator` is a purely cosmetic positioned child — CSS `position: absolute` inside `position: relative` root. It does NOT carry semantic meaning.
- Resize: the machine must reposition the indicator on `ResizeObserver` callbacks (window resize, parent layout change).
- In `tabs` mode, `aria-controls` must point to valid panel ids. Panels must have matching `aria-labelledby` pointing back to the tab id.
