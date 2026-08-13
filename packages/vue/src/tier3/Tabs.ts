import { defineComponent, h, inject, onBeforeUnmount, onMounted, provide, ref, type InjectionKey, type PropType } from 'vue'
import { createTabs, type Tabs } from '@web-loom/foolscap-core'
import { useMachine } from '../composables/useMachine'
import { cx } from '../utils/cx'

interface TabsContextValue {
  machine: Tabs
  currentValue: { value: string }
}

const TabsKey: InjectionKey<TabsContextValue> = Symbol('fc-tabs')

function useTabsContext(): TabsContextValue {
  const ctx = inject(TabsKey, null)
  if (!ctx) throw new Error('Tab/TabsList/TabPanel must be used inside TabsRoot')
  return ctx
}

export interface TabsRootProps {
  defaultValue?: string
  value?: string
  modelValue?: string
  activationMode?: 'automatic' | 'manual'
  orientation?: 'horizontal' | 'vertical'
  variant?: 'underline' | 'contained'
  loop?: boolean
}

export interface TabProps {
  value: string
  disabled?: boolean
}

export interface TabPanelProps {
  value: string
}

export const TabsRoot = defineComponent({
  name: 'FcTabsRoot',
  inheritAttrs: false,
  props: {
    defaultValue: { type: String, default: undefined },
    value: { type: String, default: undefined },
    modelValue: { type: String, default: undefined },
    activationMode: { type: String as PropType<TabsRootProps['activationMode']>, default: undefined },
    orientation: { type: String as PropType<TabsRootProps['orientation']>, default: undefined },
    variant: { type: String as PropType<TabsRootProps['variant']>, default: undefined },
    loop: { type: Boolean, default: undefined },
  },
  emits: ['update:modelValue', 'valueChange'],
  setup(props, { slots, attrs, emit }) {
    const machine = useMachine(() =>
      createTabs({
        defaultValue: props.defaultValue,
        get value() {
          return props.modelValue !== undefined ? props.modelValue : props.value
        },
        activationMode: props.activationMode,
        orientation: props.orientation,
        loop: props.loop,
        onValueChange: (value) => {
          emit('update:modelValue', value)
          emit('valueChange', value)
        },
      }),
    )

    const currentValue = {
      get value() {
        if (props.modelValue !== undefined) return props.modelValue
        if (props.value !== undefined) return props.value
        return machine.state.value
      },
    }

    provide(TabsKey, { machine, currentValue })

    return () =>
      h(
        'div',
        {
          class: cx('fc-tabs', attrs.class as string | undefined),
          'data-variant': props.variant,
          'data-orientation': props.orientation ?? 'horizontal',
        },
        slots.default?.(),
      )
  },
})

export const TabsList = defineComponent({
  name: 'FcTabsList',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const { machine } = useTabsContext()

    return () => {
      const tablistProps = machine.getTablistProps()
      return h(
        'div',
        {
          ...tablistProps,
          ...attrs,
          class: cx('fc-tabs__tablist', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
    }
  },
})

export const Tab = defineComponent({
  name: 'FcTab',
  inheritAttrs: false,
  props: {
    value: { type: String, required: true },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    const { machine, currentValue } = useTabsContext()
    const buttonEl = ref<HTMLButtonElement | null>(null)

    function handleKeyDown(event: KeyboardEvent) {
      machine.getTabProps(props.value).onKeyDown(event)
    }

    onMounted(() => {
      buttonEl.value?.addEventListener('keydown', handleKeyDown)
    })
    onBeforeUnmount(() => {
      buttonEl.value?.removeEventListener('keydown', handleKeyDown)
    })

    return () => {
      const isSelected = currentValue.value === props.value
      const { onClick, id, 'aria-controls': ariaControls } = machine.getTabProps(props.value)

      return h(
        'button',
        {
          ...attrs,
          ref: buttonEl,
          type: 'button',
          role: 'tab',
          id,
          'aria-controls': ariaControls,
          'aria-selected': isSelected,
          tabIndex: isSelected ? 0 : -1,
          'data-state': isSelected ? 'active' : 'inactive',
          disabled: props.disabled,
          class: cx('fc-tabs__tab', attrs.class as string | undefined),
          onClick,
        },
        slots.default?.(),
      )
    }
  },
})

export const TabPanel = defineComponent({
  name: 'FcTabPanel',
  inheritAttrs: false,
  props: {
    value: { type: String, required: true },
  },
  setup(props, { slots, attrs }) {
    const { machine, currentValue } = useTabsContext()

    return () => {
      const { id, 'aria-labelledby': labelledBy } = machine.getPanelProps(props.value)

      return h(
        'div',
        {
          ...attrs,
          role: 'tabpanel',
          id,
          'aria-labelledby': labelledBy,
          hidden: currentValue.value !== props.value,
          class: cx('fc-tabs__panel', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
    }
  },
})
