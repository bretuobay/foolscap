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
  type VNode,
} from 'vue'
import {
  createDropdownMenu,
  type DropdownMenu as DropdownMenuMachine,
  type DropdownMenuItem,
} from '@web-loom/foolscap-core'
import { useMachine } from '../composables/useMachine'
import { cx } from '../utils/cx'

export type { DropdownMenuItem }

interface DropdownMenuContextValue {
  machine: DropdownMenuMachine
  items: { value: DropdownMenuItem[] }
  injectTriggerEl: (el: HTMLButtonElement | null) => void
  injectMenuEl: (el: HTMLUListElement | null) => void
  injectItemEl: (index: number, el: HTMLLIElement | null) => void
}

const DropdownMenuKey: InjectionKey<DropdownMenuContextValue> = Symbol('fc-dropdown-menu')

function useDropdownMenuContext(): DropdownMenuContextValue {
  const ctx = inject(DropdownMenuKey, null)
  if (!ctx) {
    throw new Error('DropdownMenuTrigger and DropdownMenuContent must be used inside DropdownMenuRoot')
  }
  return ctx
}

export interface DropdownMenuRootProps {
  items: DropdownMenuItem[]
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
}

export const DropdownMenuRoot = defineComponent({
  name: 'FcDropdownMenuRoot',
  inheritAttrs: false,
  props: {
    items: { type: Array as PropType<DropdownMenuItem[]>, required: true },
    placement: { type: String as PropType<DropdownMenuRootProps['placement']>, default: undefined },
  },
  emits: ['select', 'openChange'],
  setup(props, { slots, attrs, emit }) {
    const machine = useMachine(() =>
      createDropdownMenu({
        get items() {
          return props.items
        },
        get placement() {
          return props.placement
        },
        onSelect: (item) => emit('select', item),
        onOpenChange: (open) => emit('openChange', open),
      }),
    )

    provide(DropdownMenuKey, {
      machine,
      items: {
        get value() {
          return props.items
        },
      },
      injectTriggerEl: (el) => machine.setTriggerEl(el),
      injectMenuEl: (el) => machine.setMenuEl(el),
      injectItemEl: (index, el) => machine.setItemEl(index, el),
    })

    return () =>
      h(
        'div',
        {
          class: cx('fc-dropdown-menu', attrs.class as string | undefined),
          'data-state': machine.state.isOpen ? 'open' : 'closed',
        },
        slots.default?.(),
      )
  },
})

export const DropdownMenuTrigger = defineComponent({
  name: 'FcDropdownMenuTrigger',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const { machine, injectTriggerEl } = useDropdownMenuContext()
    const buttonEl = ref<HTMLButtonElement | null>(null)

    function setTriggerEl(el: unknown) {
      const node = el instanceof HTMLButtonElement ? el : null
      buttonEl.value = node
      injectTriggerEl(node)
    }

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
      const { class: className, onClick, onKeyDown: _onKeyDown, ...rest } = attrs

      return h(
        'button',
        {
          ...rest,
          ref: setTriggerEl,
          type: 'button',
          'aria-haspopup': triggerProps['aria-haspopup'],
          'aria-expanded': triggerProps['aria-expanded'],
          'aria-controls': triggerProps['aria-controls'],
          onClick: (event: Event) => {
            if (typeof onClick === 'function') onClick(event)
            if (!event.defaultPrevented) triggerProps.onClick()
          },
          class: cx('fc-dropdown-menu__trigger', className as string | undefined),
        },
        slots.default?.(),
      )
    }
  },
})

export const DropdownMenuContent = defineComponent({
  name: 'FcDropdownMenuContent',
  inheritAttrs: false,
  props: {
    renderItem: { type: Function as PropType<(item: DropdownMenuItem) => VNode | string>, default: undefined },
    renderIcon: { type: Function as PropType<(item: DropdownMenuItem) => VNode | string | null>, default: undefined },
  },
  setup(props, { attrs }) {
    const { machine, items, injectMenuEl, injectItemEl } = useDropdownMenuContext()
    const menuEl = ref<HTMLUListElement | null>(null)

    function setMenuEl(el: unknown) {
      const node = el instanceof HTMLUListElement ? el : null
      menuEl.value = node
      injectMenuEl(node)
    }

    function handleKeyDown(event: KeyboardEvent) {
      machine.getMenuProps().onKeyDown(event)
    }

    onMounted(() => {
      menuEl.value?.addEventListener('keydown', handleKeyDown)
    })
    onBeforeUnmount(() => {
      menuEl.value?.removeEventListener('keydown', handleKeyDown)
    })

    return () => {
      void machine.state
      const menuProps = machine.getMenuProps()
      const { class: className, style, ...rest } = attrs
      const incomingStyle = typeof style === 'object' && style ? { ...style } : {}
      delete (incomingStyle as { display?: string }).display

      return h(
        'ul',
        {
          ...rest,
          ref: setMenuEl,
          id: menuProps.id,
          role: menuProps.role,
          hidden: menuProps.hidden,
          style: incomingStyle,
          class: cx('fc-dropdown-menu__menu', className as string | undefined),
        },
        items.value.map((item, index) => {
          if (item.separator) {
            return h(DropdownMenuSeparator, { key: `${item.value}-${index}` })
          }

          const itemProps = machine.getItemProps(index)
          const icon = props.renderIcon?.(item)

          return h(
            'li',
            {
              key: item.value,
              ref: (el: unknown) => injectItemEl(index, el instanceof HTMLLIElement ? el : null),
              id: itemProps.id,
              role: itemProps.role,
              tabIndex: itemProps.tabIndex,
              'aria-disabled': itemProps['aria-disabled'],
              'data-state': itemProps['data-state'],
              'data-value': item.value,
              onClick: itemProps.onClick,
              onMousemove: itemProps.onMouseMove,
              class: 'fc-dropdown-menu__item',
            },
            [
              icon
                ? h('span', { class: 'fc-dropdown-menu__item-icon', 'aria-hidden': 'true' }, icon)
                : null,
              h('span', { class: 'fc-dropdown-menu__item-label' }, props.renderItem?.(item) ?? item.label),
            ].filter((node) => node != null),
          )
        }),
      )
    }
  },
})

export const DropdownMenuSeparator = defineComponent({
  name: 'FcDropdownMenuSeparator',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const { machine } = useDropdownMenuContext()

    return () => {
      void machine.state
      const separatorProps = machine.getSeparatorProps()
      return h('li', {
        ...attrs,
        role: separatorProps.role,
        'aria-orientation': separatorProps['aria-orientation'],
        class: cx('fc-dropdown-menu__separator', attrs.class as string | undefined),
      })
    }
  },
})
