import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  signal,
  TemplateRef,
  ViewEncapsulation,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { TreeBase, TreeNode } from "@ui/base/tree.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

@Component({
  selector: "app-tree",

  imports: [NgTemplateOutlet, AppIcon],
  template: `
    <div
      class="app-tree"
      [style.max-height]="scrollHeight()"
      [style.overflow]="scrollHeight() ? 'auto' : null"
    >
      <ng-container
        [ngTemplateOutlet]="nodeList"
        [ngTemplateOutletContext]="{ nodes: value() }"
      />
    </div>

    <ng-template #nodeList let-nodes="nodes">
      <ul class="app-tree-list">
        @for (node of nodes; track $index) {
          <li class="app-tree-node">
            <div class="app-tree-node-row">
              @if (node.children?.length) {
                <button type="button" class="app-tree-toggle" (click)="toggleExpand(node)">
                  <app-icon
                    [icon]="
                      isExpanded(node)
                        ? 'material-symbols-light:keyboard-arrow-down'
                        : 'material-symbols-light:chevron-right'
                    "
                  />
                </button>
              } @else {
                <span class="app-tree-toggle-spacer"></span>
              }
              @if (selectionMode() === "checkbox") {
                <input
                  type="checkbox"
                  class="form-check-input app-tree-checkbox"
                  [checked]="isChecked(node)"
                  [indeterminate]="isPartial(node)"
                  (click)="$event.stopPropagation()"
                  (change)="toggleCheck(node)"
                />
              }
              <div
                class="app-tree-node-content"
                [class.app-tree-node-selected]="isSelectedRow(node)"
                (click)="onNodeClick(node)"
              >
                @if (itemTpl(); as tpl) {
                  <ng-container
                    [ngTemplateOutlet]="tpl"
                    [ngTemplateOutletContext]="{ $implicit: node }"
                  />
                } @else {
                  @if (node.icon) { <app-icon [icon]="node.icon" /> }
                  <span>{{ node.label }}</span>
                }
              </div>
            </div>
            @if (node.children?.length && isExpanded(node)) {
              <div class="app-tree-children">
                <ng-container
                  [ngTemplateOutlet]="nodeList"
                  [ngTemplateOutletContext]="{ nodes: node.children }"
                />
              </div>
            }
          </li>
        }
      </ul>
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
      .app-tree-list { list-style: none; padding-left: 0; margin: 0; }
      .app-tree-children .app-tree-list { padding-left: 1.5rem; }
      .app-tree-node-row { display: flex; align-items: center; gap: 0.25rem; padding: 0.125rem 0; }
      .app-tree-toggle {
        width: 1.25rem; height: 1.25rem; border: 0; background: none; padding: 0;
        display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
      }
      .app-tree-toggle-spacer { width: 1.25rem; flex-shrink: 0; }
      .app-tree-checkbox { flex-shrink: 0; }
      .app-tree-node-content { display: flex; align-items: center; gap: 0.375rem; flex: 1 1 auto; min-width: 0; padding: 0.15rem 0.4rem; border-radius: 6px; cursor: pointer; }
      .app-tree-node-content:hover { background: var(--ds-bg-sunken); }
      .app-tree-node-selected { background: var(--ds-primary-light, #e7f1ff); }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Tree extends TreeBase {
  private itemTpl = contentChild<TemplateRef<unknown>>("default");

  protected expandedSet = signal<Set<TreeNode>>(new Set());

  protected isExpanded(node: TreeNode): boolean {
    return this.expandedSet().has(node) || !!node.expanded;
  }

  protected toggleExpand(node: TreeNode): void {
    this.expandedSet.update((set) => {
      const next = new Set(set);
      if (next.has(node)) next.delete(node);
      else next.add(node);
      return next;
    });
  }

  private selectedSet = computed(() => {
    const sel = this.selection();
    if (Array.isArray(sel)) return new Set(sel);
    return new Set(sel ? [sel] : []);
  });

  protected isChecked(node: TreeNode): boolean {
    return this.selectedSet().has(node);
  }

  protected isSelectedRow(node: TreeNode): boolean {
    return this.selectionMode() !== "checkbox" && this.isChecked(node);
  }

  protected isPartial(node: TreeNode): boolean {
    if (!node.children?.length || this.isChecked(node)) return false;
    return this.hasSelectedDescendant(node);
  }

  private hasSelectedDescendant(node: TreeNode): boolean {
    if (!node.children) return false;
    for (const child of node.children) {
      if (this.selectedSet().has(child) || this.hasSelectedDescendant(child)) return true;
    }
    return false;
  }

  protected onNodeClick(node: TreeNode): void {
    const mode = this.selectionMode();
    if (mode === "checkbox") return;
    if (mode === "single") {
      this.selection.set(node);
    } else if (mode === "multiple") {
      const current: TreeNode[] = Array.isArray(this.selection()) ? [...this.selection()] : [];
      const idx = current.indexOf(node);
      if (idx >= 0) current.splice(idx, 1);
      else current.push(node);
      this.selection.set(current);
    }
  }

  protected toggleCheck(node: TreeNode): void {
    const willCheck = !this.isChecked(node);
    const next = new Set(this.selectedSet());
    this.setDescendantsChecked(node, willCheck, next);
    this.syncAncestors(this.value(), node, next);
    this.selection.set([...next]);
  }

  private setDescendantsChecked(node: TreeNode, checked: boolean, set: Set<TreeNode>): void {
    if (checked) set.add(node);
    else set.delete(node);
    node.children?.forEach((child) => this.setDescendantsChecked(child, checked, set));
  }

  private syncAncestors(roots: TreeNode[], target: TreeNode, set: Set<TreeNode>): void {
    const path = this.findPath(roots, target, []);
    if (!path) return;
    for (let i = path.length - 2; i >= 0; i--) {
      const ancestor = path[i];
      const allChildrenChecked = ancestor.children?.every((c) => set.has(c)) ?? false;
      if (allChildrenChecked) set.add(ancestor);
      else set.delete(ancestor);
    }
  }

  private findPath(nodes: TreeNode[], target: TreeNode, path: TreeNode[]): TreeNode[] | null {
    for (const node of nodes) {
      const newPath = [...path, node];
      if (node === target) return newPath;
      if (node.children) {
        const found = this.findPath(node.children, target, newPath);
        if (found) return found;
      }
    }
    return null;
  }
}
