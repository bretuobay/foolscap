import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  InjectionToken,
  Injector,
  Input,
  type OnInit,
  Output,
  runInInjectionContext,
  signal,
} from '@angular/core'
import {
  createRichTextEditor,
  type RichTextEditor as RichTextEditorMachine,
  type RichTextEditorCommand,
} from '@web-loom/foolscap-core'
import { injectMachine } from '../bindings/inject-machine'
import { injectStableCallback } from '../bindings/inject-stable-callback'

export type { RichTextEditorCommand }

export const RICH_TEXT_EDITOR = new InjectionToken<RichTextEditorRoot>('fc-rte')

function injectRte(): RichTextEditorRoot {
  const ctx = inject(RICH_TEXT_EDITOR, { optional: true })
  if (!ctx) throw new Error('RichTextEditor components must be used inside RichTextEditorRoot')
  return ctx
}

export interface RichTextEditorRootProps {
  defaultValue?: string
  value?: string
  placeholder?: string
  disabled?: boolean
}

export interface RichTextEditorToolbarGroupProps {
  label: string
}

export interface RichTextEditorButtonProps {
  command: RichTextEditorCommand
  value?: string
}

@Component({
  selector: '[fc-rte-toolbar-group]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-rte__toolbar-group',
    '[attr.role]': 'groupProps.role',
    '[attr.aria-label]': 'label',
  },
})
export class RichTextEditorToolbarGroup {
  private readonly ctx = injectRte()
  @Input({ required: true }) label = ''
  get groupProps() {
    return this.ctx.machine.getToolbarGroupProps(this.label)
  }
}

@Component({
  selector: 'button[fc-rte-button]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-rte__toolbar-button',
    '[attr.type]': 'buttonProps.type',
    '[attr.aria-label]': 'ariaLabel ?? buttonProps["aria-label"]',
    '[attr.aria-pressed]': 'buttonProps["aria-pressed"]',
    '[attr.data-state]': 'buttonProps["data-state"]',
    '[attr.data-command]': 'buttonProps["data-command"]',
    '[attr.data-value]': 'buttonProps["data-value"]',
    '[disabled]': 'buttonProps.disabled',
    '(mousedown)': 'onMouseDown($event)',
    '(click)': 'onClick()',
    '(keydown)': 'buttonProps.onKeyDown($event)',
  },
})
export class RichTextEditorButton implements OnInit {
  private readonly ctx = injectRte()
  private readonly el = inject(ElementRef<HTMLButtonElement>)

  @Input({ required: true }) command!: RichTextEditorCommand
  @Input() value?: string
  @Input('aria-label') ariaLabel?: string

  ngOnInit(): void {
    const key = this.value ? `${this.command}:${this.value}` : this.command
    this.ctx.machine.setToolbarButtonEl(key, this.el.nativeElement)
  }

  get buttonProps() {
    void this.ctx.tick()
    return this.ctx.machine.getToolbarButtonProps(this.command, this.value)
  }

  onMouseDown(event: MouseEvent): void {
    this.ctx.machine.getToolbarButtonProps(this.command, this.value).onMouseDown(event)
  }

  onClick(): void {
    this.ctx.machine.getToolbarButtonProps(this.command, this.value).onClick()
  }
}

@Component({
  selector: '[fc-rte-toolbar]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RichTextEditorToolbarGroup, RichTextEditorButton],
  template: `
    <div fc-rte-toolbar-group label="Text style">
      <button fc-rte-button command="bold"><strong>B</strong></button>
      <button fc-rte-button command="italic"><em>I</em></button>
    </div>
    <div fc-rte-toolbar-group label="Lists">
      <button fc-rte-button command="insertUnorderedList">•</button>
      <button fc-rte-button command="insertOrderedList">1.</button>
    </div>
    <div fc-rte-toolbar-group label="Headings">
      <button fc-rte-button command="formatBlock" value="p">P</button>
      <button fc-rte-button command="formatBlock" value="h1">H1</button>
      <button fc-rte-button command="formatBlock" value="h2">H2</button>
      <button fc-rte-button command="formatBlock" value="h3">H3</button>
    </div>
    <div fc-rte-toolbar-group label="Insert">
      <button fc-rte-button command="createLink">Link</button>
    </div>
  `,
  host: {
    class: 'fc-rte__toolbar',
    '[attr.role]': 'toolbarProps.role',
    '[attr.aria-label]': 'toolbarProps["aria-label"]',
    '[attr.aria-controls]': 'toolbarProps["aria-controls"]',
    '(keydown)': 'toolbarProps.onKeyDown($event)',
  },
})
export class RichTextEditorToolbar {
  private readonly ctx = injectRte()
  get toolbarProps() {
    return this.ctx.machine.getToolbarProps()
  }
}

@Component({
  selector: '[fc-rte-editor]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    class: 'fc-rte__editor',
    '[attr.id]': 'editorProps.id',
    '[attr.contenteditable]': 'editorProps.contentEditable',
    '[attr.role]': 'editorProps.role',
    '[attr.aria-multiline]': 'editorProps["aria-multiline"]',
    '[attr.aria-label]': 'editorProps["aria-label"]',
    '[attr.aria-disabled]': 'editorProps["aria-disabled"]',
    '[attr.data-placeholder]': 'editorProps["data-placeholder"]',
    '[attr.data-state]': 'editorProps["data-state"]',
    '[attr.spellcheck]': 'editorProps.spellcheck',
    '(input)': 'onInput()',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(keydown)': 'onKeyDown($event)',
  },
})
export class RichTextEditorEditor implements OnInit {
  private readonly ctx = injectRte()
  private readonly el = inject(ElementRef<HTMLDivElement>)

  constructor() {
    afterNextRender(() => this.syncHtml())
  }

  ngOnInit(): void {
    this.ctx.machine.setEditorEl(this.el.nativeElement)
    this.ctx.machine.subscribe(() => this.syncHtml())
    this.syncHtml()
  }

  get editorProps() {
    return this.ctx.machine.getEditorProps()
  }

  onInput(): void {
    this.ctx.machine.getEditorProps().onInput()
  }

  onFocus(): void {
    this.ctx.machine.getEditorProps().onFocus()
  }

  onBlur(): void {
    this.ctx.machine.getEditorProps().onBlur()
  }

  onKeyDown(event: KeyboardEvent): void {
    this.ctx.machine.getEditorProps().onKeyDown(event)
  }

  private syncHtml(): void {
    const editor = this.el.nativeElement
    if (document.activeElement === editor) return
    const value = this.ctx.machine.getValue()
    if (editor.innerHTML !== value) editor.innerHTML = value
  }
}

@Component({
  selector: 'form[fc-rte-link-form]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      class="fc-rte__link-input"
      [attr.type]="inputProps.type"
      [value]="inputProps.value"
      [attr.placeholder]="inputProps.placeholder"
      [disabled]="inputProps.disabled"
      aria-label="Link URL"
      (input)="onLinkInput($event)"
      (keydown)="inputProps.onKeyDown($event)"
    />
    <button class="fc-rte__link-apply" type="submit" [disabled]="inputProps.disabled">Apply</button>
    <button class="fc-rte__link-cancel" type="button" [disabled]="inputProps.disabled" (click)="formProps.onCancel()">
      Cancel
    </button>
  `,
  host: {
    class: 'fc-rte__link-form',
    '[attr.hidden]': 'formProps.hidden ? "" : null',
    '(submit)': 'onSubmit($event)',
  },
})
export class RichTextEditorLinkForm {
  private readonly ctx = injectRte()

  get formProps() {
    return this.ctx.machine.getLinkFormProps()
  }

  get inputProps() {
    return this.ctx.machine.getLinkInputProps()
  }

  onLinkInput(event: Event): void {
    this.ctx.machine.getLinkInputProps().onInput((event.currentTarget as HTMLInputElement).value)
  }

  onSubmit(event: Event): void {
    event.preventDefault()
    this.ctx.machine.getLinkFormProps().onSubmit()
  }
}

@Component({
  selector: 'fc-rte',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RichTextEditorToolbar, RichTextEditorLinkForm, RichTextEditorEditor],
  template: `
    <div fc-rte-toolbar></div>
    <form fc-rte-link-form></form>
    <div fc-rte-editor></div>
  `,
  host: {
    class: 'fc-rte',
    '[attr.data-state]': 'rootProps["data-state"]',
  },
  providers: [{ provide: RICH_TEXT_EDITOR, useExisting: RichTextEditorRoot }],
})
export class RichTextEditorRoot implements OnInit {
  private readonly host = inject(ElementRef<HTMLDivElement>)
  private readonly injector = inject(Injector)

  @Input() defaultValue?: string
  @Input() value?: string
  @Input() placeholder?: string
  @Input() disabled?: boolean
  @Output() change = new EventEmitter<string>()
  @Output() selectionChange = new EventEmitter<string[]>()

  private readonly onChange = injectStableCallback(() => (html: string) => this.change.emit(html))
  private readonly onSelectionChange = injectStableCallback(
    () => (formats: string[]) => this.selectionChange.emit(formats),
  )

  machine!: RichTextEditorMachine
  readonly tick = signal(0)

  ngOnInit(): void {
    const getValue = () => this.value
    const getPlaceholder = () => this.placeholder
    const getDisabled = () => this.disabled
    this.machine = runInInjectionContext(this.injector, () =>
      injectMachine(() =>
        createRichTextEditor({
          defaultValue: this.defaultValue,
          get value() {
            return getValue()
          },
          get placeholder() {
            return getPlaceholder()
          },
          get disabled() {
            return getDisabled()
          },
          onChange: this.onChange,
          onSelectionChange: this.onSelectionChange,
        }),
      ),
    )
    this.machine.setRootEl(this.host.nativeElement)
    this.machine.subscribe(() => this.tick.update((n) => n + 1))
  }

  get rootProps() {
    return this.machine?.getRootProps() ?? { 'data-state': undefined }
  }
}
