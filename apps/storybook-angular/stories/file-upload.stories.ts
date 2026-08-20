import { Component } from '@angular/core'
import type { Meta, StoryObj } from '@storybook/angular'
import { FileUpload, type FileUploadError } from '@web-loom/foolscap-angular'

const meta = {
  title: 'Tier 2/File Upload',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [FileUpload] },
    template: `
      <div style="max-width:480px">
        <fc-file-upload label="Drag files here or click to browse"></fc-file-upload>
      </div>
    `,
  }),
}

export const WithHint: Story = {
  name: 'With hint',
  render: () => ({
    moduleMetadata: { imports: [FileUpload] },
    template: `
      <div style="max-width:480px">
        <fc-file-upload
          accept=".png,.jpg,.pdf"
          label="Upload your document"
          hint="PNG, JPG, or PDF · Max 10 MB"
        ></fc-file-upload>
      </div>
    `,
  }),
}

export const MultipleFiles: Story = {
  name: 'Multiple files',
  render: () => ({
    moduleMetadata: { imports: [FileUpload] },
    template: `
      <div style="max-width:480px">
        <fc-file-upload
          [multiple]="true"
          label="Drag files here or click to browse"
          hint="Upload multiple files at once"
        ></fc-file-upload>
      </div>
    `,
  }),
}

@Component({
  selector: 'demo-file-upload-error',
  standalone: true,
  imports: [FileUpload],
  template: `
    <div style="max-width:480px;display:flex;flex-direction:column;gap:0.75rem">
      <fc-file-upload
        accept="image/*"
        [maxSize]="1024 * 1024"
        label="Images only, max 1 MB"
        hint="Try uploading a large or non-image file to trigger an error"
        (error)="onError($event)"
      ></fc-file-upload>
      @if (error) {
        <p role="alert" style="margin:0;color:red;font-size:0.875rem">{{ error }}</p>
      }
    </div>
  `,
})
class ErrorDemo {
  error: string | null = null

  onError(err: FileUploadError): void {
    this.error =
      err.type === 'size'
        ? `${err.file.name} exceeds the 1 MB limit.`
        : `${err.file.name} has an unsupported type.`
  }
}

export const WithErrorHandling: Story = {
  name: 'With error handling',
  render: () => ({
    moduleMetadata: { imports: [ErrorDemo] },
    template: `<demo-file-upload-error></demo-file-upload-error>`,
  }),
}
