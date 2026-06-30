# Interaction Design Patterns

> Curated catalog synthesized from the `research-papers/` collection (1985–2026). Cross-referenced with `index.md` for full paper details.
>
> **Status badges**
> - ✅ **Current** — Widely used, considered best practice today
> - ⚠️ **Declining** — Still in use but being replaced by better alternatives
> - 🏛 **Legacy** — Prominent in early web (pre-2010), rarely used today; of historical/research interest
> - 🚀 **Emerging** — Gaining adoption, especially in AI-native and modern mobile interfaces
>
> **Lookup tip:** Use your editor's search (Ctrl/Cmd+F) on a keyword, or scan the Quick-Reference Table below. Source numbers (e.g. `#8`) link to entries in [index.md](index.md).

---

## Quick-Reference Table

| Pattern | Category | Status | Key Sources |
|---------|----------|--------|-------------|
| Global Navigation / Top Nav Bar | Navigation | ✅ | #8, #31 |
| Breadcrumbs | Navigation | ✅ | #8, van Welie |
| Tab Rows | Navigation | ✅ | #8, van Welie |
| Mega Menu / Fat Menus | Navigation | ✅ | #8 |
| Escape Hatch | Navigation | ✅ | #8 |
| Deep-linked State | Navigation | ✅ | #8 |
| Sitemap Footer | Navigation | ✅ | #8, van Welie |
| Sign-in Tools | Navigation | ✅ | #8 |
| Sequence Map / Step Indicator | Navigation | ✅ | #8, van Welie |
| Annotated Scrollbar | Navigation | ⚠️ | #8 |
| Doormat Navigation | Navigation | 🏛 | van Welie |
| HTML Frames Navigation | Navigation | 🏛 | #31 |
| Visual Framework | Layout | ✅ | #8 |
| Center Stage | Layout | ✅ | #8 |
| Grid of Equals (Card Grid) | Layout | ✅ | #8 |
| Titled Sections | Layout | ✅ | #8 |
| Accordion | Layout | ✅ | #8, van Welie |
| Collapsible Panels | Layout | ✅ | #8, van Welie |
| Responsive Disclosure | Layout | ✅ | #8 |
| Liquid / Responsive Layout | Layout | ✅ | #8 |
| Modal Panel | Layout | ✅ | #8, van Welie |
| Movable Panels | Layout | ⚠️ | #8 |
| Thumbnail Grid | Lists & Data | ✅ | #8 |
| Carousel / Filmstrip | Lists & Data | ✅ | #8, van Welie |
| Row Striping | Lists & Data | ✅ | #8 |
| Pagination | Lists & Data | ✅ | #8, van Welie |
| Infinite List / Infinite Scroll | Lists & Data | ✅ | #8 |
| Sortable Table | Lists & Data | ✅ | #8, van Welie |
| Cascading Lists | Lists & Data | ✅ | #8 |
| Tree Table | Lists & Data | ✅ | #8 |
| Overview + Detail | Lists & Data | ✅ | #8, van Welie |
| Datatips (Rich Tooltips) | Lists & Data | ✅ | #8 |
| Small Multiples | Lists & Data | ✅ | #8 |
| News Ticker / Scrolling Marquee | Lists & Data | 🏛 | #31 |
| Input Prompt (Placeholder Text) | Forms & Input | ✅ | #8 |
| Input Hints | Forms & Input | ✅ | #8 |
| Autocompletion | Forms & Input | ✅ | #8, #36 |
| Forgiving Format | Forms & Input | ✅ | #8 |
| Structured Format | Forms & Input | ✅ | #8 |
| Good Defaults | Forms & Input | ✅ | #8 |
| Same-page Error Messages | Forms & Input | ✅ | #8 |
| Password Strength Meter | Forms & Input | ✅ | #8 |
| Dropdown Chooser | Forms & Input | ✅ | #8 |
| List Builder | Forms & Input | ✅ | #8, van Welie |
| Fill-in-the-Blanks | Forms & Input | ✅ | #8 |
| Button Groups | Feedback & Actions | ✅ | #8 |
| Hover Tools | Feedback & Actions | ✅ | #8 |
| Prominent Done Button | Feedback & Actions | ✅ | #8 |
| Preview | Feedback & Actions | ✅ | #8 |
| Progress Indicator | Feedback & Actions | ✅ | #8, van Duyne |
| Cancelability | Feedback & Actions | ✅ | #8 |
| Multi-level Undo | Feedback & Actions | ✅ | #8 |
| Command History | Feedback & Actions | ✅ | #8 |
| Skeleton Loading Screen | Feedback & Actions | ✅ | — |
| Optimistic UI Update | Feedback & Actions | ✅ | — |
| Search Box | Search | ✅ | #8, van Welie, van Duyne |
| Faceted Navigation / Filtered Search | Search | ✅ | van Welie, van Duyne, #28 |
| Autocomplete (Search) | Search | ✅ | van Welie |
| Advanced Search | Search | ✅ | van Welie |
| Search Results Page | Search | ✅ | van Duyne |
| Tag Cloud | Search | ⚠️ | van Welie |
| Site Map (Navigation Aid) | Search | ⚠️ | van Welie, van Duyne |
| Site Index (Alphabetical) | Search | 🏛 | van Welie |
| Bottom Navigation Bar | Mobile | ✅ | #8, #12 |
| Vertical Stack Layout | Mobile | ✅ | #8 |
| Touch Tools | Mobile | ✅ | #8, #12 |
| Thumbnail-and-Text List | Mobile | ✅ | #8 |
| Generous Borders (Large Touch Targets) | Mobile | ✅ | #8, #36 |
| Loading Indicators | Mobile | ✅ | #8, #36 |
| Pull to Refresh | Mobile | ✅ | #12 |
| Swipe Actions | Mobile | ✅ | #12 |
| Floating Action Button (FAB) | Mobile | ✅ | #12 |
| Bottom Sheet / Action Sheet | Mobile | ✅ | #12 |
| Streamlined Branding | Mobile | ✅ | #8 |
| Stylus Input Patterns | Mobile | 🏛 | #36 |
| PDA Synchronisation Pattern | Mobile | 🏛 | #34 |
| Sharing Widget | Social | ✅ | #8 |
| Social Links | Social | ✅ | #8 |
| Repost & Comment | Social | ✅ | #8 |
| Editorial Mix | Social | ✅ | #8 |
| News Box (RSS Widget) | Social | ⚠️ | van Welie |
| Guest Book | Social | 🏛 | van Duyne |
| Send-a-Friend Link | Social | 🏛 | van Welie |
| Conversational UI (Chat Interface) | AI & Agent | 🚀 | #30 |
| Canvas UI | AI & Agent | 🚀 | #30 |
| Contextual UI (Inline AI Suggestions) | AI & Agent | 🚀 | #30 |
| Modular UI (Composable AI Widgets) | AI & Agent | 🚀 | #30 |
| Emergent Interface (AI-generated UI) | AI & Agent | 🚀 | #30 |
| Text Prompting | AI & Agent | 🚀 | #30 |
| Visual Prompting | AI & Agent | 🚀 | #30 |
| Multi-modal Prompting | AI & Agent | 🚀 | #30 |
| Parameter Controls for AI | AI & Agent | 🚀 | #30 |
| Streaming Text / Progressive Response | AI & Agent | 🚀 | #30 |
| Turn-based Human-AI Collaboration | AI & Agent | 🚀 | #30 |
| Simultaneous Human-AI Co-editing | AI & Agent | 🚀 | #30 |
| HTML Frames (Frameset Layout) | Legacy | 🏛 | #31 |
| Splash Screen / Flash Intro | Legacy | 🏛 | #31, #13 |
| Under Construction Page | Legacy | 🏛 | — |
| Hit Counter | Legacy | 🏛 | — |
| Scrolling Marquee (`<marquee>`) | Legacy | 🏛 | #31 |
| Image Maps (Clickable Navigation) | Legacy | 🏛 | #31 |
| Pop-up Window (`window.open()`) | Legacy | 🏛 | #31 |
| DHTML Flyout Menus | Legacy | 🏛 | #31 |
| Web Ring Navigation | Legacy | 🏛 | — |
| Animated GIF Banner | Legacy | 🏛 | — |
| Fixed Width Layout (800px / 1024px) | Legacy | 🏛 | #31 |
| Printer-Friendly Pages | Legacy | 🏛 | van Duyne |
| Skeuomorphic Design | Legacy | 🏛 | #13 |
| WIMP Paradigm | Legacy | 🏛 | #9, #31 |

---

## 1. Navigation & Wayfinding

---

#### Global Navigation / Top Nav Bar ✅ Current

**Problem:** Users need a persistent, predictable anchor to understand where they are in a site and how to jump to major sections at any time.

**Solution:** A horizontal bar fixed at the top of every page (or view) containing the site logo/home link and links to the main sections. Stays visible on scroll or collapses into a hamburger menu on small screens.

**Real-world examples:** GitHub's top bar, Stripe's marketing site, Amazon's category nav.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces), [Mandel Encyclopedia — #31](index.md#31-usersystem-interface-design-encyclopedia-entry)

---

#### Breadcrumbs ✅ Current

**Problem:** On deep hierarchical sites, users lose track of where they are and can't backtrack without using the browser's back button.

**Solution:** A horizontal trail of links showing the full path from the site root to the current page (e.g., `Home > Electronics > Phones > iPhone 15`). Each node is clickable, letting users jump to any ancestor level.

**Real-world examples:** Amazon product pages, eBay, Wikipedia, e-commerce category pages.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces), van Welie collection

---

#### Tab Rows ✅ Current

**Problem:** A page or panel has distinct content sections that should be switchable without a full page reload.

**Solution:** A row of labeled tabs above a content area; clicking a tab shows its associated content and hides the others. Tabs are visually distinct from the content below. On mobile, tabs may scroll horizontally or shift to a bottom nav bar.

**Real-world examples:** Gmail (Primary / Promotions / Social), browser tabs, GitHub repo tabs (Code, Issues, PRs).

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces), van Welie collection

---

#### Mega Menu / Fat Menus ✅ Current

**Problem:** A site with many categories and sub-categories can't expose its full depth through a single horizontal nav bar or a traditional narrow dropdown.

**Solution:** Hovering or clicking a top-level nav item opens a large panel — spanning multiple columns — that reveals subcategories, featured items, or images. Gives users a "map" of the site structure in one glance.

**Real-world examples:** Best Buy, IKEA, most large e-commerce and news sites.

**Sources:** [Tidwell (2nd ed.) — #8](index.md#8-designing-interfaces)

---

#### Escape Hatch ✅ Current

**Problem:** A user is in a deep flow (wizard, checkout, modal) and feels trapped — there's no obvious way to cancel or exit without losing context.

**Solution:** Always provide a clearly labeled exit: a "Cancel," "×" close button, or top-level logo link. Ideally with a warning if unsaved work would be lost. Never trap users in a mode with no way out.

**Real-world examples:** Every modal dialog's × button, wizard "Cancel" links, checkout "Continue shopping" links.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Deep-linked State ✅ Current

**Problem:** Single-page apps update the UI without changing the URL, so users can't bookmark a specific view, share a link to it, or use the browser's back button reliably.

**Solution:** Encode all meaningful UI state — active tab, search query, filters, selected item — in the URL. Each application state has a unique, shareable URL.

**Real-world examples:** Google Maps encodes map location and zoom in the URL; Figma encodes selected node IDs; GitHub encodes branch and file path.

**Sources:** [Tidwell (2nd ed.) — #8](index.md#8-designing-interfaces)

---

#### Sitemap Footer ✅ Current

**Problem:** The main navigation can't surface every section; users who scroll to the bottom of a page often want a comprehensive directory.

**Solution:** A multi-column footer containing links to all major (and many minor) pages, organized by category. Acts as a secondary navigation for power users and helps search engine crawlers.

**Real-world examples:** Apple.com footer, most large corporate and e-commerce sites.

**Sources:** [Tidwell (2nd ed.) — #8](index.md#8-designing-interfaces), van Welie collection

---

#### Sign-in Tools ✅ Current

**Problem:** Authenticated and unauthenticated users need different navigation affordances, and the state must be visible at a glance.

**Solution:** Persistent sign-in/sign-up calls to action for unauthenticated users; an avatar, username, or account menu for authenticated users — always in the same location (typically top-right corner).

**Real-world examples:** GitHub's avatar dropdown, Shopify's account icon, Twitter/X's sidebar profile link.

**Sources:** [Tidwell (2nd ed.) — #8](index.md#8-designing-interfaces)

---

#### Sequence Map / Step Indicator ✅ Current

**Problem:** In a multi-step flow (checkout, onboarding wizard, form), users don't know how long the process is or where they are in it.

**Solution:** A horizontal strip of numbered steps or labeled milestones above the active form, with the current step visually distinguished. Users can see total length and may click completed steps to go back.

**Real-world examples:** Amazon checkout (Cart → Shipping → Payment → Review), Stripe onboarding, insurance quote flows.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces), van Welie collection, van Duyne collection

---

#### Annotated Scrollbar ⚠️ Declining

**Problem:** In long documents or results lists, the scrollbar gives no information about what's at each scroll position.

**Solution:** Overlay the scrollbar with colored marks or thumbnails showing the positions of search results, bookmarks, errors, or other points of interest. Popularized by IDE editors for error gutter marks.

**Real-world examples:** VS Code's minimap + error markers on the scrollbar; browser "Find in page" result marks on the scrollbar (Firefox, Chrome).

**Why declining:** Rarely implemented in web UIs; mainly survives in desktop editors and developer tools. Most web apps rely on search + scroll without enriching the scrollbar.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Doormat Navigation 🏛 Legacy

**Problem:** Early portal sites had hundreds of categories with no natural hierarchy — they needed a homepage that surfaced everything.

**Solution:** A homepage dominated by a large grid of labeled links or boxes, one per major section, arranged like a visual table of contents. No images, no hierarchy — just a grid of text links.

**Historical context:** AOL, Yahoo!, MSN, and government portals used this pattern heavily in the late 1990s and early 2000s. Essentially a visual sitemap placed on the homepage.

**Why declined:** Users scan pages, not read them. Dense link grids are overwhelming. Modern sites replaced this with focused hero sections, search, and mega menus that reveal depth on demand.

**Sources:** van Welie collection

---

#### HTML Frames Navigation 🏛 Legacy

**Problem:** Designers wanted a persistent navigation sidebar or header that didn't reload on every page click, while the main content changed.

**Solution:** Used HTML `<frameset>` to split the browser window into two or more independent scrollable frames — typically a fixed left/top nav frame and a main content frame. Clicking nav links targeted the content frame.

**Historical context:** Dominant navigation pattern from ~1996–2003. Netscape Navigator 2.0 introduced frames; they became nearly universal before CSS layouts matured.

**Why declined:** Broke the browser back button, made URLs non-shareable (URL always showed the frameset, not the current page), caused accessibility failures, and didn't work with search engine indexers. CSS layouts and later SPAs made frames unnecessary.

**Sources:** [Mandel Encyclopedia — #31](index.md#31-usersystem-interface-design-encyclopedia-entry)

---

## 2. Content Organization & Layout

---

#### Visual Framework ✅ Current

**Problem:** Without a consistent visual structure, each page feels like a different site — users re-orient from scratch every time.

**Solution:** Define a fixed set of visual zones (header, primary nav, content area, sidebar, footer) that appear in the same positions on every page. Use consistent color, typography, and spacing for each zone. This gives users a stable mental model.

**Real-world examples:** Every well-designed site or app — the layout "frame" that never changes while content does.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Center Stage ✅ Current

**Problem:** Pages contain primary content and secondary supporting content; users should immediately know where to focus.

**Solution:** The most important content occupies the largest, most prominent central area of the page. Secondary items (navigation, related content, ads) are placed around the edges. Nothing competes visually with the main content.

**Real-world examples:** News article pages, product detail pages, blog posts.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Grid of Equals / Card Grid ✅ Current

**Problem:** A collection of items (products, articles, profiles) needs to be displayed without implying any item is more important than another.

**Solution:** Lay out items as a uniform grid of cards — same size, same visual weight. Each card is a self-contained unit with image, title, and brief metadata. The grid reflows responsively.

**Real-world examples:** Pinterest, Netflix browse, Google Images, Airbnb listings, Dribbble.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Titled Sections ✅ Current

**Problem:** Long pages with mixed content become hard to scan; users can't tell where one topic ends and another begins.

**Solution:** Divide the page into named sections with clear visual headings. Each section is visually separated (whitespace, divider, or background change). Makes the page skimmable and allows in-page anchor links.

**Real-world examples:** Any long-form content page: GitHub READMEs, landing pages, documentation sites.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Accordion ✅ Current

**Problem:** A list of sections has too many items to display all at once, but users need to be able to access any of them quickly.

**Solution:** Display section headers in a stacked list; clicking a header expands its content below while optionally collapsing the previously open section. Compresses a large amount of content into a small space.

**Real-world examples:** FAQ sections, mobile settings menus, sidebar nav trees, pricing plan features.

**Sources:** [Tidwell (2nd ed.) — #8](index.md#8-designing-interfaces), van Welie collection

---

#### Collapsible Panels ✅ Current

**Problem:** A complex UI (dashboard, IDE, design tool) has multiple panels that aren't always needed simultaneously, and screen space is limited.

**Solution:** Each panel has a toggle button (chevron, arrow, or header click) that collapses it to a minimal state (just the header) and expands it to full height. Users customize their working view without losing access to any panel.

**Real-world examples:** Figma's layers and properties panels, VS Code's sidebar sections, Notion's collapsible blocks.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces), van Welie collection

---

#### Responsive Disclosure ✅ Current

**Problem:** Beginners need guidance and context; advanced users find the same guidance condescending and distracting.

**Solution:** Show only the essential controls or fields initially. As users interact — or as they match an advanced-user profile — reveal additional options progressively. Never overwhelm beginners with power-user options.

**Real-world examples:** Google Search's "Advanced search" link; "More options" toggles in forms; progressive feature unlocking in onboarding flows.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Liquid / Responsive Layout ✅ Current

**Problem:** Screens come in vastly different sizes (320px mobile to 4K desktop). Fixed-pixel layouts break on most devices.

**Solution:** Design layouts using relative units (%, `vw`, `fr`, `rem`) and CSS breakpoints so components reflow, resize, and restructure to fit the available viewport. Content remains accessible and readable at all sizes.

**Real-world examples:** Every modern website. Foundational principle in CSS Grid, Flexbox, and all major UI frameworks.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Modal Panel ✅ Current

**Problem:** A task requires user input or confirmation, but navigating to a new page would break the user's current context.

**Solution:** Overlay a focused dialog or panel on top of the current page. Dim or blur the background to signal the modal's elevated context. Provide a clear way to dismiss (× button, Escape key, click outside). Return the user to their original context when done.

**Real-world examples:** Confirmation dialogs, login popups, image lightboxes, "share" dialogs, cookie consent banners.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces), van Welie collection

---

#### Movable Panels ⚠️ Declining

**Problem:** In complex tool UIs (IDEs, dashboards), different users need different panel arrangements for their workflow.

**Solution:** Allow panels to be dragged and repositioned, docked to edges, or detached into floating windows. User preferences are persisted across sessions.

**Real-world examples:** VS Code panel docking, Bloomberg Terminal, legacy Adobe Flash IDE, some analytics dashboards.

**Why declining:** High implementation cost and UX complexity. Most modern tools instead offer a small set of curated layout presets. Desktop-only UX that doesn't translate to mobile.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

## 3. Lists & Data Display

---

#### Thumbnail Grid ✅ Current

**Problem:** A collection of visual items (photos, videos, products) needs to be browsed quickly at a glance.

**Solution:** Display items as uniform thumbnail images in a responsive grid. Hovering or tapping a thumbnail reveals a brief label or action. Clicking opens the detail view.

**Real-world examples:** Google Images, YouTube video grid, Instagram grid, e-commerce category pages.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Carousel / Filmstrip ✅ Current

**Problem:** Multiple related items (featured products, hero images, testimonials) need to occupy the same screen space sequentially.

**Solution:** A horizontally scrolling strip with navigation arrows or swipe gestures. One or a few items are visible at a time; others are clipped off-screen. Dots or numbered indicators show position.

**Real-world examples:** Netflix hero carousels, e-commerce image galleries, testimonial sliders, app store screenshots.

**Note:** Carousels are widely used but frequently criticized in usability research — items past the first position get dramatically less engagement. Use sparingly and ensure the first item carries the most important content.

**Sources:** [Tidwell (2nd ed.) — #8](index.md#8-designing-interfaces), van Welie collection

---

#### Row Striping ✅ Current

**Problem:** In dense tables with many columns, the eye struggles to track a row across the full width without losing its place.

**Solution:** Apply alternating background colors to odd and even table rows (e.g., white and very light gray). This subtle banding guides the eye horizontally with no extra UI elements.

**Real-world examples:** Financial tables, spreadsheet applications, admin data tables, transaction histories.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Pagination ✅ Current

**Problem:** A data set or search result set is too large to display in full — loading everything at once would be slow and overwhelming.

**Solution:** Display a fixed number of items per page (e.g., 20 or 50). Provide numbered page links or prev/next controls at the bottom. Users choose their page. URL includes the page parameter for shareability.

**Real-world examples:** Google search results, eBay search, database admin tables.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces), van Welie collection

---

#### Infinite List / Infinite Scroll ✅ Current

**Problem:** Paginating a social feed or content stream interrupts the browsing experience with an unnecessary interaction.

**Solution:** As the user scrolls to near the bottom of the current items, silently fetch and append the next batch. Content appears to be endless. A loading indicator appears briefly during fetch.

**Real-world examples:** Twitter/X timeline, Instagram feed, TikTok (vertical), LinkedIn feed.

**Note:** Problematic for content users want to return to or reference later (lost position, no stable URLs per item). Best for consumption feeds, not task-oriented lists.

**Sources:** [Tidwell (2nd ed.) — #8](index.md#8-designing-interfaces)

---

#### Sortable Table ✅ Current

**Problem:** Tabular data is most useful when users can re-order it by the column most relevant to their task.

**Solution:** Make each column header a clickable sort toggle. First click sorts ascending, second sorts descending. Show a sort indicator arrow on the active column. Maintain the sort state across page interactions.

**Real-world examples:** GitHub issue lists, financial dashboards, admin CRMs, data tables in analytics tools.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces), van Welie collection

---

#### Cascading Lists ✅ Current

**Problem:** Hierarchical data (file systems, product categories, org charts) needs to be navigated level by level without losing context of the parent.

**Solution:** Display the hierarchy as a series of side-by-side columns. Selecting an item in a column populates the next column with its children. Columns slide in from the right as the user drills deeper; going back removes the rightmost column.

**Real-world examples:** macOS Finder column view, iOS Settings app, Apple Mail sidebar folder tree.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Tree Table ✅ Current

**Problem:** Data is hierarchical (like a file system) but also has multiple attributes per item that need to be compared across rows.

**Solution:** Combine a tree structure (rows with expandable children, indented by level) with tabular columns. Rows can be expanded to reveal sub-rows. Enables both hierarchy navigation and column-based comparison.

**Real-world examples:** GitHub Actions job logs, dependency trees in build tools, task management tools with subtasks.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Overview + Detail ✅ Current

**Problem:** A dataset is too complex to show in full at all times, but users need both the big picture and the specifics.

**Solution:** Split the view into two linked panels: an overview (map, list, minimap, thumbnail strip) and a detail area. Selecting or hovering an item in the overview updates the detail view. Both views are always visible simultaneously.

**Real-world examples:** Email clients (inbox list + reading pane), Google Maps (map + location card), VS Code (file tree + editor).

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces), van Welie collection

---

#### Datatips (Rich Tooltips) ✅ Current

**Problem:** Data points in dense charts or tables are too small to label directly, but users need values and context on demand.

**Solution:** Hovering over a data point, table cell, or truncated text reveals a tooltip containing full details, contextual information, or a mini-preview. The tooltip disappears when the cursor moves away.

**Real-world examples:** GitHub contributor graphs, analytics chart hover states, truncated text tooltips, code editor hover documentation.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Small Multiples ✅ Current

**Problem:** Showing change over time or comparison across many entities on a single large chart makes it unreadable.

**Solution:** Repeat the same chart type at a small scale — one per entity or time period — in a grid. Each mini-chart uses identical axes and scales, making visual comparison trivial.

**Real-world examples:** GitHub contribution graph (52 weeks × 7 days), Stripe's per-metric sparklines in dashboards, Figma's component variants overview.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### News Ticker / Scrolling Marquee 🏛 Legacy

**Problem:** Sites wanted to display a continuous stream of headlines or stock prices in a small horizontal space.

**Solution:** Text scrolled continuously from right to left in a fixed-height bar, auto-updating with new content. Implemented with the HTML `<marquee>` tag or JavaScript.

**Historical context:** Stock tickers and news crawls were ubiquitous on financial sites, portal homepages, and blogs in the late 1990s and early 2000s. TV-inspired aesthetic.

**Why declined:** Animated text is extremely distracting and violates WCAG accessibility guidelines (moving content without a pause control). `<marquee>` was deprecated in HTML5. Modern alternatives: static rotating news widgets, notification feeds, or real-time push updates in a dedicated sidebar.

**Sources:** [Mandel Encyclopedia — #31](index.md#31-usersystem-interface-design-encyclopedia-entry)

---

## 4. Forms & Input

---

#### Input Prompt (Placeholder Text) ✅ Current

**Problem:** Empty form fields give users no hint of what format or content is expected.

**Solution:** Display example or descriptive text inside the input field in a muted color. The text disappears as soon as the user starts typing. Used for format hints ("DD/MM/YYYY"), field labels in compact forms, or example values ("e.g. john@example.com").

**Real-world examples:** Search bars, registration forms, chat composer fields.

**Note:** Placeholder text should not replace a visible label — it disappears and is inaccessible to screen readers as a label. Use in addition to, not instead of, a proper `<label>`.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Input Hints ✅ Current

**Problem:** Users are unsure what's acceptable input — what format, constraints, or options are valid.

**Solution:** Display static helper text below or beside the field at all times (not just on error). Describe constraints: "Must be at least 8 characters", "Use letters and numbers only", or "Enter the CVV on the back of your card."

**Real-world examples:** Password requirement lists shown during account creation, card number format hints, phone number format guides.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Autocompletion ✅ Current

**Problem:** Typing a full value is slow and error-prone, especially for constrained vocabularies (city names, product names, tags, user mentions).

**Solution:** As the user types, display a dropdown of matching completions ranked by relevance. Keyboard arrow keys + Enter (or mouse click) select a completion, replacing the typed text with the full value.

**Real-world examples:** Google Search suggestions, GitHub @mentions, IDE code completion (IntelliSense), address fields.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces), [Nilsson (2009) — #36](index.md#36-design-patterns-for-user-interface-for-mobile-applications-copy-1)

---

#### Forgiving Format ✅ Current

**Problem:** Data can be entered in many equivalent formats (phone: "555-1234" vs "5551234" vs "(555) 1234"), and forcing one format causes errors.

**Solution:** Accept any reasonable format and normalize it internally. Strip spaces, dashes, parentheses from phone numbers. Accept dates in multiple formats. Show the normalized form after submission. Never reject valid data because of formatting.

**Real-world examples:** Stripe's card number field auto-inserts spaces. Phone fields accept any format. Credit card expiry accepts "01/27" or "01 / 27".

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Structured Format ✅ Current

**Problem:** Some data has a fixed, known structure (credit card number, US phone, date) — forcing the user to remember and apply that structure leads to errors.

**Solution:** Use masked inputs or multi-part fields that enforce the structure visually. Auto-advance the cursor to the next segment when one is complete (e.g., credit card number fields that jump at 4 digits).

**Real-world examples:** Credit card input fields (4-4-4-4 groups), US phone number (3-3-4), date of birth (MM/DD/YYYY) with separate fields.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Good Defaults ✅ Current

**Problem:** Forms and settings present blank slates — users must make decisions for every field, even ones that have an obvious best answer.

**Solution:** Pre-fill or pre-select the most likely value for each field. Use detected context (browser locale → country, account history → shipping address, common choices → default plan). Users can always override, but most won't need to.

**Real-world examples:** Country auto-detected from IP, "Remember me" pre-checked, current date pre-filled in date pickers, most popular plan pre-selected.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Same-page Error Messages ✅ Current

**Problem:** Submitting a form and navigating to a new error page loses the user's input and forces them to re-enter everything.

**Solution:** Validate inline or on submit, and display error messages directly beside the offending field — never on a new page. Preserve all valid input. Describe the error and how to fix it. Scroll to the first error automatically.

**Real-world examples:** Every well-designed registration or checkout form: "Email address is already in use", "This field is required" appearing next to the offending input.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Password Strength Meter ✅ Current

**Problem:** Users create weak passwords because they don't know how to evaluate password strength.

**Solution:** Display a visual strength indicator (colored bar: red → yellow → green) that updates in real time as the user types. Optionally show a label ("Weak", "Fair", "Strong") and a checklist of requirements met.

**Real-world examples:** GitHub, Dropbox, 1Password account creation.

**Sources:** [Tidwell (2nd ed.) — #8](index.md#8-designing-interfaces)

---

#### Dropdown Chooser ✅ Current

**Problem:** A field's valid values are from a known, bounded set — too many to show as radio buttons but small enough to enumerate.

**Solution:** A closed control that shows the current selection. Clicking opens a list of options; selecting one closes the list. For large option sets, include a search filter within the dropdown.

**Real-world examples:** Country selectors, currency selectors, font pickers, React's `<Select>` components.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### List Builder ✅ Current

**Problem:** A user needs to assemble a custom ordered or unordered collection from a larger set (selecting team members, adding tags, building a playlist).

**Solution:** Present a "source" list on the left and a "selected" list on the right. Users add items (drag, click arrow, or double-click) from source to selected, remove them, and optionally reorder. The selected list is the form value.

**Real-world examples:** Email recipient pickers, admin permission assignment UIs, playlist builders.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces), van Welie collection

---

#### Fill-in-the-Blanks ✅ Current

**Problem:** A complex structured query (e.g., "Send email to ___ at ___ on ___") is cognitively hard to compose in a free-text field.

**Solution:** Show a template sentence with editable blank fields inline. Users fill in the blanks in natural left-to-right reading order. The template makes the structure and intent immediately clear.

**Real-world examples:** IFTTT's "If this then that" recipe builder, GitHub Actions workflow editors, some rule-builder UIs in email marketing tools.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

## 5. Actions, Feedback & System Status

---

#### Button Groups ✅ Current

**Problem:** Related actions exist at the same level of importance — none should dominate, but grouping them signals their relationship.

**Solution:** Cluster related action buttons visually (touching borders or with a shared container). Primary + secondary actions often form a group. Segmented button groups (where exactly one option is active at a time) communicate state.

**Real-world examples:** Text editor toolbars (Bold / Italic / Underline), left-center-right text alignment buttons, GitHub's "Merge / Squash / Rebase" merge options.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Hover Tools ✅ Current

**Problem:** Actions on list items or cards clutter the UI when always visible but are needed quickly.

**Solution:** Hide per-item action buttons (edit, delete, share) until the user hovers over that item. On hover, the actions appear in place — no tooltip, no dropdown — and disappear when the cursor leaves.

**Real-world examples:** Gmail's hover actions (archive, delete, snooze) on message rows; GitHub's row-level edit/delete buttons in tables; Notion's block hover menu.

**Sources:** [Tidwell (2nd ed.) — #8](index.md#8-designing-interfaces)

---

#### Prominent Done Button ✅ Current

**Problem:** Multi-step forms and task flows end in an action button, but its visual weight varies — sometimes it's lost among other controls.

**Solution:** The final submit or completion action gets the highest visual emphasis: large size, primary brand color, full-width on mobile. No other button on the page competes for the same level of attention.

**Real-world examples:** "Place Order" on checkout, "Submit" on forms, "Publish" in CMS editors.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Preview ✅ Current

**Problem:** Users can't tell if an action (sending an email, publishing a page, changing a setting) will produce the result they intend until after they've done it.

**Solution:** Before the irreversible action, show an accurate preview of the output. The preview matches what will be rendered/sent/published exactly. Users can iterate before committing.

**Real-world examples:** Email composer preview pane, GitHub Markdown preview tab, print preview, social share preview card.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Progress Indicator ✅ Current

**Problem:** Operations that take time (uploads, form submissions, data processing) leave users wondering if anything is happening and how long it will take.

**Solution:** Show a visual progress indicator during the operation. Use a determinate progress bar (showing %) if completion can be estimated; use an indeterminate spinner if not. Always provide a way to cancel long operations.

**Real-world examples:** File upload bars, browser tab loading spinners, npm install progress, video buffering indicators.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces), van Duyne collection

---

#### Cancelability ✅ Current

**Problem:** Users initiate an operation (delete, send, publish) then immediately regret it or realize they made a mistake.

**Solution:** Provide a brief cancellation window after triggering an irreversible action. A toast or snackbar with an "Undo" button appears for 5–10 seconds. After the window passes, the action is completed.

**Real-world examples:** Gmail's "Undo send" feature, Google Drive's trash + "Undo" for moved files, Figma's action history.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Multi-level Undo ✅ Current

**Problem:** Users make mistakes during creative or editing work and need to revert not just the last action but a sequence of actions.

**Solution:** Maintain a full stack of reversible operations. Cmd/Ctrl+Z steps backward through the stack; Cmd/Ctrl+Shift+Z re-applies. In some apps, the history is shown as a named list users can jump through.

**Real-world examples:** Figma, VS Code, Photoshop, Google Docs, any text editor.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Command History ✅ Current

**Problem:** Power users repeat complex commands or want to audit what they (or collaborators) have done.

**Solution:** Log every meaningful command or action in a browsable history. Users can select a past command to re-execute or modify it. In CLIs, this is the up-arrow command history; in apps, it may be an audit log or activity feed.

**Real-world examples:** Terminal/shell command history, Figma version history, Notion page history, GitHub commit log.

**Sources:** [Tidwell — #8](index.md#8-designing-interfaces)

---

#### Skeleton Loading Screen ✅ Current

**Problem:** While content loads, a blank white page or abrupt content "pop-in" creates a jarring, broken-feeling experience.

**Solution:** Render placeholder shapes — gray animated blobs in the approximate shape of the content that will appear — while data loads. The skeleton gives users a sense of the incoming layout and signals that loading is in progress.

**Real-world examples:** LinkedIn feed, Facebook, YouTube, Slack — all use skeleton screens during initial load.

**Note:** Emerged post-2013 as SPAs became common; now a de facto standard. Perceived as faster than spinners even at identical load times.

**Sources:** — (industry best practice; not explicitly named in collection papers)

---

#### Optimistic UI Update ✅ Current

**Problem:** Network round-trips introduce latency — waiting for server confirmation before updating the UI makes interactions feel slow.

**Solution:** Immediately reflect the user's action in the UI (mark the message as sent, add the liked heart, check the todo item) before the server confirms. If the server fails, roll back and notify the user.

**Real-world examples:** Twitter like button, Slack message delivery, iMessage sent status, GitHub reactions.

**Sources:** — (modern SPA pattern; related to Cancelability in [Tidwell — #8](index.md#8-designing-interfaces))

---

## 6. Search & Discovery

---

#### Search Box ✅ Current

**Problem:** On large sites or in data-heavy apps, navigation alone can't surface the specific item a user is looking for.

**Solution:** A prominent text input (often with a magnifying glass icon) that accepts free-text queries and returns matching results. Placed in a consistent location — top bar, hero section, or sidebar. On mobile, may expand on icon tap.

**Real-world examples:** Every major site. Google's homepage is the ultimate expression of this pattern.

**Sources:** [Tidwell (2nd ed.) — #8](index.md#8-designing-interfaces), van Welie collection, van Duyne collection

---

#### Faceted Navigation / Filtered Search ✅ Current

**Problem:** A large result set (products, papers, job listings) is difficult to narrow down with a single text query.

**Solution:** Alongside results, display filter panels organized by attribute (category, price range, rating, date, location). Users apply multiple filters simultaneously; results update immediately. Active filters are shown as removable tags.

**Real-world examples:** Amazon's left sidebar filters, Airbnb's map + filter combination, Google Scholar's filters, job boards.

**Sources:** van Welie collection, van Duyne collection, [User Interface Design (book chapter) — #28](index.md#28-user-interface-design-book-chapter)

---

#### Autocomplete (Search) ✅ Current

**Problem:** Users aren't sure how to phrase a query, and typing full queries is slow.

**Solution:** As the user types in the search box, show a dropdown of predicted query completions or popular search terms. Selecting a suggestion submits that query immediately.

**Real-world examples:** Google Search suggestions, YouTube search autocomplete, Spotify search.

**Sources:** van Welie collection, [Nilsson (2009) — #36](index.md#36-design-patterns-for-user-interface-for-mobile-applications-copy-1)

---

#### Advanced Search ✅ Current

**Problem:** Power users need fine-grained control over search parameters (field-specific queries, boolean operators, date ranges) that don't fit in a basic search box.

**Solution:** A secondary interface — linked from the main search box as "Advanced search" — exposes structured filter fields. Results from advanced search may look identical to normal results.

**Real-world examples:** Google Advanced Search, GitHub code search with language/repo/date filters, PubMed advanced search.

**Sources:** van Welie collection

---

#### Search Results Page ✅ Current

**Problem:** Query results need to be presented in a way that helps users quickly evaluate relevance and find the right item.

**Solution:** Show results as a ranked list with: title, URL/source, summary snippet, and relevant metadata. Highlight matching query terms. Show result count and query time. Provide sort and filter options.

**Real-world examples:** Google results, Algolia-powered site search, Elasticsearch results UIs.

**Sources:** van Duyne collection

---

#### Tag Cloud ⚠️ Declining

**Problem:** A site with user-generated tags needs to surface the most popular topics and let users explore by tag.

**Solution:** Display all tags as a cloud of words; font size scales with tag frequency. Clicking a tag filters to content with that tag.

**Why declining:** Cognitive load is high — comparing font sizes is imprecise. Tags are also poorly maintained. Most modern sites replaced tag clouds with structured filters, trending topics lists, or "related articles" recommendations. Still occasionally appears on blogs and news sites.

**Sources:** van Welie collection

---

#### Site Map (Navigation Aid) ⚠️ Declining

**Problem:** Users who are lost on a site want a comprehensive map of all pages to find their destination.

**Solution:** A dedicated page listing every section and page on the site in a hierarchical outline, with links to each.

**Why declining:** Full-page sitemaps are rarely visited by real users — search within the site is faster. Sitemaps today primarily serve SEO purposes (XML sitemaps for search crawlers). The human-facing version survives in footer-link clusters.

**Sources:** van Welie collection, van Duyne collection

---

#### Site Index (Alphabetical) 🏛 Legacy

**Problem:** Large reference sites (encyclopedias, product directories) needed a way to browse all content by name when search wasn't yet powerful.

**Solution:** An A–Z index of all content, similar to the index in a printed book. Clicking a letter jumps to all items starting with that letter.

**Historical context:** Common on early reference sites (~1996–2005) when search was primitive and full-text indexing was slow. Government and library sites used this extensively.

**Why declined:** Site search and autocomplete made alphabetical indexes redundant for most use cases. Full-text search finds things alphabetical indexes can't.

**Sources:** van Welie collection

---

## 7. Mobile-Specific Patterns

---

#### Bottom Navigation Bar ✅ Current

**Problem:** On mobile phones, reaching the top of the screen with a thumb is awkward; top-placed global navigation is hard to hit.

**Solution:** Place 3–5 navigation items in a persistent bar at the bottom of the screen, within natural thumb reach. Each item has an icon and a short label. The active section is highlighted.

**Real-world examples:** Instagram, Twitter/X, TikTok, YouTube mobile — all use bottom nav bars.

**Sources:** [Tidwell (2nd ed.) — #8](index.md#8-designing-interfaces), [Punchoojit (2017) — #12](index.md#12-usability-studies-on-mobile-user-interface-design-patterns-a-systematic-literature-review)

---

#### Vertical Stack Layout ✅ Current

**Problem:** Desktop multi-column layouts don't fit on a single-column mobile screen.

**Solution:** Stack all page sections vertically in a single column, priority-ordered from top to bottom. The most important content appears first (above the fold). Horizontal elements (tables, multi-column forms) become scrollable or reflowed into vertical lists.

**Real-world examples:** Every responsive website on mobile — the single-column reflow is the default mobile layout.

**Sources:** [Tidwell (2nd ed.) — #8](index.md#8-designing-interfaces)

---

#### Touch Tools ✅ Current

**Problem:** On desktop, hover reveals secondary actions. On touch screens, there is no hover — controls are either always visible (cluttering the screen) or totally hidden.

**Solution:** Reveal actions on tap of the item itself (a brief tap shows controls in an overlay, a long press opens a context menu, or a dedicated "..." button exposes an action sheet). The primary tap action and the secondary actions are clearly distinguished.

**Real-world examples:** iOS Photos app (tap to see share/delete controls), Slack message long-press for reactions and actions, Twitter/X swipe actions.

**Sources:** [Tidwell (2nd ed.) — #8](index.md#8-designing-interfaces), [Punchoojit (2017) — #12](index.md#12-usability-studies-on-mobile-user-interface-design-patterns-a-systematic-literature-review)

---

#### Thumbnail-and-Text List ✅ Current

**Problem:** A list of items (messages, contacts, articles) needs enough visual context to distinguish items at a glance, but full cards are too large.

**Solution:** Each list row has a compact thumbnail image on the left and 1–2 lines of text (title + subtitle or timestamp) on the right. The row height is large enough to be tappable. This is the standard mobile list item.

**Real-world examples:** iOS Messages, Gmail on mobile, Spotify song lists, Reddit content feed.

**Sources:** [Tidwell (2nd ed.) — #8](index.md#8-designing-interfaces)

---

#### Generous Borders / Large Touch Targets ✅ Current

**Problem:** Small touch targets (buttons, links, icons) are hard to tap accurately with a finger — a stylus-era assumption that fingers are precise.

**Solution:** Make all interactive elements at least 44×44 points (Apple HIG) or 48×48dp (Material Design) to ensure reliable tappability. Pad hit areas beyond the visible element boundary when necessary. Increase spacing between adjacent controls.

**Real-world examples:** All well-designed mobile apps follow this. Apple's HIG and Google's Material Design both mandate minimum touch target sizes.

**Sources:** [Tidwell (2nd ed.) — #8](index.md#8-designing-interfaces), [Nilsson (2009) — #36](index.md#36-design-patterns-for-user-interface-for-mobile-applications-copy-1)

---

#### Loading Indicators ✅ Current

**Problem:** Mobile network latency is higher and more variable than desktop. Users need feedback that an action is processing.

**Solution:** Display a spinner, activity indicator, or progress bar whenever the app is fetching or processing. On mobile, the system spinner in the status bar or a component-level indicator provides this. Skeleton screens (see section 5) are the modern evolution.

**Real-world examples:** Pull-to-refresh spinning indicator, navigation bar activity indicator, in-button spinners during form submission.

**Sources:** [Tidwell (2nd ed.) — #8](index.md#8-designing-interfaces), [Nilsson (2009) — #36](index.md#36-design-patterns-for-user-interface-for-mobile-applications-copy-1)

---

#### Pull to Refresh ✅ Current

**Problem:** Social feeds and inboxes go stale as new content arrives — users need a clear gesture to trigger a refresh without navigating away.

**Solution:** Pulling the scroll view downward past the top triggers a refresh animation (spinner appears above the content), then new items are prepended to the list.

**Real-world examples:** Twitter/X, Instagram, Gmail, iOS Mail — universally adopted across all mobile OSes.

**Sources:** [Punchoojit (2017) — #12](index.md#12-usability-studies-on-mobile-user-interface-design-patterns-a-systematic-literature-review)

---

#### Swipe Actions ✅ Current

**Problem:** Common secondary actions (archive, delete, flag) on list items require too many taps if placed in a menu.

**Solution:** Swiping a list row left or right reveals action buttons in the space uncovered by the row. Left swipe: destructive actions (delete, archive). Right swipe: positive actions (mark as read, star, reply).

**Real-world examples:** iOS Mail (swipe to archive/delete), Todoist (swipe to complete), Gmail mobile.

**Sources:** [Punchoojit (2017) — #12](index.md#12-usability-studies-on-mobile-user-interface-design-patterns-a-systematic-literature-review)

---

#### Floating Action Button (FAB) ✅ Current

**Problem:** On content-heavy screens (feeds, lists), the single most important primary action needs to be always accessible without scrolling back to the top.

**Solution:** A circular button (usually 56dp) in a prominent color floats above the content, fixed at the bottom-right corner. It triggers the primary action for the screen (Compose, Add, Create). On scroll, it may collapse to show only its icon.

**Real-world examples:** Gmail's "Compose" button, Google Maps' location button, Android system-wide FAB convention.

**Sources:** [Punchoojit (2017) — #12](index.md#12-usability-studies-on-mobile-user-interface-design-patterns-a-systematic-literature-review)

---

#### Bottom Sheet / Action Sheet ✅ Current

**Problem:** On mobile, modal dialogs and dropdown menus are too small to tap comfortably; long menus don't fit on screen.

**Solution:** A panel that slides up from the bottom of the screen, covering the lower portion. Contains a list of actions or additional UI. Can be dismissed by dragging down or tapping the backdrop. A "modal" bottom sheet blocks interaction with content behind it; a "persistent" bottom sheet coexists with it.

**Real-world examples:** iOS Share Sheet, Google Maps destination options, Instagram story options, Airbnb filter panel.

**Sources:** [Punchoojit (2017) — #12](index.md#12-usability-studies-on-mobile-user-interface-design-patterns-a-systematic-literature-review)

---

#### Streamlined Branding ✅ Current

**Problem:** Desktop branding elements (large logo, tagline, hero images) consume too much of the small mobile screen.

**Solution:** Reduce branding to the minimum: a compact logo or wordmark in the nav bar, a single primary brand color, and stripped-down typography. Every pixel of screen real estate is reserved for content and actions.

**Real-world examples:** Most mobile apps show only a small logo + name in the top bar vs. large hero branding on desktop.

**Sources:** [Tidwell (2nd ed.) — #8](index.md#8-designing-interfaces)

---

#### Stylus Input Patterns 🏛 Legacy

**Problem:** Early smartphones and PDAs (Palm, Windows Mobile) had resistive touchscreens that required a stylus for accurate input.

**Solution:** Tap targets could be very small (as small as 8–10px) because stylus tips are precise. Text input was via on-screen handwriting recognition areas or numeric T9 keyboards.

**Historical context:** Dominant from ~1996 (Palm Pilot) through ~2007 (pre-iPhone). Windows Mobile and Pocket PC apps were heavily stylus-optimized. Nilsson's 2009 mobile patterns paper still addresses stylus scenarios.

**Why declined:** The iPhone (2007) introduced capacitive multi-touch with finger-only interaction, making stylus-optimized patterns obsolete overnight. The "Generous Borders" pattern is the direct replacement.

**Sources:** [Nilsson (2009) — #36](index.md#36-design-patterns-for-user-interface-for-mobile-applications-copy-1)

---

#### PDA Synchronisation Pattern 🏛 Legacy

**Problem:** Early mobile devices had no persistent network connectivity — they were offline devices that needed to sync data with a desktop or server when docked.

**Solution:** A background sync engine tracked all changes made offline on the device, then exchanged delta updates with the server when a connection was available (USB dock, WiFi, Bluetooth). Conflict resolution strategies handled divergent edits.

**Historical context:** Palm HotSync, ActiveSync (Windows Mobile), SyncML. The core pattern behind all PDA-era data management. Described in Roth (2002).

**Why declined / evolved:** Always-on mobile internet (3G, 4G, 5G) made continuous sync possible. The pattern evolved into "offline-first" architecture (IndexedDB, Service Workers, PouchDB/CouchDB sync) — the same idea, now applied to web apps that must survive intermittent connectivity. Not gone — just abstracted into the infrastructure layer.

**Sources:** [Roth (2002) — #34](index.md#34-patterns-of-mobile-interaction-copy-1)

---

## 8. Social & Community Patterns

---

#### Sharing Widget ✅ Current

**Problem:** Users want to share content to external platforms (Twitter, Facebook, LinkedIn, WhatsApp) without leaving the site.

**Solution:** A compact set of social platform icons or a generic "Share" button that opens platform-specific sharing dialogs or copies a link. Often placed below articles, products, or media.

**Real-world examples:** Share buttons on news articles, YouTube's share button, Pinterest's "Save" button, Web Share API on mobile browsers.

**Sources:** [Tidwell (2nd ed.) — #8](index.md#8-designing-interfaces)

---

#### Social Links ✅ Current

**Problem:** Organizations want visitors to connect with them across social platforms from a central location.

**Solution:** A cluster of social platform icons (with accessible labels) in the footer or profile section, each linking to the organization's presence on that platform.

**Real-world examples:** Every business website's footer, blog author bylines, personal portfolio sites.

**Sources:** [Tidwell (2nd ed.) — #8](index.md#8-designing-interfaces)

---

#### Repost & Comment ✅ Current

**Problem:** Social platforms need mechanisms for content to spread and for community discussion to happen in-context.

**Solution:** Each content item has a fixed set of engagement actions: repost/share (amplification), like/react (lightweight positive signal), and comment/reply (threaded discussion below the item). Counts are displayed to provide social proof.

**Real-world examples:** Twitter/X retweet, Reddit upvote/comment, Instagram like/comment, LinkedIn post engagement.

**Sources:** [Tidwell (2nd ed.) — #8](index.md#8-designing-interfaces)

---

#### Editorial Mix ✅ Current

**Problem:** Content feeds that show only chronological user-generated content become low-quality or low-engagement over time.

**Solution:** Blend algorithmic/curated content (featured articles, promoted posts, recommended items) with user-generated content in the feed. The mix is tuned to maximize engagement and content quality.

**Real-world examples:** Instagram's algorithmic feed mixing posts, Reels, and suggested accounts; Twitter's "For You" tab; Spotify's "Made for You" playlists.

**Sources:** [Tidwell (2nd ed.) — #8](index.md#8-designing-interfaces)

---

#### News Box (RSS Feed Widget) ⚠️ Declining

**Problem:** Websites wanted to surface recent headlines from an external news source or their own blog in a sidebar widget.

**Solution:** A small widget pulling from an RSS feed and displaying the 5–10 most recent headlines as clickable links, often with a timestamp.

**Why declining:** RSS fell out of mainstream use after Google Reader shut down (2013). Social platforms replaced RSS as the primary news discovery mechanism for most users. RSS survives in developer/power-user tools (Feedly, NewsBlur) and podcast apps.

**Sources:** van Welie collection

---

#### Guest Book 🏛 Legacy

**Problem:** Early websites had no comment systems — visitors had no way to leave feedback or acknowledgment for site owners.

**Solution:** A dedicated page where visitors could leave a name, message, and optional contact info — visible to all future visitors. Analogous to a physical guest book at a hotel or museum.

**Historical context:** Extremely common on personal websites, fan sites, and hobby pages from ~1994–2004. Often implemented with simple Perl/CGI scripts. The GeoCities era.

**Why declined:** Spam overwhelmed unmoderated guest books. Blog commenting systems (WordPress, Disqus) replaced them with threaded, per-post discussions. Social media "mention" and "tag" mechanisms replaced general site feedback.

**Sources:** van Duyne collection

---

#### Send-a-Friend Link 🏛 Legacy

**Problem:** Before social sharing was ubiquitous, sites wanted visitors to recommend content to others via email.

**Solution:** A "Email this page to a friend" link that opened a form where users entered the recipient's email address and an optional message. The site's server sent the email on their behalf.

**Historical context:** Common on news sites and e-commerce from ~1999–2010. Predates Twitter sharing buttons (2009) and the Facebook Like button (2009).

**Why declined:** Social sharing widgets and native OS share sheets made email-to-friend flows obsolete. Also raised spam concerns when abused.

**Sources:** van Welie collection

---

## 9. AI & Agent Interface Patterns 🚀

> All patterns in this section are sourced from the **GenAI Survey (2025) — [#30](index.md#30-survey-on-user-interface-design-and-interactions-for-generative-ai-applications)** and the **NeurIPS 2025 GUI Grounding paper — [#21](index.md#21-scaling-computer-use-grounding-via-user-interface-decomposition-and-synthesis)**, representing the current (2025) frontier of AI-native interface design.

---

#### Conversational UI (Chat Interface) 🚀 Emerging

**Problem:** Interacting with an AI model requires a medium that supports open-ended, back-and-forth dialogue with rich, structured responses.

**Solution:** A message-thread interface where the user types natural language messages and the AI responds in a chronological conversation. Messages may contain text, code blocks, images, tables, or interactive elements. Thread history is the interaction context.

**Enabling technology:** Large language models (LLMs) capable of multi-turn dialogue.

**Current examples:** ChatGPT, Claude, Gemini, Perplexity, GitHub Copilot Chat.

**Sources:** [GenAI Survey 2025 — #30](index.md#30-survey-on-user-interface-design-and-interactions-for-generative-ai-applications)

---

#### Canvas UI 🚀 Emerging

**Problem:** AI-assisted creative work (writing, design, code) involves an artifact that the user and AI collaboratively edit — a chat thread alone can't represent the artifact and its history cleanly.

**Solution:** A two-panel layout: a document/canvas (the artifact being created) alongside an AI chat or tool panel. The AI can directly edit the canvas; the user can also edit directly. The canvas is the shared working surface.

**Enabling technology:** LLMs with tool use / function calling to perform in-place edits.

**Current examples:** Claude's Artifacts, ChatGPT's Canvas mode, Notion AI, Google Docs + Gemini, Cursor IDE.

**Sources:** [GenAI Survey 2025 — #30](index.md#30-survey-on-user-interface-design-and-interactions-for-generative-ai-applications)

---

#### Contextual UI (Inline AI Suggestions) 🚀 Emerging

**Problem:** Users are working in an existing document, code file, or form and want AI assistance without switching to a separate chat interface.

**Solution:** AI suggestions appear inline — as ghost text completions, floating suggestion cards, or highlighted alternative phrasings — directly within the editing context. Users accept, reject, or modify suggestions in place.

**Enabling technology:** Fast, low-latency LLM inference for real-time completions.

**Current examples:** GitHub Copilot (ghost text in editors), Gmail Smart Compose, Grammarly inline suggestions, Figma AI suggestions.

**Sources:** [GenAI Survey 2025 — #30](index.md#30-survey-on-user-interface-design-and-interactions-for-generative-ai-applications)

---

#### Modular UI (Composable AI Widgets) 🚀 Emerging

**Problem:** Different AI capabilities (summarization, translation, image generation, data analysis) are needed in different parts of an application — a single chat or canvas doesn't fit all contexts.

**Solution:** AI capabilities are exposed as composable, embeddable widgets or blocks that can be added to any page or workflow: a "Summarize" button on articles, an "Explain" tooltip on code, a "Generate image" block in a CMS.

**Enabling technology:** LLM APIs that can be called per-component; streaming responses.

**Current examples:** Notion AI blocks (Summarize, Translate, Improve writing), Linear AI issue suggestions, Shopify Magic product description generator, Slack's AI summaries.

**Sources:** [GenAI Survey 2025 — #30](index.md#30-survey-on-user-interface-design-and-interactions-for-generative-ai-applications)

---

#### Emergent Interface (AI-generated UI) 🚀 Emerging

**Problem:** For novel or highly personalized tasks, no pre-designed UI exists — the interface itself needs to be generated based on the task.

**Solution:** The AI generates UI components, forms, or entire views dynamically based on the user's stated goal or context. The interface is transient and task-specific, not persistent.

**Enabling technology:** LLMs with code generation; React/component rendering from AI-generated code; agent-controlled browsers.

**Current examples:** Early experiments in AI-generated dashboards; agent tools that fill forms or click UI elements on behalf of users; Claude's ability to generate interactive HTML/JS artifacts.

**Sources:** [GenAI Survey 2025 — #30](index.md#30-survey-on-user-interface-design-and-interactions-for-generative-ai-applications), [NeurIPS 2025 — #21](index.md#21-scaling-computer-use-grounding-via-user-interface-decomposition-and-synthesis)

---

#### Text Prompting 🚀 Emerging

**Problem:** Users need to communicate their intent to an AI model in a way that's expressive enough to cover complex, multi-part tasks.

**Solution:** A free-text input field where the user writes a natural language instruction. The AI interprets the instruction and responds or acts. Prompt quality heavily influences output quality — UI affordances like example prompts, history, and prompt templates help users write better prompts.

**Current examples:** Every AI chat interface; also embedded in tools like Midjourney, Stable Diffusion, DALL-E.

**Sources:** [GenAI Survey 2025 — #30](index.md#30-survey-on-user-interface-design-and-interactions-for-generative-ai-applications)

---

#### Visual Prompting 🚀 Emerging

**Problem:** Some AI tasks require visual context that text alone cannot convey — "make this image look like X" or "explain what's happening in this screenshot."

**Solution:** Allow users to attach images, annotate them (draw boxes, circle areas, add arrows), or use screen captures as part of their prompt input. The AI processes the image alongside the text instruction.

**Enabling technology:** Multimodal LLMs (GPT-4V, Claude 3+, Gemini).

**Current examples:** ChatGPT's image upload, Claude's image analysis, Google Lens, GPT-4V for UI debugging.

**Sources:** [GenAI Survey 2025 — #30](index.md#30-survey-on-user-interface-design-and-interactions-for-generative-ai-applications)

---

#### Multi-modal Prompting 🚀 Emerging

**Problem:** Real-world tasks involve mixed media — a user might want to describe a problem verbally, show a screenshot, and paste code all as part of one query.

**Solution:** Input interfaces that accept simultaneous text, images, files, voice, and potentially video. All modalities are interpreted together as a unified prompt.

**Current examples:** GPT-4o (text + images + voice simultaneously), Gemini Pro Vision, Claude with document upload.

**Sources:** [GenAI Survey 2025 — #30](index.md#30-survey-on-user-interface-design-and-interactions-for-generative-ai-applications)

---

#### Parameter Controls for AI 🚀 Emerging

**Problem:** AI outputs (images, text, audio) can be tuned on dimensions like style, length, tone, creativity, or detail level — but these controls are invisible in pure chat interfaces.

**Solution:** Expose AI parameters as sliders, dropdowns, toggles, or style presets alongside the main generation UI. Users adjust parameters before or after generation and can see results update in real time.

**Current examples:** Midjourney style parameters (`--style`, `--chaos`), Stable Diffusion UI sliders (CFG scale, steps, seed), image generation apps with "style" preset buttons.

**Sources:** [GenAI Survey 2025 — #30](index.md#30-survey-on-user-interface-design-and-interactions-for-generative-ai-applications)

---

#### Streaming Text / Progressive Response 🚀 Emerging

**Problem:** LLM responses can take seconds to minutes to generate in full — waiting for the complete response before showing anything feels broken.

**Solution:** Stream tokens to the UI as they are generated, rendering text progressively word-by-word. The user sees the response "writing itself" in real time and can begin reading before generation completes. A stop button allows early termination.

**Current examples:** ChatGPT, Claude, all major LLM chat interfaces. Also implemented via Server-Sent Events (SSE) in custom apps.

**Sources:** [GenAI Survey 2025 — #30](index.md#30-survey-on-user-interface-design-and-interactions-for-generative-ai-applications)

---

#### Turn-based Human-AI Collaboration 🚀 Emerging

**Problem:** Complex tasks require iterative refinement — the human provides intent, the AI drafts, the human revises, the AI improves — across multiple rounds.

**Solution:** A structured conversation where each turn has clear roles: user provides instruction or feedback; AI responds with a complete attempt or asks a clarifying question. The artifact (document, code, plan) evolves across turns. Prior turns are visible for context.

**Current examples:** Standard ChatGPT and Claude workflows for writing, code generation, analysis.

**Sources:** [GenAI Survey 2025 — #30](index.md#30-survey-on-user-interface-design-and-interactions-for-generative-ai-applications)

---

#### Simultaneous Human-AI Co-editing 🚀 Emerging

**Problem:** Turn-based collaboration is slow for tasks where the human wants to stay in a flow state and have the AI assist in real time without breaking into discrete turns.

**Solution:** Human and AI work on the same document simultaneously. The human types; the AI fills in completions, suggests alternatives, or restructures adjacent content. Edits from both parties appear instantly. The human has final approval authority.

**Enabling technology:** Low-latency streaming inference + operational transform / CRDT for concurrent editing.

**Current examples:** GitHub Copilot in code editors (nearest current example), Cursor's "Composer" mode, early implementations in Google Docs + Gemini.

**Sources:** [GenAI Survey 2025 — #30](index.md#30-survey-on-user-interface-design-and-interactions-for-generative-ai-applications)

---

## 10. Legacy Patterns — Early Web Era 🏛

> These patterns were widely used in the early commercial web (~1994–2010). They are rarely found in new projects today but appear in HCI literature of the period and are important context for understanding how interaction design evolved.

---

#### HTML Frames (Frameset Layout) 🏛 Legacy

**Problem:** Designers wanted persistent navigation that didn't require a full page reload on every click (before AJAX and SPAs existed).

**Solution:** Used `<frameset>` to divide the browser viewport into 2–3 independent scrolling regions (frames). A top frame held a banner, a left frame held navigation, and the main frame showed content. Clicking a nav link replaced only the content frame.

**Historical context:** Introduced in Netscape Navigator 2.0 (1995). Nearly universal on business and government sites from 1996–2003. Replaced by CSS layouts, then by SPAs.

**Why declined:** Broke browser back button. URLs didn't reflect content state (always showed the frameset URL). Screen readers couldn't navigate across frames. Search engines couldn't index individual content pages. Printing was broken.

**Sources:** [Mandel Encyclopedia — #31](index.md#31-usersystem-interface-design-encyclopedia-entry)

---

#### Splash Screen / Flash Intro 🏛 Legacy

**Problem:** Brands wanted to create a dramatic, cinematic entry experience before presenting their actual website.

**Solution:** A full-screen animated page — almost always built in Adobe Flash — played a logo animation, music, and brand visuals before offering a "Skip intro" link or auto-advancing to the home page.

**Historical context:** Peak usage ~1999–2006. Flash enabled rich animation that HTML could not. Agency websites and luxury brands were particularly fond of this pattern.

**Why declined:** Flash required a browser plugin and was a major security vulnerability. Mobile devices (post-2007) didn't support Flash at all. Search engines couldn't index Flash content. Users learned to immediately click "Skip intro." Steve Jobs' public letter against Flash (2010) accelerated its demise; Flash was officially discontinued in 2020.

**Sources:** [Mandel Encyclopedia — #31](index.md#31-usersystem-interface-design-encyclopedia-entry), [Beautiful Interfaces — #13](index.md#13-beautiful-interfaces-from-user-experience-to-user-interface-design)

---

#### Under Construction Page 🏛 Legacy

**Problem:** Sites were launched piecemeal — sections not yet complete were linked from the nav but had no content.

**Solution:** Pages that weren't ready displayed an animated "Under Construction" image (usually a blinking "⚠️ Under Construction" GIF with a hardhat or excavator) and a message promising the page would be ready soon.

**Historical context:** Ubiquitous from ~1994–2005. A defining aesthetic of the early amateur web. GeoCities sites almost universally had at least one section "under construction."

**Why declined:** Users universally dislike dead ends. Best practice now: don't link to unfinished pages. Use feature flags, rolling deployments, or simply don't publish nav items until the content is ready.

**Sources:** — (ubiquitous early web convention)

---

#### Hit Counter 🏛 Legacy

**Problem:** Website owners wanted to know how many people had visited their site and wanted to display this as a badge of popularity.

**Solution:** A small image showing a running total of page visits, displayed prominently (often in the footer or sidebar). Implemented server-side with simple CGI scripts or third-party services like SiteCounter.

**Historical context:** Standard on personal homepages and small business sites from ~1994–2005. Part of the "web status symbol" culture of the era.

**Why declined:** Web analytics matured (Google Analytics launched 2005) and moved tracking server-side — no reason to display raw visit counts publicly. Privacy concerns. Easily gamed. No longer considered a meaningful or trustworthy metric to display.

**Sources:** — (ubiquitous early web convention)

---

#### Scrolling Marquee (`<marquee>`) 🏛 Legacy

**Problem:** Sites wanted to display a continuous stream of information in a limited space — inspired by physical LED ticker displays.

**Solution:** The HTML `<marquee>` tag caused enclosed text to scroll automatically from right to left (or in other directions) within its container. Used for news headlines, stock prices, announcements, and decorative effects.

**Historical context:** Introduced by Internet Explorer 1.0 (1995). Widely used on portal pages, news sites, and personal homepages through the early 2000s.

**Why declined:** Constantly moving text is extremely distracting and violates WCAG 2.1 (Success Criterion 2.2.2: Pause, Stop, Hide). `<marquee>` was deprecated in HTML5 and removed from the standard. Browsers still render it for backwards compatibility but it should never be used in new work.

**Sources:** [Mandel Encyclopedia — #31](index.md#31-usersystem-interface-design-encyclopedia-entry)

---

#### Image Maps (Clickable Image Navigation) 🏛 Legacy

**Problem:** Designers wanted to make different regions of an image separately clickable — for navigation, diagrams, or geographical maps — without using separate image files.

**Solution:** The HTML `<map>` element defined polygonal, rectangular, or circular "hot spots" over an image. Each hot spot was a link. Clicking different regions navigated to different pages.

**Historical context:** Used for geographic navigation (click a country on a world map), department directory pages (click a person's photo), and image-based nav bars in the 1990s–early 2000s.

**Why declined:** Accessibility failures (screen readers can't navigate clickable image regions without alt text on each area). No hover states without JavaScript. Responsive images broke fixed-pixel image maps. SVG, CSS, and JavaScript provide much better alternatives for all image-map use cases.

**Sources:** [Mandel Encyclopedia — #31](index.md#31-usersystem-interface-design-encyclopedia-entry)

---

#### Pop-up Window (`window.open()`) 🏛 Legacy

**Problem:** Advertisers and site owners wanted content (ads, registration forms, notifications) to appear without replacing the current page.

**Solution:** JavaScript's `window.open()` opened a new browser window (usually unsolicited) with fixed dimensions, no browser chrome, and often auto-playing content. Some sites opened multiple pop-ups on load.

**Historical context:** The dominant ad delivery mechanism ~1997–2004. Kazaa, adult sites, and ad networks launched dozens of pop-ups per visit. Entire software industries arose to block them.

**Why declined:** Browsers introduced integrated pop-up blockers (~2002–2004, IE6 SP2, Firefox). Pop-ups became synonymous with malware and spam. Modern browsers block all `window.open()` calls not triggered by direct user action. **Modals** (in-page overlays) are the legitimate successor for any use case that once required a pop-up.

**Sources:** [Mandel Encyclopedia — #31](index.md#31-usersystem-interface-design-encyclopedia-entry)

---

#### DHTML Flyout Menus 🏛 Legacy

**Problem:** Sites needed dropdown navigation menus with sub-levels, but CSS alone couldn't produce them reliably across early browsers.

**Solution:** JavaScript manipulated the DOM to show/hide absolutely-positioned `<div>` containers on hover events, creating multi-level nested dropdown menus. Required elaborate cross-browser workarounds (IE5, Netscape 4) and z-index hacks to render on top of `<select>` elements and plugins.

**Historical context:** The dominant complex navigation pattern from ~1998–2008. Libraries like Suckerfish Dropdowns and Superfish simplified implementation. Required IE-specific CSS filters and conditional comments.

**Why declined:** CSS3 made pure-CSS dropdowns reliable without JavaScript. Mega menus replaced deep nested hierarchies. Mobile touchscreens broke hover-dependent menus entirely.

**Sources:** [Mandel Encyclopedia — #31](index.md#31-usersystem-interface-design-encyclopedia-entry)

---

#### Web Ring Navigation 🏛 Legacy

**Problem:** Before search engines could reliably index the web, users visiting one personal site on a topic couldn't discover other related sites.

**Solution:** A "web ring" was a circular linked list of related sites. Each site in the ring displayed a widget with "Previous," "Next," and "Random" links that navigated to other sites in the ring. Rings were maintained by a central directory.

**Historical context:** Invented in 1994 by Sage Weil. Peak popularity ~1996–2001. Organized communities around topics (anime, photography, punk music) in the pre-Google era.

**Why declined:** Google (launched 1998) made web rings redundant — search could find related sites faster and more comprehensively. Social media links and algorithmic content recommendations replaced discovery rings entirely.

**Sources:** — (documented web history; not explicitly in collection papers)

---

#### Animated GIF Banner 🏛 Legacy

**Problem:** Advertisers needed a simple, universally supported format for animated display ads.

**Solution:** The animated GIF format (looping through multiple frames) was the only cross-browser animation available before Flash. Banner ads (the standard size was 468×60px — the "full banner") were almost always animated GIFs with flashing text and bright colors.

**Historical context:** The first web banner ad appeared in 1994 (AT&T on HotWired). Animated GIF banners dominated web advertising through ~2005, when Flash-based rich media ads took over, later replaced by HTML5 ad units.

**Why declined:** Extremely low click-through rates (industry average fell to <0.1%). Banner blindness (users learn to ignore them). Animated GIFs had very limited color depth (256 colors). Replaced by richer HTML5 ad formats, then by programmatic/native advertising.

**Sources:** — (documented web history)

---

#### Fixed Width Layout (800px / 1024px) 🏛 Legacy

**Problem:** Designers needed to know the exact pixel width of their canvas to produce precise layouts.

**Solution:** Design the entire site to a fixed pixel width — initially 640px, then 800px (for 800×600 monitors), then 1024px (for 1024×768). Content was centered in the browser window with empty space on the sides for wider screens. No adjustment for smaller screens.

**Historical context:** Fixed-width design was universal from the early web through ~2010. Ethan Marcotte's "Responsive Web Design" article (A List Apart, 2010) and the launch of the iPhone (2007) began the shift.

**Why declined:** The proliferation of screen sizes from mobile to 4K made fixed-width design unworkable. Liquid/responsive layout (using CSS media queries and relative units) is now the non-negotiable baseline.

**Sources:** [Mandel Encyclopedia — #31](index.md#31-usersystem-interface-design-encyclopedia-entry)

---

#### Printer-Friendly Pages 🏛 Legacy

**Problem:** Web pages included navigation, ads, and sidebars that wasted ink and obscured content when printed. Styling for print didn't exist in early CSS.

**Solution:** A separate "Printer-friendly" version of each article, stripped of navigation and ads, was maintained as a distinct page (e.g., `/article?print=true`). Users clicked a "Print this page" link to navigate to it before using Ctrl+P.

**Historical context:** Common on news sites and e-commerce from ~1998–2012, when CSS print media support was poor or ignored by developers.

**Why declined:** CSS `@media print` rules matured to the point where print stylesheets can suppress nav, ads, and sidebars automatically. No separate page needed. Browsers also improved their print dialogs. Declining further as printing itself declines.

**Sources:** van Duyne collection

---

#### Skeuomorphic Design 🏛 Legacy

**Problem:** Early GUI users were unfamiliar with digital interfaces and needed visual metaphors from the physical world to understand what on-screen elements did.

**Solution:** Digital UI elements were designed to look exactly like their physical counterparts: leather-stitched calendars, green felt game tables, wooden bookshelves, metal toggles with screws, yellow legal pad note apps, calculator apps with molded plastic buttons.

**Historical context:** Championed by Steve Jobs and Scott Forstall at Apple, iOS 6 (2012) and earlier were the peak of skeuomorphic design. Earlier examples: Windows 95's "Recycle Bin" trash can, 3D-beveled buttons, desktop "wallpaper."

**Why declined:** iOS 7 (2013, designed by Jony Ive) was a watershed moment, abandoning skeuomorphism entirely for "flat design." Users were now sufficiently familiar with digital conventions that physical metaphors were no longer needed — and the visual noise they added reduced clarity. Flat design and Material Design replaced skeuomorphism across the industry.

**Sources:** [Beautiful Interfaces — #13](index.md#13-beautiful-interfaces-from-user-experience-to-user-interface-design)

---

#### WIMP Paradigm (Windows-Icons-Menus-Pointer) 🏛 Legacy

**Problem:** The early command-line interface required users to memorize syntax — it was expert-only. A new metaphor was needed for broader audiences.

**Solution:** The WIMP paradigm (coined at Xerox PARC, popularized by Apple Macintosh in 1984) defined the modern desktop: a spatial desktop metaphor, overlapping resizable windows, icon-based file and app representation, a menu bar with hierarchical menus, and a pointer (mouse cursor) for direct manipulation.

**Historical context:** The dominant computer interaction paradigm from 1984 (Mac) through ~2007. Every major OS — Mac, Windows 3.1 through XP, classic Amiga, GNOME, KDE — is built on WIMP.

**Why declined / evolved:** WIMP assumes a pointer (mouse/trackpad) and windows. Touch devices (iPhone 2007, iPad 2010) require new paradigms: no hover, no pointer, no window management. Voice interfaces, gesture systems, and immersive XR environments all move beyond WIMP. Beaudouin-Lafon's 2000 CHI paper "Instrumental Interaction" explicitly addresses this transition with a new model for post-WIMP interfaces. WIMP hasn't disappeared (desktop OSes still use it) but it's no longer the universal paradigm.

**Sources:** [Beaudouin-Lafon (2000) — #9](index.md#9-instrumental-interaction-an-interaction-model-for-designing-post-wimp-user-interfaces), [Mandel Encyclopedia — #31](index.md#31-usersystem-interface-design-encyclopedia-entry)

---

## Sources

All citations below link to entries in [index.md](index.md).

| # | Paper | Contribution to This Document |
|---|-------|-------------------------------|
| [#2](index.md#2-the-evolution-of-design-patterns-in-hci-from-pattern-languages-to-pattern-oriented-design) | Seffah (2010) — Evolution of Design Patterns in HCI | Pattern evolution arc; shortcomings of early pattern languages |
| [#8](index.md#8-designing-interfaces) | Tidwell (2005/2011) — Designing Interfaces | Primary source: 125-pattern master catalog |
| [#9](index.md#9-instrumental-interaction-an-interaction-model-for-designing-post-wimp-user-interfaces) | Beaudouin-Lafon (2000) — Instrumental Interaction | WIMP → post-WIMP transition; interaction model |
| [#12](index.md#12-usability-studies-on-mobile-user-interface-design-patterns-a-systematic-literature-review) | Punchoojit (2017) — Mobile UI Design Patterns SLR | Mobile pattern taxonomy; touch-era patterns |
| [#13](index.md#13-beautiful-interfaces-from-user-experience-to-user-interface-design) | Bollini (2017) — Beautiful Interfaces | Skeuomorphism, flat design, design trend evolution |
| [#21](index.md#21-scaling-computer-use-grounding-via-user-interface-decomposition-and-synthesis) | NeurIPS 2025 — GUI Grounding via UI Decomposition | AI agent interface; GUI grounding benchmark |
| [#26](index.md#26-tracing-the-evolution-of-hci-patterns-as-an-interaction-design-tool) | Seffah & Taleb (2012) — Tracing HCI Patterns | Historical arc from individual patterns to pattern-oriented design |
| [#28](index.md#28-user-interface-design-book-chapter) | Stefaner et al. (2009) — User Interface Design | Faceted search, information retrieval UI paradigms |
| [#30](index.md#30-survey-on-user-interface-design-and-interactions-for-generative-ai-applications) | GenAI Survey (2025) | Primary source for all AI & Agent Interface Patterns (section 9) |
| [#31](index.md#31-usersystem-interface-design-encyclopedia-entry) | Mandel (2002) — Encyclopedia | CLI→GUI→web history; WIMP; frames; early web patterns |
| [#34](index.md#34-patterns-of-mobile-interaction-copy-1) | Roth (2002) — Patterns of Mobile Interaction | PDA-era mobility patterns; synchronisation pattern |
| [#36](index.md#36-design-patterns-for-user-interface-for-mobile-applications-copy-1) | Nilsson (2009) — Mobile UI Design Patterns | Mobile input patterns; screen space; stylus patterns |
| [#38](index.md#38-using-design-patterns-in-user-interface-design) | Chase (2012) — Using Design Patterns in UI Design | Pattern attribute standardization; Facebook case study |
| **van Welie** | Welie.com pattern collection (131 patterns) | Navigation taxonomy; search patterns; social patterns |
| **van Duyne** | van Duyne et al. collection (107 patterns) | E-commerce patterns; trust patterns; search patterns |

---

*Generated 2026-06-27. Cross-reference with [index.md](index.md) for full paper metadata.*
