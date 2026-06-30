# File Upload

> An input which allows users to upload a file from their device.
> **Tier:** 2 — Platform + shim
> **Also known as:** File input, File uploader, Dropzone
> **Native element:** `<input type="file">`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-file-upload` | Wrapper; carries `data-state` |
| `input` | `<input type="file">` | `.fc-file-upload__input` | Visually hidden; receives files |
| `dropzone` | `<label>` | `.fc-file-upload__dropzone` | Clickable + droppable area; `for` links to input |
| `icon` | `<svg>` / slot | `.fc-file-upload__icon` | Optional upload icon inside dropzone |
| `label` | `<span>` | `.fc-file-upload__label` | Instruction text inside dropzone |
| `hint` | `<span>` | `.fc-file-upload__hint` | Accepts / size limit hint text |
| `file-list` | `<ul>` | `.fc-file-upload__file-list` | Optional preview of selected files (rendered by consumer or shim) |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Interaction state | `data-state` | `idle` · `dragging` · `error` | `root` |
| Multiple files | `multiple` | boolean attribute | `input` |
| Disabled | `disabled` | boolean attribute | `input` + `root` carries `data-disabled` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-file-upload-border` | `border` on dropzone | `1px dashed var(--ink)` at 40% opacity |
| `--fc-file-upload-border-radius` | `border-radius` on dropzone | `4px` |
| `--fc-file-upload-padding` | `padding` on dropzone | `2rem` |
| `--fc-file-upload-drag-bg` | `background` on dropzone when `data-state="dragging"` | `var(--grey-100)` |
| `--fc-file-upload-gap` | `gap` between dropzone and file list | `0.75rem` |

---

## HTML — Classless

```html
<label>
  Upload a file
  <input type="file" />
</label>
```

---

## HTML — Class-based

```html
<div class="fc-file-upload" data-state="idle">
  <label class="fc-file-upload__dropzone" for="upload-1">
    <svg class="fc-file-upload__icon" aria-hidden="true"><!-- upload icon --></svg>
    <span class="fc-file-upload__label">Drag files here or click to browse</span>
    <span class="fc-file-upload__hint">PNG, JPG, PDF up to 10 MB</span>
  </label>
  <input
    class="fc-file-upload__input"
    id="upload-1"
    type="file"
    accept=".png,.jpg,.pdf"
    multiple
  />
  <ul class="fc-file-upload__file-list" aria-label="Selected files">
    <!-- rendered dynamically -->
  </ul>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern — native `<input type="file">` within a `<label>` provides full a11y |
| **Role(s)** | Inherited from native `<input>` and `<label>` |
| **Required attributes** | `for` on `<label>` matching `id` on `<input>`; `accept` attribute to communicate allowed types (screen readers read it); `aria-label` on file list |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

**Keyboard interaction**

| Key | Action |
|-----|--------|
| `Tab` | Focus the dropzone / label |
| `Enter` / `Space` | Activate native file picker dialog |
| `Tab` (after selection) | Move to next focusable element |

---

## Behavior

**Native element / API used:** `<input type="file">` — the browser handles the file picker dialog natively.

**Shim responsibilities:**
- **Drag-over detection:** Add `dragenter` / `dragover` listeners to the dropzone; set `data-state="dragging"` on root. Remove on `dragleave` / `drop`.
- **Drop relay:** On `drop`, extract `event.dataTransfer.files` and assign to the native input via a `DataTransfer` object (where supported), then emit `fc:drop`.
- **Change listener:** On native `change` event of the input, update `state.files` and emit `fc:change`.
- **Error state:** If consumer-supplied `maxSize` is exceeded, set `data-state="error"` on root and emit `fc:error`.

**`@foolscap/core` API sketch:**

```ts
createFileUpload(options?: {
  accept?: string      // mirrors the native accept attribute
  multiple?: boolean
  maxSize?: number     // bytes; informational validation only
}): {
  getInputProps(): Record<string, unknown>
  getDropzoneProps(): Record<string, unknown>
  state: {
    files: File[]
    isDragging: boolean
    error: string | null
  }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:change` | `{ files: File[] }` | After native `change` on input |
| `fc:drop` | `{ files: File[] }` | After files are dropped onto dropzone |
| `fc:error` | `{ message: string, files: File[] }` | When a file exceeds `maxSize` |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-size` | `sm` · `md` · `lg` | Adjusts dropzone padding and icon size |

---

## Notes

- The native `<input type="file">` is visually hidden (not `display:none`, which would break keyboard access) and triggered via the `<label>` association.
- File list rendering is intentionally left to the consumer; the shim only provides `state.files`. A default list item template can be provided as a CSS-only pattern.
- `DataTransfer` assignment for dropped files has limited browser support; fall back to dispatching a synthetic `change` event where needed.
- Future expansion: progress tracking per file (multi-upload), image thumbnail previews, drag-reordering of selected files.
