# Video

> Displays an embedded or self-hosted video with native browser controls.
> **Tier:** 1 — CSS only (native controls); Tier 2 optional for custom control overlay
> **Also known as:** Video player, Media player
> **Native element:** `<video>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-video` | Aspect-ratio wrapper |
| `video` | `<video>` | `.fc-video__player` | Native video element |
| `track` | `<track>` | — | Subtitle/caption track; inside `<video>` |
| `fallback` | `<p>` | — | Inside `<video>`; shown when video unsupported |
| `caption` | `<figcaption>` | `.fc-video__caption` | Optional description below |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Aspect ratio | `data-ratio` | `16-9` (default) · `4-3` · `1-1` · `9-16` | `root` |
| Autoplay | native `autoplay` | — | `video` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-video-radius` | `border-radius` | `0` |
| `--fc-video-border` | `border` | `none` |
| `--fc-video-caption-size` | `font-size` on caption | `0.875rem` |
| `--fc-video-caption-color` | `color` on caption | `var(--ink-muted)` |

---

## HTML — Classless

```html
<figure>
  <video controls width="100%" preload="metadata"
         poster="/assets/video-poster.jpg">
    <source src="/assets/video.mp4" type="video/mp4">
    <source src="/assets/video.webm" type="video/webm">
    <track kind="subtitles" src="/assets/en.vtt" srclang="en" label="English" default>
    <p>Your browser does not support HTML video.
       <a href="/assets/video.mp4">Download the video</a>.
    </p>
  </video>
  <figcaption>A demonstration of the Foolscap design system in action.</figcaption>
</figure>
```

---

## HTML — Class-based

```html
<figure class="fc-video" data-ratio="16-9">
  <video class="fc-video__player" controls preload="metadata"
         poster="/assets/video-poster.jpg"
         aria-label="Foolscap design system demo">
    <source src="/assets/video.mp4" type="video/mp4">
    <source src="/assets/video.webm" type="video/webm">
    <track kind="subtitles" src="/assets/en.vtt" srclang="en" label="English" default>
    <track kind="subtitles" src="/assets/fr.vtt" srclang="fr" label="Français">
    <p>Your browser does not support HTML video.
       <a href="/assets/video.mp4">Download the video (MP4)</a>.
    </p>
  </video>
  <figcaption class="fc-video__caption">
    Foolscap design system — component overview (3 min)
  </figcaption>
</figure>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | No explicit ARIA role; native `<video>` is recognised by AT |
| **Required attributes** | `controls` always present (do not rely on autoplay-only); at least one `<track kind="captions">` or `<track kind="subtitles">` in the content's language; `aria-label` or `<figcaption>` to describe the video |
| **Contrast** | N/A for native controls (browser-rendered); custom controls must meet WCAG 2.2 AA 4.5:1 |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-ratio` | `16-9` · `4-3` · `1-1` · `9-16` | Sets `aspect-ratio` CSS property on the wrapper |

---

## Notes

- Aspect-ratio containment via CSS `aspect-ratio` property on the wrapper + `width: 100%; height: 100%; object-fit: cover` on the `<video>` element.
- Never use `autoplay` without `muted`; browsers block unmuted autoplay. Avoid `autoplay` entirely for content with important audio — it violates WCAG 1.4.2.
- For a video with custom controls (play/pause button, progress scrubber, volume), those controls are native `<button>` and `<input type="range">` elements using JS event listeners on the `HTMLVideoElement` API — this is Tier 2 progressive enhancement.
- `preload="metadata"` is the recommended default — loads enough to display duration and first frame without downloading the full file.
