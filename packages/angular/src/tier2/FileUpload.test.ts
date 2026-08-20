import { render, screen } from '@testing-library/angular'
import { describe, expect, it } from 'vitest'
import { FileUpload } from './FileUpload'

describe('FileUpload', () => {
  it('renders a dropzone label and hidden file input', async () => {
    const { container } = await render(
      `<fc-file-upload class="extra" label="Drag files here or click to browse"></fc-file-upload>`,
      { imports: [FileUpload] },
    )
    expect(screen.getByText('Drag files here or click to browse')).toHaveClass('fc-file-upload__label')
    const input = document.querySelector('.fc-file-upload__input') as HTMLInputElement
    expect(input).toHaveAttribute('type', 'file')
    expect(container.querySelector('.fc-file-upload')).toHaveClass('extra')
  })

  it('renders an optional hint', async () => {
    await render(`<fc-file-upload hint="PNG up to 2MB"></fc-file-upload>`, { imports: [FileUpload] })
    expect(screen.getByText('PNG up to 2MB')).toHaveClass('fc-file-upload__hint')
  })
})
