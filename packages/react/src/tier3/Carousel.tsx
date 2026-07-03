import React, { createContext, useCallback, useContext, useRef } from 'react'
import { createCarousel, type Carousel as CarouselMachine } from '@web-loom/foolscap-core'
import { useMachine } from '../hooks/useMachine'
import { useCallbackRef } from '../utils/useCallbackRef'
import { cx } from '../utils/cx'

interface CarouselContextValue {
  machine: CarouselMachine
  slides: React.ReactNode[]
  injectRootEl: (el: HTMLElement | null) => void
  injectSlideEl: (index: number, el: HTMLDivElement | null) => void
}

const CarouselContext = createContext<CarouselContextValue | null>(null)

function useCarouselContext(): CarouselContextValue {
  const ctx = useContext(CarouselContext)
  if (!ctx) throw new Error('Carousel components must be used inside CarouselRoot')
  return ctx
}

export interface CarouselRootProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'onChange'>,
    React.RefAttributes<HTMLElement> {
  slides: React.ReactNode[]
  label: string
  index?: number
  initialIndex?: number
  loop?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
  onSlideChange?: (index: number, prevIndex: number) => void
  className?: string
  children?: React.ReactNode
}

export function CarouselRoot({
  slides,
  label,
  index,
  initialIndex,
  loop = false,
  autoPlay = false,
  autoPlayInterval,
  onSlideChange,
  className,
  children,
  ref,
  ...props
}: CarouselRootProps) {
  const slidesRef = useRef(slides)
  slidesRef.current = slides
  const labelRef = useRef(label)
  labelRef.current = label
  const indexRef = useRef(index)
  indexRef.current = index
  const initialIndexRef = useRef(initialIndex)
  const loopRef = useRef(loop)
  loopRef.current = loop
  const autoPlayRef = useRef(autoPlay)
  autoPlayRef.current = autoPlay
  const autoPlayIntervalRef = useRef(autoPlayInterval)
  autoPlayIntervalRef.current = autoPlayInterval
  const stableOnSlideChange = useCallbackRef(onSlideChange)

  const machine = useMachine(() =>
    createCarousel({
      get slideCount() {
        return slidesRef.current.length
      },
      get label() {
        return labelRef.current
      },
      get index() {
        return indexRef.current
      },
      initialIndex: initialIndexRef.current,
      get loop() {
        return loopRef.current
      },
      get autoPlay() {
        return autoPlayRef.current
      },
      get autoPlayInterval() {
        return autoPlayIntervalRef.current
      },
      onSlideChange: stableOnSlideChange,
    })
  )

  const injectRootEl = useCallback((el: HTMLElement | null) => machine.setRootEl(el), [machine])
  const injectSlideEl = useCallback((slideIndex: number, el: HTMLDivElement | null) => {
    machine.setSlideEl(slideIndex, el)
  }, [machine])
  const rootProps = machine.getRootProps()

  return (
    <CarouselContext.Provider value={{ machine, slides, injectRootEl, injectSlideEl }}>
      <section
        {...props}
        role={rootProps.role}
        aria-roledescription={rootProps['aria-roledescription']}
        aria-label={props['aria-label'] ?? rootProps['aria-label']}
        aria-live={rootProps['aria-live']}
        data-state={rootProps['data-state']}
        data-loop={rootProps['data-loop']}
        data-autoplay={rootProps['data-autoplay']}
        onMouseEnter={rootProps.onMouseEnter}
        onMouseLeave={rootProps.onMouseLeave}
        onFocus={rootProps.onFocusIn}
        onBlur={rootProps.onFocusOut}
        ref={(el) => {
          injectRootEl(el)
          if (typeof ref === 'function') ref(el)
          else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = el
        }}
        className={cx('fc-carousel', className)}
      >
        {children ?? (
          <>
            <CarouselViewport />
            <CarouselControls />
            <CarouselIndicators />
          </>
        )}
      </section>
    </CarouselContext.Provider>
  )
}

export interface CarouselViewportProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function CarouselViewport({ className, children, ...props }: CarouselViewportProps) {
  const { machine, slides, injectSlideEl } = useCarouselContext()
  return (
    <div {...props} className={cx('fc-carousel__viewport', className)}>
      <div className="fc-carousel__track">
        {children ??
          slides.map((slide, index) => {
            const slideProps = machine.getSlideProps(index)
            return (
              <div
                key={index}
                role={slideProps.role}
                aria-roledescription={slideProps['aria-roledescription']}
                aria-label={slideProps['aria-label']}
                data-state={slideProps['data-state']}
                ref={(el) => injectSlideEl(index, el)}
                className="fc-carousel__slide"
              >
                {slide}
              </div>
            )
          })}
      </div>
    </div>
  )
}

export interface CarouselControlsProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function CarouselControls({ className, ...props }: CarouselControlsProps) {
  return (
    <div {...props} className={cx('fc-carousel__controls', className)}>
      <CarouselPrev />
      <CarouselNext />
    </div>
  )
}

export interface CarouselButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  className?: string
}

export function CarouselPrev({ className, children = '‹', onClick, onKeyDown, ...props }: CarouselButtonProps) {
  const { machine } = useCarouselContext()
  const prevProps = machine.getPrevProps()
  return (
    <button
      {...props}
      type={prevProps.type}
      aria-label={props['aria-label'] ?? prevProps['aria-label']}
      aria-disabled={prevProps['aria-disabled']}
      disabled={prevProps.disabled}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) prevProps.onClick()
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (!e.defaultPrevented) prevProps.onKeyDown(e.nativeEvent)
      }}
      className={cx('fc-carousel__prev', className)}
    >
      {children}
    </button>
  )
}

export function CarouselNext({ className, children = '›', onClick, onKeyDown, ...props }: CarouselButtonProps) {
  const { machine } = useCarouselContext()
  const nextProps = machine.getNextProps()
  return (
    <button
      {...props}
      type={nextProps.type}
      aria-label={props['aria-label'] ?? nextProps['aria-label']}
      aria-disabled={nextProps['aria-disabled']}
      disabled={nextProps.disabled}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) nextProps.onClick()
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (!e.defaultPrevented) nextProps.onKeyDown(e.nativeEvent)
      }}
      className={cx('fc-carousel__next', className)}
    >
      {children}
    </button>
  )
}

export interface CarouselIndicatorsProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function CarouselIndicators({ className, onKeyDown, ...props }: CarouselIndicatorsProps) {
  const { machine, slides } = useCarouselContext()
  const indicatorsProps = machine.getIndicatorsProps()
  return (
    <div
      {...props}
      role={indicatorsProps.role}
      aria-label={props['aria-label'] ?? indicatorsProps['aria-label']}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (!e.defaultPrevented) indicatorsProps.onKeyDown(e.nativeEvent)
      }}
      className={cx('fc-carousel__indicators', className)}
    >
      {slides.map((_, index) => (
        <CarouselIndicator key={index} index={index} />
      ))}
    </div>
  )
}

export interface CarouselIndicatorProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  index: number
  className?: string
}

export function CarouselIndicator({ index, className, children, onClick, ...props }: CarouselIndicatorProps) {
  const { machine } = useCarouselContext()
  const indicatorProps = machine.getIndicatorProps(index)
  return (
    <button
      {...props}
      type={indicatorProps.type}
      role={indicatorProps.role}
      aria-label={props['aria-label'] ?? indicatorProps['aria-label']}
      aria-selected={indicatorProps['aria-selected']}
      aria-current={indicatorProps['aria-current']}
      tabIndex={indicatorProps.tabIndex}
      data-state={indicatorProps['data-state']}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) indicatorProps.onClick()
      }}
      className={cx('fc-carousel__indicator', className)}
    >
      {children}
    </button>
  )
}
