import { defineComponent, h, nextTick, ref, type PropType } from 'vue'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Tab, TabPanel, TabsList, TabsRoot } from './Tabs'

const TabsFixture = defineComponent({
  props: {
    defaultValue: { type: String, default: undefined },
    value: { type: String, default: undefined },
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: undefined },
    variant: { type: String as PropType<'underline' | 'contained'>, default: undefined },
    onValueChange: { type: Function as PropType<(value: string) => void>, default: undefined },
  },
  setup(props) {
    return () =>
      h(TabsRoot, {
        defaultValue: props.defaultValue,
        value: props.value,
        orientation: props.orientation,
        variant: props.variant,
        onValueChange: props.onValueChange,
      }, {
        default: () => [
          h(TabsList, null, {
            default: () => [
              h(Tab, { value: 'a' }, { default: () => 'Tab A' }),
              h(Tab, { value: 'b' }, { default: () => 'Tab B' }),
              h(Tab, { value: 'c' }, { default: () => 'Tab C' }),
            ],
          }),
          h(TabPanel, { value: 'a' }, { default: () => 'Content A' }),
          h(TabPanel, { value: 'b' }, { default: () => 'Content B' }),
          h(TabPanel, { value: 'c' }, { default: () => 'Content C' }),
        ],
      })
  },
})

describe('TabsRoot', () => {
  it('renders with fc-tabs class', () => {
    render(TabsFixture)
    expect(document.querySelector('.fc-tabs')).toBeInTheDocument()
  })

  it('sets data-orientation', () => {
    render(TabsFixture, { props: { orientation: 'vertical' } })
    expect(document.querySelector('.fc-tabs')).toHaveAttribute('data-orientation', 'vertical')
  })

  it('sets data-variant', () => {
    render(TabsFixture, { props: { variant: 'underline' } })
    expect(document.querySelector('.fc-tabs')).toHaveAttribute('data-variant', 'underline')
  })
})

describe('TabsList', () => {
  it('renders with role=tablist', () => {
    render(TabsFixture)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })
})

describe('Tab', () => {
  it('renders tabs with role=tab', () => {
    render(TabsFixture)
    expect(screen.getAllByRole('tab')).toHaveLength(3)
  })

  it('first tab is selected when defaultValue matches', () => {
    render(TabsFixture, { props: { defaultValue: 'a' } })
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'false')
  })

  it('selected tab has tabIndex=0, others -1', () => {
    render(TabsFixture, { props: { defaultValue: 'a' } })
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('tabindex', '-1')
  })

  it('data-state is active for selected tab', () => {
    render(TabsFixture, { props: { defaultValue: 'b' } })
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('data-state', 'active')
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('data-state', 'inactive')
  })

  it('clicking a tab selects it', async () => {
    const user = userEvent.setup()
    render(TabsFixture, { props: { defaultValue: 'a' } })
    await user.click(screen.getByRole('tab', { name: 'Tab B' }))
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onValueChange when tab is clicked', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(TabsFixture, { props: { defaultValue: 'a', onValueChange } })
    await user.click(screen.getByRole('tab', { name: 'Tab B' }))
    expect(onValueChange).toHaveBeenCalledWith('b')
  })

  it('calls latest onValueChange after callback identity changes', async () => {
    const user = userEvent.setup()
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    const { rerender } = render(TabsFixture, { props: { defaultValue: 'a', onValueChange: fn1 } })
    await rerender({ defaultValue: 'a', onValueChange: fn2 })
    await user.click(screen.getByRole('tab', { name: 'Tab B' }))
    expect(fn2).toHaveBeenCalledWith('b')
    expect(fn1).not.toHaveBeenCalled()
  })
})

describe('TabPanel', () => {
  it('shows the panel matching the selected tab', () => {
    render(TabsFixture, { props: { defaultValue: 'b' } })
    expect(screen.getByText('Content B').closest('[role=tabpanel]')).not.toHaveAttribute('hidden')
  })

  it('hides non-selected panels', () => {
    render(TabsFixture, { props: { defaultValue: 'b' } })
    expect(screen.getByText('Content A').closest('[role=tabpanel]')).toHaveAttribute('hidden')
    expect(screen.getByText('Content C').closest('[role=tabpanel]')).toHaveAttribute('hidden')
  })

  it('switches visible panel when tab is clicked', async () => {
    const user = userEvent.setup()
    render(TabsFixture, { props: { defaultValue: 'a' } })
    await user.click(screen.getByRole('tab', { name: 'Tab C' }))
    expect(screen.getByText('Content C').closest('[role=tabpanel]')).not.toHaveAttribute('hidden')
    expect(screen.getByText('Content A').closest('[role=tabpanel]')).toHaveAttribute('hidden')
  })

  it('aria-labelledby points to the corresponding tab id', () => {
    render(TabsFixture, { props: { defaultValue: 'a' } })
    const tabA = screen.getByRole('tab', { name: 'Tab A' })
    const panelA = screen.getByText('Content A').closest('[role=tabpanel]')
    expect(panelA?.getAttribute('aria-labelledby')).toBe(tabA.id)
  })
})

describe('Tabs controlled', () => {
  it('reflects the controlled value prop', async () => {
    const { rerender } = render(TabsFixture, { props: { value: 'a' } })
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'true')
    await rerender({ value: 'b' })
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'false')
  })

  it('works as a fully controlled tabs via ref', async () => {
    const user = userEvent.setup()
    const Wrapper = defineComponent({
      setup() {
        const tab = ref('a')
        return () =>
          h(TabsRoot, { value: tab.value, onValueChange: (value: string) => { tab.value = value } }, {
            default: () => [
              h(TabsList, null, {
                default: () => [
                  h(Tab, { value: 'a' }, { default: () => 'A' }),
                  h(Tab, { value: 'b' }, { default: () => 'B' }),
                ],
              }),
              h(TabPanel, { value: 'a' }, { default: () => 'Panel A' }),
              h(TabPanel, { value: 'b' }, { default: () => 'Panel B' }),
            ],
          })
      },
    })
    render(Wrapper)
    expect(screen.getByText('Panel A').closest('[role=tabpanel]')).not.toHaveAttribute('hidden')
    await user.click(screen.getByRole('tab', { name: 'B' }))
    expect(screen.getByText('Panel B').closest('[role=tabpanel]')).not.toHaveAttribute('hidden')
    expect(screen.getByText('Panel A').closest('[role=tabpanel]')).toHaveAttribute('hidden')
  })
})

describe('Tab outside TabsRoot', () => {
  it('throws a descriptive error', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() =>
      render(defineComponent({
        setup() {
          return () => h(Tab, { value: 'x' }, { default: () => 'X' })
        },
      })),
    ).toThrow('Tab/TabsList/TabPanel must be used inside TabsRoot')
    consoleError.mockRestore()
    consoleWarn.mockRestore()
  })
})

describe('keyboard navigation', () => {
  it('ArrowRight moves focus to the next tab (horizontal)', async () => {
    render(TabsFixture, { props: { defaultValue: 'a' } })
    const tabA = screen.getByRole('tab', { name: 'Tab A' })
    tabA.focus()
    tabA.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }))
    await nextTick()
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Tab B' }))
  })

  it('ArrowLeft moves focus to the previous tab', async () => {
    render(TabsFixture, { props: { defaultValue: 'b' } })
    const tabB = screen.getByRole('tab', { name: 'Tab B' })
    tabB.focus()
    tabB.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }))
    await nextTick()
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Tab A' }))
  })
})
