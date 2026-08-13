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
  createNavigation,
  type Navigation as NavigationMachine,
  type NavigationItem,
} from '@web-loom/foolscap-core'
import { useMachine } from '../composables/useMachine'
import { cx } from '../utils/cx'

export type { NavigationItem }

interface NavigationContextValue {
  machine: NavigationMachine
  items: { value: NavigationItem[] }
  injectTriggerEl: (index: number, el: HTMLButtonElement | null) => void
  injectSubmenuLinkEl: (parentIndex: number, childIndex: number, el: HTMLAnchorElement | null) => void
}

const NavigationKey: InjectionKey<NavigationContextValue> = Symbol('fc-navigation')

function useNavigationContext(): NavigationContextValue {
  const ctx = inject(NavigationKey, null)
  if (!ctx) throw new Error('Navigation components must be used inside NavigationRoot')
  return ctx
}

export interface NavigationRootProps {
  items: NavigationItem[]
  label?: string
  orientation?: 'horizontal' | 'vertical'
}

export const NavigationRoot = defineComponent({
  name: 'FcNavigationRoot',
  inheritAttrs: false,
  props: {
    items: { type: Array as PropType<NavigationItem[]>, required: true },
    label: { type: String, default: 'Main navigation' },
    orientation: { type: String as PropType<NavigationRootProps['orientation']>, default: 'horizontal' },
  },
  emits: ['toggle', 'mobileToggle'],
  setup(props, { slots, attrs, emit }) {
    const machine = useMachine(() =>
      createNavigation({
        get items() {
          return props.items
        },
        get label() {
          return props.label
        },
        get orientation() {
          return props.orientation
        },
        onToggle: (detail) => emit('toggle', detail),
        onMobileToggle: (detail) => emit('mobileToggle', detail),
      }),
    )

    provide(NavigationKey, {
      machine,
      items: {
        get value() {
          return props.items
        },
      },
      injectTriggerEl: (index, el) => machine.setTriggerEl(index, el),
      injectSubmenuLinkEl: (parentIndex, childIndex, el) =>
        machine.setSubmenuLinkEl(parentIndex, childIndex, el),
    })

    return () => {
      const rootProps = machine.getRootProps()
      const { class: className, ...rest } = attrs

      return h(
        'nav',
        {
          ...rest,
          ref: (el: unknown) => machine.setRootEl(el instanceof HTMLElement ? el : null),
          'aria-label': rootProps['aria-label'],
          'data-state': rootProps['data-state'],
          'data-orientation': rootProps['data-orientation'],
          class: cx('fc-navigation', className as string | undefined),
        },
        slots.default?.() ?? [h(NavigationToggle), h(NavigationList)],
      )
    }
  },
})

export const NavigationToggle = defineComponent({
  name: 'FcNavigationToggle',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const { machine } = useNavigationContext()
    const buttonEl = ref<HTMLButtonElement | null>(null)

    function handleKeyDown(event: KeyboardEvent) {
      const { onKeyDown } = attrs
      if (typeof onKeyDown === 'function') onKeyDown(event)
      if (!event.defaultPrevented) machine.getToggleProps().onKeyDown(event)
    }

    onMounted(() => {
      buttonEl.value?.addEventListener('keydown', handleKeyDown)
    })
    onBeforeUnmount(() => {
      buttonEl.value?.removeEventListener('keydown', handleKeyDown)
    })

    return () => {
      void machine.state
      const toggleProps = machine.getToggleProps()
      const { class: className, onClick, 'aria-label': ariaLabel, ...rest } = attrs

      return h(
        'button',
        {
          ...rest,
          ref: buttonEl,
          type: toggleProps.type,
          'aria-expanded': toggleProps['aria-expanded'],
          'aria-controls': toggleProps['aria-controls'],
          'aria-label': (ariaLabel as string | undefined) ?? toggleProps['aria-label'],
          onClick: (event: Event) => {
            if (typeof onClick === 'function') onClick(event)
            if (!event.defaultPrevented) toggleProps.onClick()
          },
          class: cx('fc-navigation__toggle', className as string | undefined),
        },
        slots.default?.() ?? [h('span', { class: 'fc-navigation__icon', 'aria-hidden': 'true' }, '☰')],
      )
    }
  },
})

export const NavigationList = defineComponent({
  name: 'FcNavigationList',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const { machine, items, injectTriggerEl, injectSubmenuLinkEl } = useNavigationContext()

    return () => {
      void machine.state
      const listProps = machine.getListProps()

      return h(
        'ul',
        {
          ...attrs,
          id: listProps.id,
          hidden: listProps.hidden ? true : undefined,
          class: cx('fc-navigation__list', attrs.class as string | undefined),
        },
        items.value.map((item, index) =>
          h(NavigationItemView, {
            key: `${item.label}-${item.href ?? index}`,
            item,
            index,
            machine,
            injectTriggerEl,
            injectSubmenuLinkEl,
          }),
        ),
      )
    }
  },
})

const NavigationItemView = defineComponent({
  name: 'FcNavigationItemView',
  props: {
    item: { type: Object as PropType<NavigationItem>, required: true },
    index: { type: Number, required: true },
    machine: { type: Object as PropType<NavigationMachine>, required: true },
    injectTriggerEl: {
      type: Function as PropType<(index: number, el: HTMLButtonElement | null) => void>,
      required: true,
    },
    injectSubmenuLinkEl: {
      type: Function as PropType<
        (parentIndex: number, childIndex: number, el: HTMLAnchorElement | null) => void
      >,
      required: true,
    },
  },
  setup(props) {
    return () => {
      void props.machine.state
      const itemProps = props.machine.getItemProps(props.index)
      const hasChildren = Boolean(props.item.children?.length)

      return h('li', { class: 'fc-navigation__item', 'data-state': itemProps['data-state'] }, [
        hasChildren
          ? [
              h(NavigationTriggerView, {
                item: props.item,
                index: props.index,
                machine: props.machine,
                injectTriggerEl: props.injectTriggerEl,
              }),
              h(NavigationSubmenuView, {
                item: props.item,
                index: props.index,
                machine: props.machine,
                injectSubmenuLinkEl: props.injectSubmenuLinkEl,
              }),
            ]
          : h(NavigationLinkView, { item: props.item, index: props.index, machine: props.machine }),
      ])
    }
  },
})

const NavigationLinkView = defineComponent({
  name: 'FcNavigationLinkView',
  props: {
    item: { type: Object as PropType<NavigationItem>, required: true },
    index: { type: Number, required: true },
    machine: { type: Object as PropType<NavigationMachine>, required: true },
  },
  setup(props) {
    return () => {
      const linkProps = props.machine.getLinkProps(props.index)
      return h(
        'a',
        {
          class: 'fc-navigation__link',
          href: linkProps.href,
          'aria-current': linkProps['aria-current'],
        },
        props.item.label,
      )
    }
  },
})

const NavigationTriggerView = defineComponent({
  name: 'FcNavigationTriggerView',
  props: {
    item: { type: Object as PropType<NavigationItem>, required: true },
    index: { type: Number, required: true },
    machine: { type: Object as PropType<NavigationMachine>, required: true },
    injectTriggerEl: {
      type: Function as PropType<(index: number, el: HTMLButtonElement | null) => void>,
      required: true,
    },
  },
  setup(props) {
    const buttonEl = ref<HTMLButtonElement | null>(null)

    function handleKeyDown(event: KeyboardEvent) {
      props.machine.getTriggerProps(props.index).onKeyDown(event)
    }

    onMounted(() => {
      buttonEl.value?.addEventListener('keydown', handleKeyDown)
    })
    onBeforeUnmount(() => {
      buttonEl.value?.removeEventListener('keydown', handleKeyDown)
    })

    return () => {
      void props.machine.state
      const triggerProps = props.machine.getTriggerProps(props.index)
      return h(
        'button',
        {
          ref: (el: unknown) => {
            const node = el instanceof HTMLButtonElement ? el : null
            buttonEl.value = node
            props.injectTriggerEl(props.index, node)
          },
          type: triggerProps.type,
          'aria-expanded': triggerProps['aria-expanded'],
          'aria-controls': triggerProps['aria-controls'],
          onClick: triggerProps.onClick,
          class: 'fc-navigation__trigger',
        },
        [
          props.item.label,
          h('span', { class: 'fc-navigation__trigger-icon', 'aria-hidden': 'true' }, '▾'),
        ],
      )
    }
  },
})

const NavigationSubmenuView = defineComponent({
  name: 'FcNavigationSubmenuView',
  props: {
    item: { type: Object as PropType<NavigationItem>, required: true },
    index: { type: Number, required: true },
    machine: { type: Object as PropType<NavigationMachine>, required: true },
    injectSubmenuLinkEl: {
      type: Function as PropType<
        (parentIndex: number, childIndex: number, el: HTMLAnchorElement | null) => void
      >,
      required: true,
    },
  },
  setup(props) {
    const submenuEl = ref<HTMLUListElement | null>(null)

    function handleKeyDown(event: KeyboardEvent) {
      props.machine.getSubmenuProps(props.index).onKeyDown(event)
    }

    onMounted(() => {
      submenuEl.value?.addEventListener('keydown', handleKeyDown)
    })
    onBeforeUnmount(() => {
      submenuEl.value?.removeEventListener('keydown', handleKeyDown)
    })

    return () => {
      void props.machine.state
      const submenuProps = props.machine.getSubmenuProps(props.index)
      return h(
        'ul',
        {
          ref: submenuEl,
          id: submenuProps.id,
          hidden: submenuProps.hidden,
          class: 'fc-navigation__submenu',
        },
        props.item.children?.map((child, childIndex) => {
          const linkProps = props.machine.getSubmenuLinkProps(props.index, childIndex)
          return h('li', { class: 'fc-navigation__submenu-item', key: `${child.label}-${child.href}` }, [
            h(
              'a',
              {
                href: linkProps.href,
                'aria-current': linkProps['aria-current'],
                onKeydown: (event: KeyboardEvent) => linkProps.onKeyDown(event),
                ref: (el: unknown) =>
                  props.injectSubmenuLinkEl(
                    props.index,
                    childIndex,
                    el instanceof HTMLAnchorElement ? el : null,
                  ),
                class: 'fc-navigation__submenu-link',
              },
              child.label,
            ),
          ])
        }),
      )
    }
  },
})
