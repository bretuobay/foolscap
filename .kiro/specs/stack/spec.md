# Stack

> A wrapper component for adding consistent vertical margin between sibling elements using a single gap token.
> **Tier:** 1 — CSS only
> **Also known as:** —
> **Native element:** —

> **Note:** Stack is both one of the 60 catalogue components and a Foolscap layout primitive. The canonical spec lives at [`layout/stack`](../layout/stack/spec.md). This entry documents its use as a composable component alongside other components (e.g. stacking a Heading, Body, and Button inside a Card).

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-stack` | Flex column container; direct children receive `gap` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-stack-gap` | `gap` between children | `var(--fc-space-4, 1rem)` |
| `--fc-stack-align` | `align-items` | `stretch` |

---

## HTML — Classless

```html
<!-- Classless: direct children of <main>, <section>, <article>
     automatically receive the stack gap via the classless sheet -->
<main>
  <h1>Title</h1>
  <p>Body paragraph.</p>
  <button type="button">Action</button>
</main>
```

---

## HTML — Class-based

```html
<!-- Default gap (1rem) -->
<div class="fc-stack">
  <h2>Section heading</h2>
  <p>Supporting text.</p>
  <button type="button">Call to action</button>
</div>

<!-- Tighter gap -->
<div class="fc-stack" style="--fc-stack-gap: 0.5rem;">
  <label for="name">Name</label>
  <input id="name" type="text" />
  <p class="fc-hint">Enter your full name.</p>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | Inherited from children |
| **Required attributes** | None |
| **Contrast** | N/A — layout only |

---

## Notes

- CSS: `display: flex; flex-direction: column; gap: var(--fc-stack-gap)` on root
- The classless sheet applies Stack behavior to semantic block containers (`main`, `section`, `article`, `fieldset`) automatically — no class needed in classless mode
- Nest Stacks freely: a Stack inside a Card inside a Stack works naturally because gap only applies to direct children
- See also [`layout/stack`](../layout/stack/spec.md) for the layout-primitive perspective and responsive usage
