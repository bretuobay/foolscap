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
  createTreeView,
  type TreeView as TreeViewMachine,
  type TreeViewItem,
  type TreeViewSelectionMode,
} from '@web-loom/foolscap-core'
import { useMachine } from '../composables/useMachine'
import { cx } from '../utils/cx'

export type { TreeViewItem, TreeViewSelectionMode }

interface TreeViewContextValue {
  machine: TreeViewMachine
  items: { value: TreeViewItem[] }
  injectItemEl: (id: string, el: HTMLLIElement | null) => void
}

const TreeViewKey: InjectionKey<TreeViewContextValue> = Symbol('fc-tree-view')

function useTreeViewContext(): TreeViewContextValue {
  const ctx = inject(TreeViewKey, null)
  if (!ctx) throw new Error('TreeView components must be used inside TreeViewRoot')
  return ctx
}

export interface TreeViewRootProps {
  items: TreeViewItem[]
  expandedIds?: string[]
  defaultExpandedIds?: string[]
  selectedId?: string | null
  defaultSelectedId?: string | null
  selectionMode?: TreeViewSelectionMode
  label?: string
}

export interface TreeViewItemProps {
  item: TreeViewItem
}

export const TreeViewRoot = defineComponent({
  name: 'FcTreeViewRoot',
  inheritAttrs: false,
  props: {
    items: { type: Array as PropType<TreeViewItem[]>, required: true },
    expandedIds: { type: Array as PropType<string[]>, default: undefined },
    defaultExpandedIds: { type: Array as PropType<string[]>, default: undefined },
    selectedId: { type: String as PropType<string | null>, default: undefined },
    defaultSelectedId: { type: String as PropType<string | null>, default: undefined },
    selectionMode: { type: String as PropType<TreeViewSelectionMode>, default: 'single' },
    label: { type: String, default: 'Tree' },
  },
  emits: ['expandedChange', 'selectionChange'],
  setup(props, { slots, attrs, emit }) {
    const defaultExpandedIds = props.defaultExpandedIds
    const defaultSelectedId = props.defaultSelectedId
    const machine = useMachine(() =>
      createTreeView({
        get items() {
          return props.items
        },
        get expandedIds() {
          return props.expandedIds
        },
        defaultExpandedIds,
        get selectedId() {
          return props.selectedId
        },
        defaultSelectedId,
        get selectionMode() {
          return props.selectionMode
        },
        get label() {
          return props.label
        },
        onExpandedChange: (ids) => emit('expandedChange', ids),
        onSelectionChange: (id) => emit('selectionChange', id),
      }),
    )

    provide(TreeViewKey, {
      machine,
      items: {
        get value() {
          return props.items
        },
      },
      injectItemEl: (id, el) => machine.setItemEl(id, el),
    })

    return () => {
      const rootProps = machine.getRootProps()
      const { class: className, 'aria-label': ariaLabel, ...rest } = attrs

      return h(
        'ul',
        {
          ...rest,
          ref: (el: unknown) => machine.setRootEl(el instanceof HTMLUListElement ? el : null),
          role: rootProps.role,
          'aria-label': (ariaLabel as string | undefined) ?? rootProps['aria-label'],
          class: cx('fc-tree', className as string | undefined),
        },
        slots.default?.() ?? props.items.map((item) => h(TreeViewItemView, { key: item.id, item })),
      )
    }
  },
})

export const TreeViewItemView = defineComponent({
  name: 'FcTreeViewItemView',
  inheritAttrs: false,
  props: {
    item: { type: Object as PropType<TreeViewItem>, required: true },
  },
  setup(props, { slots, attrs }) {
    const { machine, injectItemEl } = useTreeViewContext()
    const itemEl = ref<HTMLLIElement | null>(null)

    function handleKeyDown(event: KeyboardEvent) {
      const { onKeyDown } = attrs
      if (typeof onKeyDown === 'function') onKeyDown(event)
      if (!event.defaultPrevented) {
        event.stopPropagation()
        machine.getItemProps(props.item.id, Boolean(props.item.children?.length)).onKeyDown(event)
      }
    }

    onMounted(() => {
      itemEl.value?.addEventListener('keydown', handleKeyDown)
    })
    onBeforeUnmount(() => {
      itemEl.value?.removeEventListener('keydown', handleKeyDown)
    })

    return (): VNode => {
      void machine.state
      const hasChildren = Boolean(props.item.children?.length)
      const itemProps = machine.getItemProps(props.item.id, hasChildren)
      const { class: className, onClick, ...rest } = attrs

      return h(
        'li',
        {
          ...rest,
          ref: (el: unknown) => {
            const node = el instanceof HTMLLIElement ? el : null
            itemEl.value = node
            injectItemEl(props.item.id, node)
          },
          role: itemProps.role,
          id: (rest.id as string | undefined) ?? itemProps.id,
          'aria-label': (rest['aria-label'] as string | undefined) ?? itemProps['aria-label'],
          tabIndex: itemProps.tabIndex,
          'aria-expanded': itemProps['aria-expanded'],
          'aria-selected': itemProps['aria-selected'],
          'aria-disabled': itemProps['aria-disabled'],
          'aria-level': itemProps['aria-level'],
          'data-state': itemProps['data-state'],
          'data-disabled': itemProps['data-disabled'],
          onClick: (event: Event) => {
            if (typeof onClick === 'function') onClick(event)
            if (!event.defaultPrevented) {
              event.stopPropagation()
              itemProps.onClick()
            }
          },
          class: cx('fc-tree__item', className as string | undefined),
        },
        slots.default?.() ?? [
          h(TreeViewItemContent, { item: props.item }),
          hasChildren ? h(TreeViewGroup, { parent: props.item }) : null,
        ].filter((node) => node != null),
      )
    }
  },
})

export const TreeViewItemContent = defineComponent({
  name: 'FcTreeViewItemContent',
  inheritAttrs: false,
  props: {
    item: { type: Object as PropType<TreeViewItem>, required: true },
  },
  setup(props, { slots, attrs }) {
    return () => {
      const hasChildren = Boolean(props.item.children?.length)
      return h('div', { ...attrs, class: cx('fc-tree__item-content', attrs.class as string | undefined) }, [
        hasChildren
          ? h(TreeViewToggle, { item: props.item })
          : h('span', { class: 'fc-tree__spacer', 'aria-hidden': 'true' }),
        h(TreeViewLabel, null, { default: () => slots.default?.() ?? props.item.label }),
      ])
    }
  },
})

export const TreeViewToggle = defineComponent({
  name: 'FcTreeViewToggle',
  inheritAttrs: false,
  props: {
    item: { type: Object as PropType<TreeViewItem>, required: true },
  },
  setup(props, { slots, attrs }) {
    const { machine } = useTreeViewContext()

    return () => {
      void machine.state
      const toggleProps = machine.getToggleProps(props.item.id)
      const expanded = machine.getItemProps(props.item.id, true)['aria-expanded']
      const { class: className, onClick, 'aria-label': ariaLabel, ...rest } = attrs

      return h(
        'button',
        {
          ...rest,
          type: toggleProps.type,
          tabIndex: toggleProps.tabIndex,
          'aria-label': (ariaLabel as string | undefined) ?? toggleProps['aria-label'],
          onClick: (event: Event) => {
            event.stopPropagation()
            if (typeof onClick === 'function') onClick(event)
            if (!event.defaultPrevented) toggleProps.onClick()
          },
          class: cx('fc-tree__toggle', className as string | undefined),
        },
        slots.default?.() ?? [h('span', { 'aria-hidden': 'true' }, expanded ? '▾' : '▸')],
      )
    }
  },
})

export const TreeViewLabel = defineComponent({
  name: 'FcTreeViewLabel',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h('span', { ...attrs, class: cx('fc-tree__label', attrs.class as string | undefined) }, slots.default?.())
  },
})

export const TreeViewGroup = defineComponent({
  name: 'FcTreeViewGroup',
  inheritAttrs: false,
  props: {
    parent: { type: Object as PropType<TreeViewItem>, required: true },
  },
  setup(props, { attrs }) {
    const { machine } = useTreeViewContext()

    return (): VNode => {
      void machine.state
      const groupProps = machine.getGroupProps(props.parent.id)
      return h(
        'ul',
        {
          ...attrs,
          role: groupProps.role,
          hidden: groupProps.hidden ? true : undefined,
          class: cx('fc-tree__group', attrs.class as string | undefined),
        },
        (props.parent.children ?? []).map((child) => h(TreeViewItemView, { key: child.id, item: child })),
      )
    }
  },
})
