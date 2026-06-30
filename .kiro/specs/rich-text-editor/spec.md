# Rich Text Editor

> An interface for editing rich (formatted) text, usually through a WYSIWYG interface.
> **Tier:** 3* — Headless machine (minimal tier; v1 scope: bold, italic, lists, links, headings only)
> **Also known as:** RTE, WYSIWYG editor
> **Native element:** `<div contenteditable="true">`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-rte` | Outer wrapper |
| `toolbar` | `<div>` | `.fc-rte__toolbar` | `role="toolbar"` + `aria-label="Text formatting"` |
| `toolbar-group` | `<div>` | `.fc-rte__toolbar-group` | `role="group"` — logical button cluster |
| `toolbar-button` | `<button>` | `.fc-rte__toolbar-button` | Format action; `aria-pressed` for toggles |
| `editor` | `<div>` | `.fc-rte__editor` | `contenteditable="true" role="textbox" aria-multiline="true"` |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Active format | `data-state` | `active` | `toolbar-button` |
| Pressed (a11y) | `aria-pressed` | `true \| false` | `toolbar-button` (toggle formats) |
| Focused | `data-state` | `focused` | `root` |
| Disabled | `data-state` | `disabled` | `root` or individual `toolbar-button` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-rte-toolbar-bg` | `background` on `toolbar` | `var(--grey-50)` |
| `--fc-rte-toolbar-border` | `border-bottom` on `toolbar` | `1px solid var(--grey-200)` |
| `--fc-rte-toolbar-button-size` | `width` + `height` on `toolbar-button` | `32px` |
| `--fc-rte-toolbar-button-active-bg` | `background` on active `toolbar-button` | `var(--grey-200)` |
| `--fc-rte-editor-min-height` | `min-height` on `editor` | `120px` |
| `--fc-rte-editor-padding` | `padding` on `editor` | `var(--fc-space-3)` |
| `--fc-rte-border` | `border` on `root` | `1px solid var(--ink)` |

---

## HTML — Classless

```html
<!-- Bare contenteditable — no formatting toolbar in classless mode -->
<label for="rte">Content</label>
<div id="rte" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Content editor">
  <p>Start typing…</p>
</div>
```

---

## HTML — Class-based

```html
<div class="fc-rte">
  <div class="fc-rte__toolbar" role="toolbar" aria-label="Text formatting" aria-controls="editor-1">

    <div class="fc-rte__toolbar-group" role="group" aria-label="Text style">
      <button class="fc-rte__toolbar-button" aria-pressed="false" aria-label="Bold" data-command="bold">
        <strong>B</strong>
      </button>
      <button class="fc-rte__toolbar-button" aria-pressed="true" aria-label="Italic" data-command="italic" data-state="active">
        <em>I</em>
      </button>
    </div>

    <div class="fc-rte__toolbar-group" role="group" aria-label="Lists">
      <button class="fc-rte__toolbar-button" aria-pressed="false" aria-label="Bullet list" data-command="insertUnorderedList">
        ≡
      </button>
      <button class="fc-rte__toolbar-button" aria-pressed="false" aria-label="Numbered list" data-command="insertOrderedList">
        1.
      </button>
    </div>

    <div class="fc-rte__toolbar-group" role="group" aria-label="Heading">
      <button class="fc-rte__toolbar-button" aria-pressed="false" aria-label="Heading 2" data-command="formatBlock" data-value="h2">
        H2
      </button>
    </div>

    <div class="fc-rte__toolbar-group" role="group" aria-label="Insert">
      <button class="fc-rte__toolbar-button" aria-label="Insert link" data-command="createLink">
        🔗
      </button>
    </div>
  </div>

  <div
    class="fc-rte__editor"
    id="editor-1"
    contenteditable="true"
    role="textbox"
    aria-multiline="true"
    aria-label="Content editor"
    spellcheck="true"
  >
    <p>Start typing…</p>
  </div>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern; uses toolbar + textbox composite |
| **Role(s)** | `toolbar` on toolbar container; `textbox` on editor; `group` on toolbar sections |
| **Required attributes** | `role="toolbar" aria-label="..."` on toolbar; `aria-controls` pointing to editor id; `aria-pressed` on toggle format buttons; `role="textbox" aria-multiline="true" aria-label="..."` on editor |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

**Keyboard interaction**

| Key | Action |
|-----|--------|
| `Tab` | Move focus from editor to toolbar (F6 pattern) or between toolbar buttons |
| `Escape` from toolbar | Return focus to editor |
| `Ctrl/Cmd+B` | Toggle bold |
| `Ctrl/Cmd+I` | Toggle italic |
| `Ctrl/Cmd+K` | Insert/edit link |
| `Enter` in list | New list item |
| `Tab` in list item | Indent list item |
| `Shift+Tab` in list item | Outdent list item |
| Arrow keys in toolbar | Move between toolbar buttons |
| `Home` / `End` in toolbar | Jump to first/last toolbar button |

---

## Behavior

**Native element / API used:** `<div contenteditable="true">` + `document.execCommand` (legacy) or Selection API.

**Machine responsibilities:**
- On toolbar button click: apply the format command to the current selection (`document.execCommand` or Selection API equivalent)
- Track active formats at current cursor position via `document.queryCommandState` or `getComputedStyle` on selection range; update `aria-pressed` on toolbar buttons
- Listen for `selectionchange` event to update toolbar state on cursor move
- For links: show a mini input dialog (popover) to capture the URL; apply `createLink`
- Emit `fc:change { html: string }` on content mutation (`MutationObserver` on editor)
- Prevent toolbar buttons from taking focus away from the `contenteditable` (use `mousedown` `preventDefault`, not `click`)

**`@foolscap/core` API sketch:**

```ts
createRichTextEditor(options?: {
  defaultValue?: string          // initial HTML content
  placeholder?: string
}): {
  getRootProps(): Record<string, unknown>
  getToolbarProps(): Record<string, unknown>
  getToolbarButtonProps(command: string, value?: string): Record<string, unknown>
  getEditorProps(): Record<string, unknown>
  execCommand(command: string, value?: string): void
  getValue(): string             // returns current HTML
  setValue(html: string): void
  state: {
    activeFormats: Set<string>   // currently active format commands
    isEmpty: boolean
  }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:change` | `{ html: string }` | Content changes (debounced) |
| `fc:selection-change` | `{ activeFormats: string[] }` | Cursor moves / selection changes |

---

## Notes

- **v1 scope is intentionally minimal**: bold, italic, unordered list, ordered list, links, h1–h3. All other formatting is out of scope.
- `document.execCommand` is deprecated but still universally supported. The machine wraps it so it can be swapped for a Selection API implementation without changing the consumer API.
- Extension point: replace `editor` with a headless wrapper around Tiptap, Lexical, or ProseMirror. The toolbar and `@foolscap/core` API surface remain the same — only `getEditorProps()` changes to bind to the engine's ref/mount mechanism.
- The toolbar uses `mousedown` + `preventDefault` on buttons to avoid the `contenteditable` losing its selection before the command fires.
- `aria-controls` on toolbar points to the editor `id` — this is advisory for AT, not strictly required.
