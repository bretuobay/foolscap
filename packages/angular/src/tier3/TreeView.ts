import { NgTemplateOutlet } from '@angular/common'
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
  createTreeView,
  type TreeView as TreeViewMachine,
  type TreeViewItem,
  type TreeViewSelectionMode,
} from '@web-loom/foolscap-core'
import { injectMachine } from '../bindings/inject-machine'
import { injectStableCallback } from '../bindings/inject-stable-callback'

export type { TreeViewItem, TreeViewSelectionMode }

export const TREE_VIEW = new InjectionToken<TreeViewRoot>('fc-tree-view')

function injectTreeView(): TreeViewRoot {
  const ctx = inject(TREE_VIEW, { optional: true })
  if (!ctx) throw new Error('TreeView components must be used inside TreeViewRoot')
  return ctx
}

export interface TreeViewRootProps {
  items: TreeViewItem[]
  expandedIds?: string[]
  defaultExpandedIds?: string[]
  selectedId?: string | null
  defaultSelectedId?: string | null
  selectionMode?: TreeViewSelectionMode
  label?: string
}

export interface TreeViewItemProps {
  item: TreeViewItem
}

@Component({
  selector: '[fc-tree-label]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'fc-tree__label' },
})
export class TreeViewLabel {
  readonly kind = 'label'
}

@Component({
  selector: 'button[fc-tree-toggle]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span aria-hidden="true">{{ expanded ? '▾' : '▸' }}</span>`,
  host: {
    class: 'fc-tree__toggle',
    '[attr.type]': 'toggleProps.type',
    '[attr.tabindex]': 'toggleProps.tabIndex',
    '[attr.aria-label]': 'toggleProps["aria-label"]',
    '(click)': 'onClick($event)',
  },
})
export class TreeViewToggle {
  private readonly ctx = injectTreeView()
  @Input({ required: true }) item!: TreeViewItem

  get toggleProps() {
    return this.ctx.machine.getToggleProps(this.item.id)
  }

  get expanded() {
    return this.ctx.machine.getItemProps(this.item.id, true)['aria-expanded']
  }

  onClick(event: Event): void {
    event.stopPropagation()
    this.ctx.machine.getToggleProps(this.item.id).onClick()
  }
}

@Component({
  selector: '[fc-tree-item-content]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TreeViewToggle, TreeViewLabel],
  template: `
    @if (item.children?.length) {
      <button fc-tree-toggle [item]="item"></button>
    } @else {
      <span class="fc-tree__spacer" aria-hidden="true"></span>
    }
    <span fc-tree-label>{{ item.label }}</span>
  `,
  host: { class: 'fc-tree__item-content' },
})
export class TreeViewItemContent {
  @Input({ required: true }) item!: TreeViewItem
}

@Component({
  selector: 'ul[fc-tree-group]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'fc-tree__group',
    '[attr.role]': 'groupProps.role',
    '[attr.hidden]': 'groupProps.hidden ? "" : null',
  },
})
export class TreeViewGroup {
  private readonly ctx = injectTreeView()
  @Input({ required: true }) parent!: TreeViewItem

  get groupProps() {
    return this.ctx.machine.getGroupProps(this.parent.id)
  }
}

@Component({
  selector: 'ul[fc-tree], fc-tree',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, TreeViewItemContent, TreeViewGroup],
  template: `
    <ng-template #node let-item>
      <li
        class="fc-tree__item"
        [attr.role]="itemProps(item).role"
        [attr.id]="itemProps(item).id"
        [attr.aria-label]="itemProps(item)['aria-label']"
        [attr.tabindex]="itemProps(item).tabIndex"
        [attr.aria-expanded]="itemProps(item)['aria-expanded']"
        [attr.aria-selected]="itemProps(item)['aria-selected']"
        [attr.aria-disabled]="itemProps(item)['aria-disabled']"
        [attr.aria-level]="itemProps(item)['aria-level']"
        [attr.data-state]="itemProps(item)['data-state']"
        [attr.data-disabled]="itemProps(item)['data-disabled']"
        [attr.data-item-id]="item.id"
        (click)="onItemClick(item, $event)"
        (keydown)="onItemKeyDown(item, $event)"
      >
        <div fc-tree-item-content [item]="item"></div>
        @if (item.children?.length) {
          <ul fc-tree-group [parent]="item">
            @for (child of item.children; track child.id) {
              <ng-container *ngTemplateOutlet="node; context: { $implicit: child }" />
            }
          </ul>
        }
      </li>
    </ng-template>
    @for (item of items; track item.id) {
      <ng-container *ngTemplateOutlet="node; context: { $implicit: item }" />
    }
  `,
  host: {
    class: 'fc-tree',
    '[attr.role]': 'rootProps.role',
    '[attr.aria-label]': 'label',
  },
  providers: [{ provide: TREE_VIEW, useExisting: TreeViewRoot }],
})
export class TreeViewRoot implements OnInit {
  private readonly host = inject(ElementRef<HTMLUListElement>)
  private readonly injector = inject(Injector)

  @Input({ required: true }) items: TreeViewItem[] = []
  @Input() expandedIds?: string[]
  @Input() defaultExpandedIds?: string[]
  @Input() selectedId?: string | null
  @Input() defaultSelectedId?: string | null
  @Input() selectionMode: TreeViewSelectionMode = 'single'
  @Input() label = 'Tree'
  @Output() expandedChange = new EventEmitter<string[]>()
  @Output() selectionChange = new EventEmitter<string | null>()

  private readonly onExpandedChange = injectStableCallback(
    () => (ids: string[]) => this.expandedChange.emit(ids),
  )
  private readonly onSelectionChange = injectStableCallback(
    () => (id: string | null) => this.selectionChange.emit(id),
  )

  machine!: TreeViewMachine
  readonly tick = signal(0)

  constructor() {
    afterNextRender(() => this.registerItems())
  }

  ngOnInit(): void {
    const getItems = () => this.items
    const getExpandedIds = () => this.expandedIds
    const getSelectedId = () => this.selectedId
    const getSelectionMode = () => this.selectionMode
    const getLabel = () => this.label
    this.machine = runInInjectionContext(this.injector, () =>
      injectMachine(() =>
        createTreeView({
          get items() {
            return getItems()
          },
          get expandedIds() {
            return getExpandedIds()
          },
          defaultExpandedIds: this.defaultExpandedIds,
          get selectedId() {
            return getSelectedId()
          },
          defaultSelectedId: this.defaultSelectedId,
          get selectionMode() {
            return getSelectionMode()
          },
          get label() {
            return getLabel()
          },
          onExpandedChange: this.onExpandedChange,
          onSelectionChange: this.onSelectionChange,
        }),
      ),
    )
    this.machine.setRootEl(this.host.nativeElement)
    this.machine.subscribe(() => {
      this.tick.update((n) => n + 1)
      queueMicrotask(() => this.registerItems())
    })
  }

  get rootProps() {
    return this.machine?.getRootProps() ?? { role: 'tree', 'aria-label': this.label }
  }

  itemProps(item: TreeViewItem) {
    void this.tick()
    return this.machine.getItemProps(item.id, Boolean(item.children?.length))
  }

  onItemClick(item: TreeViewItem, event: Event): void {
    event.stopPropagation()
    this.machine.getItemProps(item.id, Boolean(item.children?.length)).onClick()
  }

  onItemKeyDown(item: TreeViewItem, event: KeyboardEvent): void {
    event.stopPropagation()
    this.machine.getItemProps(item.id, Boolean(item.children?.length)).onKeyDown(event)
  }

  private registerItems(): void {
    this.host.nativeElement.querySelectorAll('.fc-tree__item').forEach((node: Element) => {
      const id = node.getAttribute('data-item-id')
      if (id && node instanceof HTMLLIElement) this.machine.setItemEl(id, node)
    })
  }
}

@Component({
  selector: 'li[fc-tree-item]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'fc-tree__item' },
})
export class TreeViewItemView {
  @Input({ required: true }) item!: TreeViewItem
}
