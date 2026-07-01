
  Fully complete (Core + CSS + React + Story — 14 components):
  Accordion, Combobox, Datepicker, Drawer, Dropdown-menu, FileUpload, Form,
  Modal, Popover, Select, Tabs, Toast, Toggle, Tooltip
  
  CSS built, no React/Story (tier-1 static components — ~30):
  Alert, Avatar, Badge, Breadcrumbs, Button-group, Card, Checkbox, Color-picker,
  Date-input, Empty-state, Fieldset, Footer, Header, Heading, Hero, Label, Link,
  List, Progress-bar, Quote, Radio-button, Search-input, Separator, Skeleton,
  Skip-link, Slider, Spinner, Table, Text-input, Textarea

  Spec exists but nothing built yet (~9 components):
  Carousel, Navigation, Pagination, Progress-indicator, Rating,
  Rich-text-editor, Segmented-control, Stepper, Tree-view

  ---
  The three natural next directions:

  1. Interactive components with new Core machines (highest product value)
  - Navigation — disclosure navigation with submenu state, outside click close,
  and mobile menu support.
  - Pagination — page navigation machine with current-page state, bounds handling,
  and compact page ranges.
  - Segmented Control — radio/tab-like single selection with roving keyboard
  navigation and a straightforward machine.

  2. React wrappers for tier-1 components (fills out the React package)
  - Checkbox, Radio-button, Text-input, Textarea, Search-input, Slider — these are
  structurally simple but give React consumers typed, composable form primitives.

  3. Storybook coverage for CSS-only components (discoverability/docs)
  - Add stories for the ~30 existing CSS components so the classless layer is fully
  demoed alongside the React layer.

  My recommendation: Navigation next. It builds on the disclosure/menu keyboard
  work already present in Dropdown Menu, fills an important app-shell primitive,
  and complements the existing Header/Footer CSS components.

  What direction do you want to go?
