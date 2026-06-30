# Datepicker

> A visual way to choose a date using a calendar view.
> **Tier:** 3 — Headless machine
> **Also known as:** Calendar, Datetime picker
> **Native element:** `<input type="date">` (classless fallback)

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-datepicker` | Wrapper; `data-state` carries open/closed |
| `trigger` | `<button>` | `.fc-datepicker__trigger` | Displays current value; opens calendar on click |
| `dialog` | `<div>` | `.fc-datepicker__dialog` | Calendar popover; `role="dialog"` |
| `header` | `<div>` | `.fc-datepicker__header` | Month/year label + nav buttons |
| `prev-month` | `<button>` | `.fc-datepicker__prev-month` | Navigate to previous month |
| `month-label` | `<span>` | `.fc-datepicker__month-label` | Displays "June 2026"; `aria-live="polite"` |
| `next-month` | `<button>` | `.fc-datepicker__next-month` | Navigate to next month |
| `grid` | `<table>` | `.fc-datepicker__grid` | Calendar grid; `role="grid"` |
| `grid-head` | `<thead>` | `.fc-datepicker__grid-head` | Weekday abbreviation headers |
| `grid-body` | `<tbody>` | `.fc-datepicker__grid-body` | Rows of days |
| `gridcell` | `<td>` | `.fc-datepicker__gridcell` | `role="gridcell"` — contains a button for selectable days |
| `day` | `<button>` | `.fc-datepicker__day` | Individual day; `aria-label="full date"` |
| `input` | `<input type="text">` | `.fc-datepicker__input` | Optional visible text field showing formatted date |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Calendar open/closed | `data-state` | `open \| closed` | `root` |
| Selected day | `aria-selected` | `true` | `day` |
| Today | `aria-current` | `date` | `day` |
| Out-of-range / disabled | `disabled` | — | `day` |
| Outside current month | `data-state` | `outside-month` | `gridcell` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-datepicker-dialog-width` | `width` on `dialog` | `280px` |
| `--fc-datepicker-cell-size` | `width` + `height` on `day` | `36px` |
| `--fc-datepicker-dialog-border` | `border` on `dialog` | `1px solid var(--ink)` |
| `--fc-datepicker-dialog-shadow` | `box-shadow` on `dialog` | `0 4px 16px rgb(0 0 0 / 0.1)` |
| `--fc-datepicker-day-selected-bg` | `background` on selected `day` | `var(--ink)` |
| `--fc-datepicker-day-selected-color` | `color` on selected `day` | `var(--paper)` |
| `--fc-datepicker-day-today-underline` | `text-decoration` on today `day` | `underline` |
| `--fc-datepicker-day-hover-bg` | `background` on hovered `day` | `var(--grey-100)` |
| `--fc-datepicker-header-font-size` | `font-size` on `month-label` | `var(--fc-font-size-sm)` |

---

## HTML — Classless

```html
<!-- Native date input — full classless fallback -->
<label for="dob">Date of birth</label>
<input id="dob" type="date" />
```

---

## HTML — Class-based

```html
<div class="fc-datepicker" data-state="closed">
  <button class="fc-datepicker__trigger" aria-haspopup="dialog" aria-expanded="false">
    Pick a date
  </button>

  <div
    class="fc-datepicker__dialog"
    role="dialog"
    aria-label="Choose date"
    aria-modal="true"
    hidden
  >
    <div class="fc-datepicker__header">
      <button class="fc-datepicker__prev-month" aria-label="Previous month">‹</button>
      <span class="fc-datepicker__month-label" aria-live="polite">June 2026</span>
      <button class="fc-datepicker__next-month" aria-label="Next month">›</button>
    </div>

    <table class="fc-datepicker__grid" role="grid" aria-label="June 2026">
      <thead class="fc-datepicker__grid-head">
        <tr>
          <th scope="col" abbr="Sunday">Su</th>
          <th scope="col" abbr="Monday">Mo</th>
          <!-- … -->
        </tr>
      </thead>
      <tbody class="fc-datepicker__grid-body">
        <tr>
          <td class="fc-datepicker__gridcell" role="gridcell">
            <button class="fc-datepicker__day" aria-label="June 1, 2026">1</button>
          </td>
          <td class="fc-datepicker__gridcell" role="gridcell">
            <button
              class="fc-datepicker__day"
              aria-label="June 2, 2026"
              aria-selected="true"
            >2</button>
          </td>
          <!-- … -->
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [Date Picker Dialog (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/) |
| **Role(s)** | `dialog` on calendar panel; `grid` on table; `gridcell` on each cell |
| **Required attributes** | `aria-haspopup="dialog"` + `aria-expanded` on trigger; `aria-label` on dialog; `aria-label` (full date string) on each `day` button; `aria-selected` on selected day; `aria-current="date"` on today |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

**Keyboard interaction**

| Key | Action |
|-----|--------|
| `Enter` / `Space` on trigger | Open calendar dialog |
| `ArrowLeft` | Move to previous day |
| `ArrowRight` | Move to next day |
| `ArrowUp` | Move to same day in previous week |
| `ArrowDown` | Move to same day in next week |
| `Home` | Move to first day of current week |
| `End` | Move to last day of current week |
| `PageUp` | Move to same day in previous month |
| `PageDown` | Move to same day in next month |
| `Shift+PageUp` | Move to same day in previous year |
| `Shift+PageDown` | Move to same day in next year |
| `Enter` / `Space` on day | Select date; close dialog |
| `Escape` | Close dialog without selecting; return focus to trigger |

---

## Behavior

**Native element / API used:** `<table role="grid">` for calendar; `<dialog>` or Popover API for positioning; Floating UI for placement.

**Machine responsibilities:**
- Maintain `viewMonth` and `viewYear` state for the displayed calendar month
- Generate calendar grid: 6-row × 7-col grid with correct day offsets
- Track `selectedDate` and `focusedDate` independently
- Apply `min` / `max` date constraints — disable out-of-range days
- On `prev-month` / `next-month`: update `viewMonth`/`viewYear`, keep `focusedDate` in view
- Open calendar on trigger click; set initial `focusedDate` to `selectedDate` or today
- Focus the `focusedDate` day button when dialog opens
- Close on day selection, `Escape`, or outside click; restore focus to trigger
- Emit `fc:change` on date selection

**`@foolscap/core` API sketch:**

```ts
createDatepicker(options?: {
  defaultValue?: Date
  min?: Date
  max?: Date
  locale?: string          // for month/day name formatting, default: 'en'
  firstDayOfWeek?: 0 | 1  // 0=Sunday, 1=Monday
}): {
  getTriggerProps(): Record<string, unknown>
  getDialogProps(): Record<string, unknown>
  getHeaderProps(): Record<string, unknown>
  getPrevMonthProps(): Record<string, unknown>
  getNextMonthProps(): Record<string, unknown>
  getMonthLabelProps(): Record<string, unknown>
  getGridProps(): Record<string, unknown>
  getDayProps(date: Date): Record<string, unknown>
  state: {
    isOpen: boolean
    selectedDate: Date | null
    focusedDate: Date
    viewMonth: number      // 0–11
    viewYear: number
    weeks: Array<Array<Date | null>>
  }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:change` | `{ date: Date, iso: string }` | User selects a date |
| `fc:open` | `{}` | Calendar dialog opens |
| `fc:close` | `{}` | Calendar dialog closes |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-variant` | `inline` | Render calendar permanently visible (no trigger/dialog) |

---

## Notes

- The `aria-label` on each `day` button must be the full human-readable date (e.g. "June 2, 2026") — never just the number.
- `aria-live="polite"` on `month-label` announces month/year changes to screen readers without moving focus.
- Date range selection (start + end date) is a future extension; v1 is single-date only.
- For time selection, a separate `time` input can be composed alongside; a combined datetime picker is out of v1 scope.
