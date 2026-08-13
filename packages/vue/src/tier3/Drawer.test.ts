import { defineComponent, h, type PropType } from 'vue'
import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Drawer, DrawerBody, DrawerClose, DrawerHeader, DrawerTitle } from './Drawer'

const DrawerFixture = defineComponent({
  props: {
    open: { type: Boolean, default: false },
    onOpenChange: { type: Function as PropType<(open: boolean) => void>, default: undefined },
  },
  setup(props) {
    return () =>
      h(
        Drawer,
        { open: props.open, animationDuration: 0, onOpenChange: props.onOpenChange },
        {
          default: () => [
            h(DrawerHeader, null, {
              default: () => [
                h(DrawerTitle, null, { default: () => 'Filters' }),
                h(DrawerClose),
              ],
            }),
            h(DrawerBody, null, { default: () => 'Drawer body' }),
          ],
        },
      )
  },
})

afterEach(() => {
  document.body.style.overflow = ''
})

describe('Drawer', () => {
  it('renders closed by default', () => {
    render(DrawerFixture, { props: { open: false } })
    const root = document.body.querySelector('.fc-drawer')
    expect(root).toBeInTheDocument()
    expect(root).toHaveAttribute('data-state', 'closed')
    expect(root).toHaveAttribute('data-side', 'right')
    expect(screen.getByRole('button', { name: 'Close drawer', hidden: true })).toBeInTheDocument()
    expect(document.body.querySelector('.fc-drawer__overlay')).toBeInTheDocument()
  })

  it('opens the panel when open=true', async () => {
    render(DrawerFixture, { props: { open: true } })
    const dialog = document.body.querySelector('dialog') as HTMLDialogElement
    await waitFor(() => expect(dialog).toHaveAttribute('open'))
    await waitFor(() => expect(document.body.querySelector('.fc-drawer')).toHaveAttribute('data-state', 'open'))
    expect(screen.getByRole('heading', { name: 'Filters' })).toBeInTheDocument()
  })

  it('closes from the close button and emits openChange', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(DrawerFixture, { props: { open: true, onOpenChange } })
    await waitFor(() => expect(document.body.querySelector('.fc-drawer')).toHaveAttribute('data-state', 'open'))
    await user.click(screen.getByRole('button', { name: 'Close drawer' }))
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
  })
})
