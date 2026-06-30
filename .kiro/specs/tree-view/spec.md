# Tree View

> Displays nested hierarchical information, such as a table of contents or directory structure.
> **Tier:** 3 — Headless machine
> **Also known as:** —
> **Native element:** —

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<ul>` | `.fc-tree` | `role="tree"`; outermost |
| `item` | `<li>` | `.fc-tree__item` | `role="treeitem"`; leaf or branch |
| `item-content` | `<div>` | `.fc-tree__item-content` | Row wrapper: toggle + label |
| `toggle` | `<button>` | `.fc-tree__toggle` | Expand/collapse icon button (branch items only) |
| `label` | `<span>` | `.fc-tree__label` | Visible item text |
| `group` | `<ul>` | `.fc-tree__group` | `role="group"`; children container |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Expanded | `aria-expanded` | `"true"` · `"false"` | `item` (branch only) |
| Expanded (CSS) | `data-state` | `"expanded"` · `"collapsed"` | `item` (branch only) |
| Selected | `aria-selected` | `"true"` · `"false"` | `item` |
| Selected (CSS) | `data-state` | `"selected"` | `item` |
| Focused (roving) | `tabindex` | `"0"` · `"-1"` | `item` |
| Disabled | `aria-disabled` | `"true"` | `item` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-tree-indent` | `padding-left` per nesting level | `1.25rem` |
| `--fc-tree-item-height` | min-height on item row | `2rem` |
| `--fc-tree-item-gap` | gap inside item-content | `0.375rem` |
| `--fc-tree-toggle-size` | width/height of toggle button | `1.25rem` |
| `--fc-tree-selected-bg` | `background` on selected item | `var(--grey-100)` |
| `--fc-tree-hover-bg` | `background` on hovered item | `var(--grey-50)` |
| `--fc-tree-connector-color` | optional indent guide line color | `var(--grey-200)` |

---

## HTML — Classless

```html
<!-- Classless: styled as a nested indented list; no keyboard tree behavior -->
<ul>
  <li>
    Documents
    <ul>
      <li>Report.pdf</li>
      <li>Notes.txt</li>
    </ul>
  </li>
  <li>Images</li>
</ul>
```

---

## HTML — Class-based

```html
<ul class="fc-tree" role="tree" aria-label="File system">
  <li
    class="fc-tree__item"
    role="treeitem"
    aria-expanded="true"
    aria-selected="false"
    data-state="expanded"
    tabindex="0"
  >
    <div class="fc-tree__item-content">
      <button class="fc-tree__toggle" aria-label="Collapse Documents" tabindex="-1">▾</button>
      <span class="fc-tree__label">Documents</span>
    </div>
    <ul class="fc-tree__group" role="group">
      <li
        class="fc-tree__item"
        role="treeitem"
        aria-selected="true"
        data-state="selected"
        tabindex="-1"
      >
        <div class="fc-tree__item-content">
          <span class="fc-tree__label">Report.pdf</span>
        </div>
      </li>
    </ul>
  </li>
  <li
    class="fc-tree__item"
    role="treeitem"
    aria-expanded="false"
    aria-selected="false"
    data-state="collapsed"
    tabindex="-1"
  >
    <div class="fc-tree__item-content">
      <button class="fc-tree__toggle" aria-label="Expand Images" tabindex="-1">▸</button>
      <span class="fc-tree__label">Images</span>
    </div>
  </li>
</ul>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [Tree View — APG](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/) |
| **Role(s)** | `role="tree"` on root; `role="treeitem"` on items; `role="group"` on nested lists |
| **Required attributes** | `aria-expanded` on branch items; `aria-selected` on all items; `aria-label` on root; unique `id` if referencing items by ID |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

**Keyboard interaction**

| Key | Action |
|-----|--------|
| `ArrowDown` | Move focus to next visible item (skips collapsed children) |
| `ArrowUp` | Move focus to previous visible item |
| `ArrowRight` | If collapsed branch: expand. If expanded branch: move to first child. If leaf: no-op |
| `ArrowLeft` | If expanded branch: collapse. If leaf or collapsed branch: move to parent |
| `Enter` / `Space` | Select focused item; emit `fc:select` |
| `Home` | Move focus to first item in tree |
| `End` | Move focus to last visible item in tree |
| Typing a character | Move focus to next item whose label starts with that character (type-ahead) |

---

## Behavior

**Native element / API used:** —

**Machine responsibilities:**
- Track expanded state per branch item (set of expanded item IDs)
- Track selected item(s) (single-select default; multi-select optional)
- Compute the flat list of visible items (respects collapsed branches) for arrow-key navigation
- Implement roving tabindex: only one item has `tabindex="0"` at a time
- Type-ahead: buffer typed characters, find next matching item within 500 ms
- Emit `fc:expand`, `fc:collapse`, `fc:select`

**`@foolscap/core` API sketch:**

```ts
createTreeView(options?: {
  expandedIds?: string[]
  selectedId?: string
  selectionMode?: 'single' | 'multiple'
  onExpandedChange?: (ids: string[]) => void
  onSelectionChange?: (id: string) => void
}): {
  getRootProps(): Record<string, unknown>
  getItemProps(id: string, hasChildren: boolean): Record<string, unknown>
  getGroupProps(parentId: string): Record<string, unknown>
  expand(id: string): void
  collapse(id: string): void
  select(id: string): void
  state: {
    expandedIds: string[]
    selectedId: string | null
    focusedId: string | null
  }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:expand` | `{ id: string }` | Branch item is expanded |
| `fc:collapse` | `{ id: string }` | Branch item is collapsed |
| `fc:select` | `{ id: string }` | Item is selected |

---

## Notes

- The toggle button (`fc-tree__toggle`) inside each branch item has `tabindex="-1"` because the item itself is the focusable element; the toggle is purely a visual affordance activated via the tree's keyboard contract (ArrowRight/Left)
- Indent level is controlled by CSS custom property `--fc-tree-indent` applied per nesting level via `:where(.fc-tree__group) .fc-tree__item-content` selectors
- Optional indent guide lines (vertical connectors) can be added via `::before` pseudo-elements using `--fc-tree-connector-color`
