import React from 'react'
import { cx } from '../utils/cx'

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>,
    React.RefAttributes<HTMLInputElement> {
  rootClassName?: string
  icon?: React.ReactNode
  clearLabel?: string
  onClear?: () => void
}

export function SearchInput({
  rootClassName,
  className,
  icon,
  clearLabel = 'Clear search',
  onClear,
  ref,
  ...props
}: SearchInputProps) {
  return (
    <span className={cx('fc-search-input', rootClassName)}>
      <span className="fc-search-input__icon" aria-hidden="true">
        {icon ?? 'Search'}
      </span>
      <input {...props} ref={ref} type="search" className={cx('fc-search-input__field', className)} />
      {onClear && (
        <button className="fc-search-input__clear" type="button" aria-label={clearLabel} onClick={onClear}>
          x
        </button>
      )}
    </span>
  )
}
