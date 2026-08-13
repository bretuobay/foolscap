import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { FileUpload } from './FileUpload'

describe('FileUpload', () => {
  it('renders a dropzone label and hidden file input', () => {
    render(FileUpload, {
      props: { label: 'Drag files here or click to browse' },
      attrs: { class: 'extra' },
    })
    expect(screen.getByText('Drag files here or click to browse')).toHaveClass('fc-file-upload__label')
    const input = document.querySelector('.fc-file-upload__input') as HTMLInputElement
    expect(input).toHaveAttribute('type', 'file')
    expect(document.querySelector('.fc-file-upload')).toHaveClass('extra')
  })

  it('renders an optional hint', () => {
    render(FileUpload, { props: { hint: 'PNG up to 2MB' } })
    expect(screen.getByText('PNG up to 2MB')).toHaveClass('fc-file-upload__hint')
  })
})
