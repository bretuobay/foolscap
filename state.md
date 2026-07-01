
  Fully complete (Core + CSS + React + Story — 15 components):
  Accordion, Combobox, Datepicker, Drawer, Dropdown-menu, FileUpload, Form,
  Modal, Navigation, Popover, Select, Tabs, Toast, Toggle, Tooltip
  
  CSS built, no React/Story (tier-1 static components — ~30):
  Alert, Avatar, Badge, Breadcrumbs, Button-group, Card, Checkbox, Color-picker,
  Date-input, Empty-state, Fieldset, Footer, Header, Heading, Hero, Label, Link,
  List, Progress-bar, Quote, Radio-button, Search-input, Separator, Skeleton,
  Skip-link, Slider, Spinner, Table, Text-input, Textarea

  Spec exists but nothing built yet (~8 components):
  Carousel, Pagination, Progress-indicator, Rating, Rich-text-editor,
  Segmented-control, Stepper, Tree-view

  ---
  The three natural next directions:

  1. Interactive components with new Core machines (highest product value)
  - Pagination — page navigation machine with current-page state, bounds handling,
  and compact page ranges.
  - Segmented Control — radio/tab-like single selection with roving keyboard
  navigation and a straightforward machine.
  - Rating — accessible star/radio selection with read-only display support.

  2. React wrappers for tier-1 components (fills out the React package)
  - Checkbox, Radio-button, Text-input, Textarea, Search-input, Slider — these are
  structurally simple but give React consumers typed, composable form primitives.

  3. Storybook coverage for CSS-only components (discoverability/docs)
  - Add stories for the ~30 existing CSS components so the classless layer is fully
  demoed alongside the React layer.

  My recommendation: Pagination next. It is broadly useful, smaller than the
  remaining media/editor/tree primitives, and should fit the current
  machine-first Core + CSS + React + Story pattern cleanly.

  What direction do you want to go?
