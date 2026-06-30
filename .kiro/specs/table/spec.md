# Table

> Displays structured, relational data in rows and columns.
> **Tier:** 1 — CSS only
> **Also known as:** Data table, Grid
> **Native element:** `<table>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-table-wrapper` | Scroll container for overflow |
| `table` | `<table>` | `.fc-table` | Native table element |
| `caption` | `<caption>` | `.fc-table__caption` | Describes table purpose; required for a11y |
| `thead` | `<thead>` | — | Header row group |
| `tbody` | `<tbody>` | — | Body row group |
| `tfoot` | `<tfoot>` | — | Footer row group (optional) |
| `header-row` | `<tr>` | — | Row inside `thead` |
| `row` | `<tr>` | `.fc-table__row` | Data rows; can carry `data-state` |
| `th` | `<th>` | `.fc-table__th` | Column / row header cell |
| `td` | `<td>` | `.fc-table__td` | Data cell |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Selected row | `data-state` | `selected` | `tr.fc-table__row` |
| Sort direction | `aria-sort` | `ascending` · `descending` · `none` | `th` |
| Variant | `data-variant` | `default` · `striped` · `bordered` · `compact` | `.fc-table` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-table-border` | `border` on table/cells | `1px solid var(--grey-200)` |
| `--fc-table-header-bg` | `background-color` on `thead` | `var(--grey-100)` |
| `--fc-table-row-hover-bg` | `background-color` on hover | `var(--grey-50)` |
| `--fc-table-stripe-bg` | `background-color` on odd rows (striped) | `var(--grey-50)` |
| `--fc-table-selected-bg` | `background-color` when selected | `var(--grey-100)` |
| `--fc-table-cell-padding` | `padding` on `th`/`td` | `0.625rem 1rem` |
| `--fc-table-cell-padding-compact` | `padding` in compact variant | `0.375rem 0.75rem` |
| `--fc-table-font-size` | `font-size` | `0.9375rem` |

---

## HTML — Classless

```html
<table>
  <caption>Q1 2026 Sales Summary</caption>
  <thead>
    <tr>
      <th scope="col">Region</th>
      <th scope="col">Units Sold</th>
      <th scope="col">Revenue</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>North</td>
      <td>1,204</td>
      <td>£48,160</td>
    </tr>
    <tr>
      <td>South</td>
      <td>987</td>
      <td>£39,480</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Total</th>
      <td>2,191</td>
      <td>£87,640</td>
    </tr>
  </tfoot>
</table>
```

---

## HTML — Class-based

```html
<div class="fc-table-wrapper">
  <table class="fc-table" data-variant="striped">
    <caption class="fc-table__caption">Q1 2026 Sales Summary</caption>
    <thead>
      <tr>
        <th class="fc-table__th" scope="col">Region</th>
        <th class="fc-table__th" scope="col" aria-sort="ascending">
          Units Sold
          <span aria-hidden="true">↑</span>
        </th>
        <th class="fc-table__th" scope="col">Revenue</th>
      </tr>
    </thead>
    <tbody>
      <tr class="fc-table__row" data-state="selected">
        <td class="fc-table__td">North</td>
        <td class="fc-table__td">1,204</td>
        <td class="fc-table__td">£48,160</td>
      </tr>
      <tr class="fc-table__row">
        <td class="fc-table__td">South</td>
        <td class="fc-table__td">987</td>
        <td class="fc-table__td">£39,480</td>
      </tr>
    </tbody>
    <tfoot>
      <tr class="fc-table__row">
        <th class="fc-table__th" scope="row">Total</th>
        <td class="fc-table__td">2,191</td>
        <td class="fc-table__td">£87,640</td>
      </tr>
    </tfoot>
  </table>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [Table](https://www.w3.org/WAI/ARIA/apg/patterns/table/) |
| **Role(s)** | `<table>` has implicit `table` role; `<th>` cells have `columnheader`/`rowheader` |
| **Required attributes** | `scope="col"` on column headers; `scope="row"` on row headers; `<caption>` or `aria-label` on `<table>`; `aria-sort` on sortable columns |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults); selected/hover states require 3:1 non-text contrast |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-variant` | `default` · `striped` · `bordered` · `compact` | `default`: row borders only; `striped`: alternating row bg; `bordered`: all cell borders; `compact`: reduced cell padding |

---

## Notes

- Wrap `<table>` in a `div.fc-table-wrapper` with `overflow-x: auto` to handle narrow viewports without breaking table semantics.
- Interactive tables (sortable, selectable rows, row expansion) should be built on `@foolscap/core` to manage keyboard navigation, ARIA state, and `aria-sort` toggling.
- Avoid `display: grid` or `display: block` overrides on table elements — they break screen reader table navigation.
