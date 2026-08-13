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
import { createCarousel, type Carousel as CarouselMachine } from '@web-loom/foolscap-core'
import { useMachine } from '../composables/useMachine'
import { cx } from '../utils/cx'

interface CarouselContextValue {
  machine: CarouselMachine
  slides: { value: (string | VNode)[] }
  injectSlideEl: (index: number, el: HTMLDivElement | null) => void
}

const CarouselKey: InjectionKey<CarouselContextValue> = Symbol('fc-carousel')

function useCarouselContext(): CarouselContextValue {
  const ctx = inject(CarouselKey, null)
  if (!ctx) throw new Error('Carousel components must be used inside CarouselRoot')
  return ctx
}

export interface CarouselRootProps {
  slides: (string | VNode)[]
  label: string
  index?: number
  initialIndex?: number
  loop?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
}

export interface CarouselIndicatorProps {
  index: number
}

export const CarouselRoot = defineComponent({
  name: 'FcCarouselRoot',
  inheritAttrs: false,
  props: {
    slides: { type: Array as PropType<(string | VNode)[]>, required: true },
    label: { type: String, required: true },
    index: { type: Number, default: undefined },
    modelValue: { type: Number, default: undefined },
    initialIndex: { type: Number, default: undefined },
    loop: { type: Boolean, default: false },
    autoPlay: { type: Boolean, default: false },
    autoPlayInterval: { type: Number, default: undefined },
  },
  emits: ['slideChange', 'update:modelValue'],
  setup(props, { slots, attrs, emit }) {
    const initialIndex = props.initialIndex
    const machine = useMachine(() =>
      createCarousel({
        get slideCount() {
          return props.slides.length
        },
        get label() {
          return props.label
        },
        get index() {
          return props.modelValue !== undefined ? props.modelValue : props.index
        },
        initialIndex,
        get loop() {
          return props.loop
        },
        get autoPlay() {
          return props.autoPlay
        },
        get autoPlayInterval() {
          return props.autoPlayInterval
        },
        onSlideChange: (index, prevIndex) => {
          emit('update:modelValue', index)
          emit('slideChange', index, prevIndex)
        },
      }),
    )

    provide(CarouselKey, {
      machine,
      slides: {
        get value() {
          return props.slides
        },
      },
      injectSlideEl: (index, el) => machine.setSlideEl(index, el),
    })

    return () => {
      const rootProps = machine.getRootProps()
      const { class: className, 'aria-label': ariaLabel, ...rest } = attrs

      return h(
        'section',
        {
          ...rest,
          ref: (el: unknown) => machine.setRootEl(el instanceof HTMLElement ? el : null),
          role: rootProps.role,
          'aria-roledescription': rootProps['aria-roledescription'],
          'aria-label': (ariaLabel as string | undefined) ?? rootProps['aria-label'],
          'aria-live': rootProps['aria-live'],
          'data-state': rootProps['data-state'],
          'data-loop': rootProps['data-loop'],
          'data-autoplay': rootProps['data-autoplay'],
          onMouseenter: rootProps.onMouseEnter,
          onMouseleave: rootProps.onMouseLeave,
          onFocusin: rootProps.onFocusIn,
          onFocusout: rootProps.onFocusOut,
          class: cx('fc-carousel', className as string | undefined),
        },
        slots.default?.() ?? [h(CarouselViewport), h(CarouselControls), h(CarouselIndicators)],
      )
    }
  },
})

export const CarouselViewport = defineComponent({
  name: 'FcCarouselViewport',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const { machine, slides, injectSlideEl } = useCarouselContext()

    return () => {
      void machine.state
      return h('div', { ...attrs, class: cx('fc-carousel__viewport', attrs.class as string | undefined) }, [
        h(
          'div',
          { class: 'fc-carousel__track' },
          slots.default?.() ??
            slides.value.map((slide, index) => {
              const slideProps = machine.getSlideProps(index)
              return h(
                'div',
                {
                  key: index,
                  ref: (el: unknown) => injectSlideEl(index, el instanceof HTMLDivElement ? el : null),
                  role: slideProps.role,
                  'aria-roledescription': slideProps['aria-roledescription'],
                  'aria-label': slideProps['aria-label'],
                  'data-state': slideProps['data-state'],
                  class: 'fc-carousel__slide',
                },
                slide,
              )
            }),
        ),
      ])
    }
  },
})

export const CarouselControls = defineComponent({
  name: 'FcCarouselControls',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h('div', { ...attrs, class: cx('fc-carousel__controls', attrs.class as string | undefined) }, [
        h(CarouselPrev),
        h(CarouselNext),
      ])
  },
})

export const CarouselPrev = defineComponent({
  name: 'FcCarouselPrev',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const { machine } = useCarouselContext()
    const buttonEl = ref<HTMLButtonElement | null>(null)

    function handleKeyDown(event: KeyboardEvent) {
      const { onKeyDown } = attrs
      if (typeof onKeyDown === 'function') onKeyDown(event)
      if (!event.defaultPrevented) machine.getPrevProps().onKeyDown(event)
    }

    onMounted(() => {
      buttonEl.value?.addEventListener('keydown', handleKeyDown)
    })
    onBeforeUnmount(() => {
      buttonEl.value?.removeEventListener('keydown', handleKeyDown)
    })

    return () => {
      void machine.state
      const prevProps = machine.getPrevProps()
      const { class: className, onClick, 'aria-label': ariaLabel, ...rest } = attrs

      return h(
        'button',
        {
          ...rest,
          ref: buttonEl,
          type: prevProps.type,
          'aria-label': (ariaLabel as string | undefined) ?? prevProps['aria-label'],
          'aria-disabled': prevProps['aria-disabled'],
          disabled: prevProps.disabled,
          onClick: (event: Event) => {
            if (typeof onClick === 'function') onClick(event)
            if (!event.defaultPrevented) prevProps.onClick()
          },
          class: cx('fc-carousel__prev', className as string | undefined),
        },
        slots.default?.() ?? '‹',
      )
    }
  },
})

export const CarouselNext = defineComponent({
  name: 'FcCarouselNext',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const { machine } = useCarouselContext()
    const buttonEl = ref<HTMLButtonElement | null>(null)

    function handleKeyDown(event: KeyboardEvent) {
      const { onKeyDown } = attrs
      if (typeof onKeyDown === 'function') onKeyDown(event)
      if (!event.defaultPrevented) machine.getNextProps().onKeyDown(event)
    }

    onMounted(() => {
      buttonEl.value?.addEventListener('keydown', handleKeyDown)
    })
    onBeforeUnmount(() => {
      buttonEl.value?.removeEventListener('keydown', handleKeyDown)
    })

    return () => {
      void machine.state
      const nextProps = machine.getNextProps()
      const { class: className, onClick, 'aria-label': ariaLabel, ...rest } = attrs

      return h(
        'button',
        {
          ...rest,
          ref: buttonEl,
          type: nextProps.type,
          'aria-label': (ariaLabel as string | undefined) ?? nextProps['aria-label'],
          'aria-disabled': nextProps['aria-disabled'],
          disabled: nextProps.disabled,
          onClick: (event: Event) => {
            if (typeof onClick === 'function') onClick(event)
            if (!event.defaultPrevented) nextProps.onClick()
          },
          class: cx('fc-carousel__next', className as string | undefined),
        },
        slots.default?.() ?? '›',
      )
    }
  },
})

export const CarouselIndicators = defineComponent({
  name: 'FcCarouselIndicators',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const { machine, slides } = useCarouselContext()
    const listEl = ref<HTMLDivElement | null>(null)

    function handleKeyDown(event: KeyboardEvent) {
      const { onKeyDown } = attrs
      if (typeof onKeyDown === 'function') onKeyDown(event)
      if (!event.defaultPrevented) machine.getIndicatorsProps().onKeyDown(event)
    }

    onMounted(() => {
      listEl.value?.addEventListener('keydown', handleKeyDown)
    })
    onBeforeUnmount(() => {
      listEl.value?.removeEventListener('keydown', handleKeyDown)
    })

    return () => {
      void machine.state
      const indicatorsProps = machine.getIndicatorsProps()
      const { class: className, 'aria-label': ariaLabel, ...rest } = attrs

      return h(
        'div',
        {
          ...rest,
          ref: listEl,
          role: indicatorsProps.role,
          'aria-label': (ariaLabel as string | undefined) ?? indicatorsProps['aria-label'],
          class: cx('fc-carousel__indicators', className as string | undefined),
        },
        slides.value.map((_, index) => h(CarouselIndicator, { key: index, index })),
      )
    }
  },
})

export const CarouselIndicator = defineComponent({
  name: 'FcCarouselIndicator',
  inheritAttrs: false,
  props: {
    index: { type: Number, required: true },
  },
  setup(props, { slots, attrs }) {
    const { machine } = useCarouselContext()

    return () => {
      void machine.state
      const indicatorProps = machine.getIndicatorProps(props.index)
      const { class: className, onClick, 'aria-label': ariaLabel, ...rest } = attrs

      return h(
        'button',
        {
          ...rest,
          type: indicatorProps.type,
          role: indicatorProps.role,
          'aria-label': (ariaLabel as string | undefined) ?? indicatorProps['aria-label'],
          'aria-selected': indicatorProps['aria-selected'],
          'aria-current': indicatorProps['aria-current'],
          tabIndex: indicatorProps.tabIndex,
          'data-state': indicatorProps['data-state'],
          onClick: (event: Event) => {
            if (typeof onClick === 'function') onClick(event)
            if (!event.defaultPrevented) indicatorProps.onClick()
          },
          class: cx('fc-carousel__indicator', className as string | undefined),
        },
        slots.default?.(),
      )
    }
  },
})
