
  Fully complete (Core + CSS + React + Story — 11 components):
  Accordion, Combobox, FileUpload, Form, Modal, Popover, Select, Tabs, Toast,
  Toggle, Tooltip
  
  CSS built, no React/Story (tier-1 static components — ~30):
  Alert, Avatar, Badge, Breadcrumbs, Button-group, Card, Checkbox, Color-picker,
  Date-input, Empty-state, Fieldset, Footer, Header, Heading, Hero, Label, Link,
  List, Progress-bar, Quote, Radio-button, Search-input, Separator, Skeleton,
  Skip-link, Slider, Spinner, Table, Text-input, Textarea

  Spec exists but nothing built yet (~12 components):
  Carousel, Datepicker, Drawer, Dropdown-menu, Navigation, Pagination,
  Progress-indicator, Rating, Rich-text-editor, Segmented-control, Stepper,
  Tree-view

  ---
  The three natural next directions:

  1. Interactive components with new Core machines (highest product value)
  - Drawer — slide-in panel, shares a lot with Modal (focus trap, backdrop, body
  scroll lock) but anchored to an edge. Would follow the same machine-first
  pattern.
  - Dropdown Menu — context/action menu triggered by a button. Floating UI
  positioned, keyboard navigation, supports submenus. Reuses the
  createCombobox/createSelect floating pattern.
  - Datepicker — most complex remaining: calendar grid, month navigation, keyboard
  date entry. Could be scoped to just a date-range input + calendar popover.

  2. React wrappers for tier-1 components (fills out the React package)
  - Checkbox, Radio-button, Text-input, Textarea, Search-input, Slider — these are
  structurally simple but give React consumers typed, composable form primitives.

  3. Storybook coverage for CSS-only components (discoverability/docs)
  - Add stories for the ~30 existing CSS components so the classless layer is fully
  demoed alongside the React layer.

  My recommendation: Drawer next. It's high-value, the machine pattern is
  well-established in this codebase (mirrors Modal), and a slide-in panel is one of
  the most-reached-for UI primitives in any app. After that, Dropdown Menu
  naturally follows since both are positioned overlays.

  What direction do you want to go?