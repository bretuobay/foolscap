# Progress Indicator

> A representation of a user's progress through a series of discrete steps.
> **Tier:** 3 — Headless machine
> **Also known as:** Progress tracker, Stepper, Steps, Timeline, Meter
> **Native element:** `<ol>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<ol>` | `.fc-progress-indicator` | Ordered list of steps; `aria-label` required |
| `step` | `<li>` | `.fc-progress-indicator__step` | One per step; carries `data-state` |
| `step-indicator` | `<div>` | `.fc-progress-indicator__step-indicator` | Visual circle/number/check |
| `step-label` | `<span>` | `.fc-progress-indicator__step-label` | Step name |
| `step-description` | `<span>` | `.fc-progress-indicator__step-description` | Optional sub-label |
| `step-sr-status` | `<span>` | `.fc-progress-indicator__step-sr-status` | Visually hidden state text ("Completed", "Current", "Upcoming") |
| `connector` | (pseudo-element `::after`) | — | Line connecting steps; CSS only |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Step state | `data-state` | `complete \| current \| upcoming` | `step` |
| Current (a11y) | `aria-current` | `step` | `step` |
| Interactive step | `role` | `button` | `step-indicator` (when `interactive=true`) |
| Interactive expanded | — | — | Managed via click on step |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-progress-indicator-indicator-size` | `width` + `height` on `step-indicator` | `28px` |
| `--fc-progress-indicator-connector-thickness` | `height` / `width` on connector pseudo-element | `1px` |
| `--fc-progress-indicator-connector-color` | `background` on connector | `var(--grey-300)` |
| `--fc-progress-indicator-complete-color` | `color` + `border-color` on complete `step-indicator` | `var(--ink)` |
| `--fc-progress-indicator-current-color` | `border-color` on current `step-indicator` | `var(--ink)` |
| `--fc-progress-indicator-upcoming-color` | `color` + `border-color` on upcoming `step-indicator` | `var(--grey-400)` |
| `--fc-progress-indicator-label-font-size` | `font-size` on `step-label` | `var(--fc-font-size-sm)` |

---

## HTML — Classless

```html
<ol aria-label="Order progress">
  <li>
    Step 1: Cart
    <span> — Completed</span>
  </li>
  <li aria-current="step">
    Step 2: Shipping
    <span> — Current</span>
  </li>
  <li>
    Step 3: Payment
    <span> — Upcoming</span>
  </li>
</ol>
```

---

## HTML — Class-based

```html
<ol class="fc-progress-indicator" aria-label="Checkout steps">
  <li class="fc-progress-indicator__step" data-state="complete">
    <div class="fc-progress-indicator__step-indicator" aria-hidden="true">✓</div>
    <span class="fc-progress-indicator__step-label">Cart</span>
    <span class="fc-progress-indicator__step-sr-status">Completed</span>
  </li>

  <li class="fc-progress-indicator__step" data-state="current" aria-current="step">
    <div class="fc-progress-indicator__step-indicator" aria-hidden="true">2</div>
    <span class="fc-progress-indicator__step-label">Shipping</span>
    <span class="fc-progress-indicator__step-description">Enter your delivery address</span>
    <span class="fc-progress-indicator__step-sr-status">Current step</span>
  </li>

  <li class="fc-progress-indicator__step" data-state="upcoming">
    <div class="fc-progress-indicator__step-indicator" aria-hidden="true">3</div>
    <span class="fc-progress-indicator__step-label">Payment</span>
    <span class="fc-progress-indicator__step-sr-status">Upcoming</span>
  </li>
</ol>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No dedicated APG pattern; uses list + `aria-current` semantics |
| **Role(s)** | `list` (native `<ol>`); `button` on step-indicator when interactive |
| **Required attributes** | `aria-label` on `root`; `aria-current="step"` on current step; visually-hidden status text on each step |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

**Keyboard interaction** *(interactive / non-linear mode only)*

| Key | Action |
|-----|--------|
| `Tab` | Move focus between clickable steps |
| `Enter` / `Space` | Navigate to the focused step |
| `ArrowLeft` / `ArrowUp` | Move focus to previous step |
| `ArrowRight` / `ArrowDown` | Move focus to next step |

---

## Behavior

**Native element / API used:** `<ol>` with semantic list items.

**Machine responsibilities:**
- Track `currentStep` index (0-based) and `completedSteps` set
- Assign `data-state` to each step based on its relation to `currentStep`
- Set `aria-current="step"` on the current step
- In **linear mode**: only steps up to `currentStep` are clickable/accessible
- In **non-linear mode**: any step is clickable; clicking emits `fc:step-change`
- `next()` / `prev()` API methods for wizard-style flows
- Emit `fc:step-change` on any step transition

**`@foolscap/core` API sketch:**

```ts
createProgressIndicator(options?: {
  steps: Array<{ label: string; description?: string }>
  defaultStep?: number           // default: 0
  linear?: boolean               // default: true — blocks skipping ahead
  orientation?: 'horizontal' | 'vertical'
}): {
  getRootProps(): Record<string, unknown>
  getStepProps(index: number): Record<string, unknown>
  getStepIndicatorProps(index: number): Record<string, unknown>
  next(): void
  prev(): void
  goTo(index: number): void
  state: {
    currentStep: number
    completedSteps: Set<number>
    totalSteps: number
    isFirst: boolean
    isLast: boolean
  }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:step-change` | `{ step: number, prevStep: number, direction: 'forward' \| 'back' }` | Step changes |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-orientation` | `horizontal \| vertical` | Layout direction |
| `data-linear` | `true \| false` | Locks forward-only navigation |

---

## Notes

- The connector between steps is a CSS pseudo-element (`::after` on `step`), not a DOM element — this keeps the markup clean.
- Visually hidden status text (`.fc-progress-indicator__step-sr-status`) must always be present; screen readers don't interpret `data-state` values.
- This component tracks *step state only* — it does not manage form state or validate between steps. Pair with `Form` for wizard validation.
- The `step-indicator` shows a number by default; swap for a checkmark icon on `complete` steps via CSS `content` or slotted content.
