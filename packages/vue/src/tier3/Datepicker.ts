import {
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  type InjectionKey,
  type PropType,
} from 'vue'
import {
  createDatepicker,
  type Datepicker as DatepickerMachine,
  type DatepickerFirstDayOfWeek,
} from '@web-loom/foolscap-core'
import { useMachine } from '../composables/useMachine'
import { cx } from '../utils/cx'

interface DatepickerContextValue {
  machine: DatepickerMachine
  locale: { value: string }
  firstDayOfWeek: DatepickerFirstDayOfWeek
  placeholder: { value: string }
  injectTriggerEl: (el: HTMLButtonElement | null) => void
  injectDialogEl: (el: HTMLDivElement | null) => void
  injectDayEl: (date: Date, el: HTMLButtonElement | null) => void
}

const DatepickerKey: InjectionKey<DatepickerContextValue> = Symbol('fc-datepicker')

function useDatepickerContext(): DatepickerContextValue {
  const ctx = inject(DatepickerKey, null)
  if (!ctx) throw new Error('Datepicker components must be used inside DatepickerRoot')
  return ctx
}

function formatDate(date: Date | null, locale: string, placeholder: string): string {
  if (!date) return placeholder
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function formatMonth(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date)
}

function weekdayLabels(locale: string, firstDayOfWeek: DatepickerFirstDayOfWeek) {
  const sunday = new Date(2026, 5, 7)
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sunday)
    date.setDate(sunday.getDate() + firstDayOfWeek + index)
    return {
      short: new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date),
      long: new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date),
    }
  })
}

export interface DatepickerRootProps {
  value?: Date | null
  defaultValue?: Date
  min?: Date
  max?: Date
  locale?: string
  firstDayOfWeek?: DatepickerFirstDayOfWeek
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  placeholder?: string
}

export const DatepickerRoot = defineComponent({
  name: 'FcDatepickerRoot',
  inheritAttrs: false,
  props: {
    value: { type: Date as PropType<Date | null>, default: undefined },
    modelValue: { type: Date as PropType<Date | null>, default: undefined },
    defaultValue: { type: Date as PropType<Date | undefined>, default: undefined },
    min: { type: Date as PropType<Date | undefined>, default: undefined },
    max: { type: Date as PropType<Date | undefined>, default: undefined },
    locale: { type: String, default: 'en' },
    firstDayOfWeek: { type: Number as PropType<DatepickerFirstDayOfWeek>, default: 0 },
    placement: { type: String as PropType<DatepickerRootProps['placement']>, default: undefined },
    placeholder: { type: String, default: 'Pick a date' },
  },
  emits: ['valueChange', 'openChange', 'update:modelValue'],
  setup(props, { slots, attrs, emit }) {
    const defaultValue = props.defaultValue
    const firstDayOfWeek = props.firstDayOfWeek
    const machine = useMachine(() =>
      createDatepicker({
        get value() {
          return props.modelValue !== undefined ? props.modelValue : props.value
        },
        defaultValue,
        get min() {
          return props.min
        },
        get max() {
          return props.max
        },
        get locale() {
          return props.locale
        },
        firstDayOfWeek,
        get placement() {
          return props.placement
        },
        onValueChange: (date) => {
          emit('update:modelValue', date)
          emit('valueChange', date)
        },
        onOpenChange: (open) => emit('openChange', open),
      }),
    )

    provide(DatepickerKey, {
      machine,
      locale: {
        get value() {
          return props.locale
        },
      },
      firstDayOfWeek,
      placeholder: {
        get value() {
          return props.placeholder
        },
      },
      injectTriggerEl: (el) => machine.setTriggerEl(el),
      injectDialogEl: (el) => machine.setDialogEl(el),
      injectDayEl: (date, el) => machine.setDayEl(date, el),
    })

    return () =>
      h(
        'div',
        {
          class: cx('fc-datepicker', attrs.class as string | undefined),
          'data-state': machine.state.isOpen ? 'open' : 'closed',
        },
        slots.default?.(),
      )
  },
})

export const DatepickerTrigger = defineComponent({
  name: 'FcDatepickerTrigger',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const { machine, locale, placeholder, injectTriggerEl } = useDatepickerContext()
    const buttonEl = ref<HTMLButtonElement | null>(null)

    function handleKeyDown(event: KeyboardEvent) {
      const { onKeyDown } = attrs
      if (typeof onKeyDown === 'function') onKeyDown(event)
      if (!event.defaultPrevented) machine.getTriggerProps().onKeyDown(event)
    }

    onMounted(() => {
      buttonEl.value?.addEventListener('keydown', handleKeyDown)
    })
    onBeforeUnmount(() => {
      buttonEl.value?.removeEventListener('keydown', handleKeyDown)
    })

    return () => {
      void machine.state
      const triggerProps = machine.getTriggerProps()
      const { class: className, onClick, ...rest } = attrs
      const label = slots.default?.() ?? formatDate(machine.state.selectedDate, locale.value, placeholder.value)

      return h(
        'button',
        {
          ...rest,
          ref: (el: unknown) => {
            const node = el instanceof HTMLButtonElement ? el : null
            buttonEl.value = node
            injectTriggerEl(node)
          },
          type: 'button',
          'aria-haspopup': triggerProps['aria-haspopup'],
          'aria-expanded': triggerProps['aria-expanded'],
          'aria-controls': triggerProps['aria-controls'],
          onClick: (event: Event) => {
            if (typeof onClick === 'function') onClick(event)
            if (!event.defaultPrevented) triggerProps.onClick()
          },
          class: cx('fc-datepicker__trigger', className as string | undefined),
        },
        label,
      )
    }
  },
})

export const DatepickerDialog = defineComponent({
  name: 'FcDatepickerDialog',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const { machine, locale, firstDayOfWeek, injectDialogEl, injectDayEl } = useDatepickerContext()
    const dialogEl = ref<HTMLDivElement | null>(null)

    function handleKeyDown(event: KeyboardEvent) {
      machine.getDialogProps().onKeyDown(event)
    }

    onMounted(() => {
      dialogEl.value?.addEventListener('keydown', handleKeyDown)
    })
    onBeforeUnmount(() => {
      dialogEl.value?.removeEventListener('keydown', handleKeyDown)
    })

    return () => {
      const state = machine.state
      const dialogProps = machine.getDialogProps()
      const gridProps = machine.getGridProps()
      const labels = weekdayLabels(locale.value, firstDayOfWeek)
      const month = formatMonth(new Date(state.viewYear, state.viewMonth, 1), locale.value)
      const { class: className, style, ...rest } = attrs
      const incomingStyle = typeof style === 'object' && style ? { ...style } : {}
      delete (incomingStyle as { display?: string }).display
      const prevMonthProps = machine.getPrevMonthProps()
      const nextMonthProps = machine.getNextMonthProps()
      const monthLabelProps = machine.getMonthLabelProps()

      return h(
        'div',
        {
          ...rest,
          ref: (el: unknown) => {
            const node = el instanceof HTMLDivElement ? el : null
            dialogEl.value = node
            injectDialogEl(node)
          },
          id: dialogProps.id,
          role: dialogProps.role,
          'aria-label': dialogProps['aria-label'],
          'aria-modal': dialogProps['aria-modal'],
          hidden: dialogProps.hidden,
          style: incomingStyle,
          class: cx('fc-datepicker__dialog', className as string | undefined),
        },
        [
          h('div', { class: 'fc-datepicker__header' }, [
            h('button', { class: 'fc-datepicker__prev-month', ...prevMonthProps }, '‹'),
            h('span', { class: 'fc-datepicker__month-label', ...monthLabelProps }, month),
            h('button', { class: 'fc-datepicker__next-month', ...nextMonthProps }, '›'),
          ]),
          h('table', { class: 'fc-datepicker__grid', role: gridProps.role, 'aria-label': gridProps['aria-label'] }, [
            h('thead', { class: 'fc-datepicker__grid-head' }, [
              h(
                'tr',
                null,
                labels.map((label) => h('th', { key: label.long, scope: 'col', abbr: label.long }, label.short)),
              ),
            ]),
            h(
              'tbody',
              { class: 'fc-datepicker__grid-body' },
              state.weeks.map((week, row) =>
                h(
                  'tr',
                  { key: row },
                  week.map((date, col) =>
                    h(
                      'td',
                      {
                        key: `${row}-${col}`,
                        class: 'fc-datepicker__gridcell',
                        role: 'gridcell',
                        'data-state': date ? undefined : 'outside-month',
                      },
                      date
                        ? [
                            h(DatepickerDay, {
                              date,
                              machine,
                              injectDayEl,
                            }),
                          ]
                        : [],
                    ),
                  ),
                ),
              ),
            ),
          ]),
        ],
      )
    }
  },
})

const DatepickerDay = defineComponent({
  name: 'FcDatepickerDay',
  props: {
    date: { type: Date, required: true },
    machine: { type: Object as PropType<DatepickerMachine>, required: true },
    injectDayEl: {
      type: Function as PropType<(date: Date, el: HTMLButtonElement | null) => void>,
      required: true,
    },
  },
  setup(props) {
    const buttonEl = ref<HTMLButtonElement | null>(null)

    function handleKeyDown(event: KeyboardEvent) {
      props.machine.getDayProps(props.date).onKeyDown(event)
    }

    onMounted(() => {
      buttonEl.value?.addEventListener('keydown', handleKeyDown)
    })
    onBeforeUnmount(() => {
      buttonEl.value?.removeEventListener('keydown', handleKeyDown)
    })

    return () => {
      const dayProps = props.machine.getDayProps(props.date)
      return h(
        'button',
        {
          ref: (el: unknown) => {
            const node = el instanceof HTMLButtonElement ? el : null
            buttonEl.value = node
            props.injectDayEl(props.date, node)
          },
          type: dayProps.type,
          'aria-label': dayProps['aria-label'],
          'aria-selected': dayProps['aria-selected'],
          'aria-current': dayProps['aria-current'],
          disabled: dayProps.disabled,
          tabIndex: dayProps.tabIndex,
          onClick: dayProps.onClick,
          class: 'fc-datepicker__day',
        },
        props.date.getDate(),
      )
    }
  },
})
