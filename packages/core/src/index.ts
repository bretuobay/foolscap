// Utils
export { createId } from './utils/id'
export { dispatch } from './utils/events'
export { createFocusTrap } from './utils/focus-trap'
export { createRovingTabindex } from './utils/roving-tabindex'
export {
  isArrowUp,
  isArrowDown,
  isArrowLeft,
  isArrowRight,
  isEnter,
  isEscape,
  isSpace,
  isTab,
  isShiftTab,
  isHome,
  isEnd,
  isPageUp,
  isPageDown,
  getNextIndex,
  getPrevIndex,
  getIndexByTypeahead,
} from './utils/keyboard'

// Tier 2
export { createAccordion } from './tier2/accordion'
export { createPopover } from './tier2/popover'
export { createFileUpload } from './tier2/file-upload'
export { createToggle } from './tier2/toggle'
export { createForm } from './tier2/form'

// Tier 3 (modal replaces tier2 version)
export { createModal } from './tier3/modal'
export { createTabs } from './tier3/tabs'
export { createToaster } from './tier3/toast'
export { createTooltip } from './tier3/tooltip'
export { createSelect } from './tier3/select'
export { createCombobox } from './tier3/combobox'
export { createDrawer } from './tier3/drawer'
export { createDropdownMenu } from './tier3/dropdown-menu'
export { createDatepicker } from './tier3/datepicker'
export { createNavigation } from './tier3/navigation'

// Types — Tier 2
export type { AccordionOptions, AccordionState, AccordionItem, Accordion } from './tier2/accordion'
export type { PopoverOptions, PopoverState, Popover } from './tier2/popover'
export type {
  FileUploadOptions,
  FileUploadState,
  FileUploadError,
  FileUpload,
} from './tier2/file-upload'
export type { ToggleOptions, ToggleState, Toggle } from './tier2/toggle'
export type { FormOptions, FormState, Form, FieldConfig } from './tier2/form'

// Types — Tier 3
export type { ModalOptions, ModalState, Modal } from './tier3/modal'
export type { TabsOptions, TabsState, Tabs } from './tier3/tabs'
export type { ToastOptions, ToasterState, Toaster, Toast } from './tier3/toast'
export type { TooltipOptions, TooltipState, Tooltip } from './tier3/tooltip'
export type { SelectOptions, SelectState, Select, SelectOption } from './tier3/select'
export type { ComboboxOptions, ComboboxState, Combobox } from './tier3/combobox'
export type { DrawerOptions, DrawerState, Drawer, DrawerSide } from './tier3/drawer'
export type {
  DropdownMenuOptions,
  DropdownMenuState,
  DropdownMenu,
  DropdownMenuItem,
} from './tier3/dropdown-menu'
export type {
  DatepickerOptions,
  DatepickerState,
  Datepicker,
  DatepickerFirstDayOfWeek,
} from './tier3/datepicker'
export type {
  NavigationOptions,
  NavigationState,
  Navigation,
  NavigationItem,
  NavigationChildItem,
} from './tier3/navigation'

// Utility types
export type { FocusTrap } from './utils/focus-trap'
export type { RovingTabindex } from './utils/roving-tabindex'
