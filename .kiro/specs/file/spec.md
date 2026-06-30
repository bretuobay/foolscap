# File

> A representation of a file such as an uploaded attachment or a downloadable PDF.
> **Tier:** 1 — CSS only
> **Also known as:** Attachment, Download
> **Native element:** `<div>` or `<li>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` or `<li>` | `.fc-file` | Use `<li>` when inside a file list |
| `icon` | `<span>` | `.fc-file__icon` | File-type icon slot (`aria-hidden="true"`) |
| `info` | `<div>` | `.fc-file__info` | Groups name and metadata |
| `name` | `<span>` | `.fc-file__name` | File name; wrap in `<a>` for downloadable files |
| `meta` | `<span>` | `.fc-file__meta` | Optional: size, type, date |
| `remove` | `<button>` | `.fc-file__remove` | Optional remove/delete action |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-file-padding` | `padding` | `var(--fc-space-3)` |
| `--fc-file-border` | `border` | `1px solid var(--grey-300)` |
| `--fc-file-radius` | `border-radius` | `0` |
| `--fc-file-gap` | `gap` between icon and info | `var(--fc-space-2)` |

---

## HTML — Classless

```html
<!-- Downloadable file -->
<div>
  <a href="/files/report.pdf" download>report.pdf</a>
  <small>1.2 MB · PDF</small>
</div>

<!-- In a list of attachments -->
<ul>
  <li><a href="/files/a.pdf" download>a.pdf</a></li>
  <li><a href="/files/b.pdf" download>b.pdf</a></li>
</ul>
```

---

## HTML — Class-based

```html
<div class="fc-file">
  <span class="fc-file__icon" aria-hidden="true"><!-- pdf icon --></span>
  <div class="fc-file__info">
    <span class="fc-file__name">
      <a href="/files/report.pdf" download>report.pdf</a>
    </span>
    <span class="fc-file__meta">1.2 MB · PDF</span>
  </div>
  <button class="fc-file__remove" type="button" aria-label="Remove report.pdf">×</button>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | Inherited from container element |
| **Required attributes** | `aria-label` on remove button naming the specific file; `download` attribute on file link |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Notes

- This is a *display* component for representing an existing file, not a file upload control (see File Upload spec).
- When used in a list of files, wrap multiple `<div class="fc-file">` in `<ul>` and switch root element to `<li>`.
- Remove button should include the file name in its label for screen readers: `aria-label="Remove report.pdf"`.
