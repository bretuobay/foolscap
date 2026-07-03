
  Fully complete (Core + CSS + React + Story — 21 components):
  Accordion, Combobox, Datepicker, Drawer, Dropdown-menu, FileUpload, Form,
  Modal, Navigation, Pagination, Popover, Progress-indicator, Rating,
  Segmented-control, Select, Stepper, Tabs, Toast, Toggle, Tooltip, Tree-view
  
  CSS built, no React/Story (tier-1 static components — ~30):
  Alert, Avatar, Badge, Breadcrumbs, Button-group, Card, Checkbox, Color-picker,
  Date-input, Empty-state, Fieldset, Footer, Header, Heading, Hero, Label, Link,
  List, Progress-bar, Quote, Radio-button, Search-input, Separator, Skeleton,
  Skip-link, Slider, Spinner, Table, Text-input, Textarea

  Spec exists but nothing built yet (~2 components):
  Carousel, Rich-text-editor

  ---
  The three natural next directions:

  1. Interactive components with new Core machines (highest product value)
  - Carousel — grouped slides with previous/next controls, pagination, and
  keyboard behavior.
  - Rich Text Editor — editable document surface with formatting commands and
  content serialization.

  2. React wrappers for tier-1 components (fills out the React package)
  - Checkbox, Radio-button, Text-input, Textarea, Search-input, Slider — these are
  structurally simple but give React consumers typed, composable form primitives.

  3. Storybook coverage for CSS-only components (discoverability/docs)
  - Add stories for the ~30 existing CSS components so the classless layer is fully
  demoed alongside the React layer.

  My recommendation: Carousel next. It is smaller and more bounded than Rich Text
  Editor while still adding a useful interactive primitive.

  What direction do you want to go?
