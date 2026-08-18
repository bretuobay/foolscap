import {
  type AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  type ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core'
import {
  createFileUpload,
  type FileUpload as FileUploadMachine,
  type FileUploadError,
} from '@web-loom/foolscap-core'
import { injectStableCallback } from '../bindings/inject-stable-callback'
import { nextId } from '../utils/ids'

export type { FileUploadError }

export interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number
  label?: string
  hint?: string
  disabled?: boolean
  id?: string
}

@Component({
  selector: 'fc-file-upload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      #inputEl
      type="file"
      class="fc-file-upload__input"
      [id]="inputId"
      [attr.accept]="accept"
      [multiple]="multiple"
      [disabled]="disabled"
      [attr.aria-hidden]="machine ? null : true"
      (change)="onInputChange($event)"
    />
    <label
      class="fc-file-upload__dropzone"
      [attr.for]="inputId"
      (dragenter)="onDragEnter($event)"
      (dragleave)="onDragLeave($event)"
      (dragover)="onDragOver($event)"
      (drop)="onDrop($event)"
    >
      <svg
        class="fc-file-upload__icon"
        aria-hidden="true"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 15V4" />
        <path d="M8 8l4-4 4 4" />
        <path d="M4 20h16" />
      </svg>
      <span class="fc-file-upload__label">{{ label }}</span>
      @if (hint) {
        <span class="fc-file-upload__hint">{{ hint }}</span>
      }
    </label>
    @if (files.length > 0) {
      <ul class="fc-file-upload__file-list" aria-label="Selected files">
        @for (file of files; track file.name + $index) {
          <li>
            <span>📄</span>
            <span>{{ file.name }}</span>
            <span
              [style.margin-inline-start]="'auto'"
              [style.color]="'var(--fc-ink-muted)'"
              [style.flex-shrink]="0"
            >
              {{ formatSize(file.size) }}
            </span>
          </li>
        }
      </ul>
    }
  `,
  host: {
    class: 'fc-file-upload',
    '[attr.data-state]': 'isDragging ? "dragging" : "idle"',
    '[attr.data-disabled]': 'disabled ? "" : null',
  },
})
export class FileUpload implements AfterViewInit {
  @ViewChild('inputEl') private inputEl?: ElementRef<HTMLInputElement>

  @Input() accept?: string
  @Input() multiple = false
  @Input() maxSize?: number
  @Input() label = 'Drag files here or click to browse'
  @Input() hint?: string
  @Input() disabled = false
  @Input() id?: string
  @Output() filesSelected = new EventEmitter<File[]>()
  @Output() error = new EventEmitter<FileUploadError>()

  private readonly generatedId = nextId('fc-file-upload')
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly onFilesSelected = injectStableCallback(
    () => (files: File[]) => this.filesSelected.emit(files),
  )
  private readonly onError = injectStableCallback(
    () => (error: FileUploadError) => this.error.emit(error),
  )

  protected machine: FileUploadMachine | null = null
  protected isDragging = false
  protected files: File[] = []
  private unsubscribe?: () => void

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.unsubscribe?.()
      this.machine?.destroy()
      this.machine = null
    })
  }

  get inputId(): string {
    return this.id ?? this.generatedId
  }

  ngAfterViewInit(): void {
    const el = this.inputEl?.nativeElement
    if (!el) return
    const getAccept = () => this.accept
    const getMultiple = () => this.multiple
    const getMaxSize = () => this.maxSize
    const instance = createFileUpload(el, {
      get accept() {
        return getAccept()
      },
      get multiple() {
        return getMultiple()
      },
      get maxSize() {
        return getMaxSize()
      },
      onFilesSelected: this.onFilesSelected,
      onError: this.onError,
    })
    this.machine = instance
    this.unsubscribe = instance.subscribe(() => {
      this.isDragging = instance.state.isDragging
      this.files = instance.state.files
      this.cdr.markForCheck()
    })
    this.cdr.markForCheck()
  }

  onInputChange(event: Event): void {
    this.machine?.getInputProps().onChange(event)
  }

  onDragEnter(event: DragEvent): void {
    this.machine?.getDropzoneProps().onDragEnter(event)
  }

  onDragLeave(event: DragEvent): void {
    this.machine?.getDropzoneProps().onDragLeave(event)
  }

  onDragOver(event: DragEvent): void {
    this.machine?.getDropzoneProps().onDragOver(event)
  }

  onDrop(event: DragEvent): void {
    this.machine?.getDropzoneProps().onDrop(event)
  }

  protected formatSize(size: number): string {
    return `${(size / 1024).toFixed(1)} KB`
  }
}
