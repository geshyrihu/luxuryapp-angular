import { CommonModule } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import { TreeBase, TreeNode } from "@ui/base/tree.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "ili-tree",

  imports: [CommonModule, AppIcon],
  template: `
    <div class="ili-tree">
      @for (node of value(); track node.key || $index) {
        <ng-container
          *ngTemplateOutlet="
            nodeTemplate;
            context: { $implicit: node, depth: 0 }
          "
        />
      }
    </div>

    <ng-template #nodeTemplate let-node let-depth="depth">
      <div class="ili-tree-node" [style.paddingLeft.px]="depth * 20 + 8">
        <div class="ili-tree-node-row" (click)="selectNode(node)">
          @if (!node.leaf && node.children?.length) {
            <button
              class="ili-tree-node-toggle"
              (click)="toggleNode(node); $event.stopPropagation()"
            >
              <app-icon
                [icon]="
                  isExpanded(node) ? 'mdi:chevron-down' : 'mdi:chevron-right'
                "
              />
            </button>
          } @else {
            <span class="ili-tree-node-toggle-spacer"></span>
          }

          @if (selectionMode() === "checkbox") {
            <button
              class="ili-tree-checkbox"
              (click)="toggleCheck(node); $event.stopPropagation()"
            >
              <app-icon
                [icon]="
                  isChecked(node)
                    ? 'mdi:checkbox-marked'
                    : isPartialChecked(node)
                      ? 'mdi:minus-box'
                      : 'mdi:checkbox-blank-outline'
                "
              />
            </button>
          }

          @if (node.icon) {
            <app-icon [icon]="node.icon" class="ili-tree-node-icon" />
          }

          <span
            class="ili-tree-node-label"
            [class.ili-tree-node-selected]="isSelected(node)"
          >
            {{ node.label }}
          </span>
        </div>

        @if (isExpanded(node) && node.children?.length) {
          <div class="ili-tree-node-children">
            @for (child of node.children; track child.key || $index) {
              <ng-container
                *ngTemplateOutlet="
                  nodeTemplate;
                  context: { $implicit: child, depth: depth + 1 }
                "
              />
            }
          </div>
        }
      </div>
    </ng-template>
  `,
  styles: [
    `
      .ili-tree {
        width: 100%;
      }
      .ili-tree-node {
        padding: 0.125rem 0;
      }
      .ili-tree-node-row {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.375rem 0.5rem;
        cursor: pointer;
        border-radius: var(--ds-radius-md, 8px);
        transition: background 0.15s;
      }
      .ili-tree-node-row:hover {
        background: var(--ds-bg-muted, #f1f5f9);
      }
      .ili-tree-node-toggle {
        display: flex;
        align-items: center;
        border: none;
        background: none;
        cursor: pointer;
        padding: 0;
        color: var(--ds-text-secondary);
        font-size: 1rem;
      }
      .ili-tree-node-toggle-spacer {
        display: inline-block;
        width: 1.25rem;
      }
      .ili-tree-checkbox {
        display: flex;
        align-items: center;
        border: none;
        background: none;
        cursor: pointer;
        padding: 0;
        color: var(--ds-primary, #003d9b);
        font-size: 1.125rem;
      }
      .ili-tree-node-icon {
        font-size: 1rem;
        color: var(--ds-text-secondary);
      }
      .ili-tree-node-label {
        font-size: var(--ds-font-size-body, 0.9375rem);
        color: var(--ds-text-primary);
        flex: 1;
      }
      .ili-tree-node-selected {
        font-weight: 600;
        color: var(--ds-primary, #003d9b);
      }
      .ili-tree-node-children {
        border-left: 1px solid var(--ds-border, #e2e8f0);
        margin-left: 0.75rem;
        padding-left: 0.5rem;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileTree extends TreeBase {
  private expanded = signal<Set<TreeNode>>(new Set());
  private checked = signal<Set<TreeNode>>(new Set());

  isExpanded(node: TreeNode): boolean {
    return this.expanded().has(node);
  }

  toggleNode(node: TreeNode): void {
    const set = new Set(this.expanded());
    if (set.has(node)) set.delete(node);
    else set.add(node);
    this.expanded.set(set);
  }

  isSelected(node: TreeNode): boolean {
    const sel = this.selection();
    if (!sel) return false;
    if (this.selectionMode() === "single") return sel === node;
    if (Array.isArray(sel))
      return sel.some(
        (s: any) => (s.key || s.label) === (node.key || node.label),
      );
    return false;
  }

  selectNode(node: TreeNode): void {
    if (node.selectable === false) return;
    if (this.selectionMode() === "single") {
      this.selection.set(node);
    } else if (this.selectionMode() === "multiple") {
      const current: any[] = Array.isArray(this.selection())
        ? this.selection()
        : [];
      const exists = current.some(
        (s: any) => (s.key || s.label) === (node.key || node.label),
      );
      if (exists) {
        this.selection.set(
          current.filter(
            (s: any) => (s.key || s.label) !== (node.key || node.label),
          ),
        );
      } else {
        this.selection.set([...current, node]);
      }
    }
  }

  isChecked(node: TreeNode): boolean {
    return this.checked().has(node);
  }

  isPartialChecked(node: TreeNode): boolean {
    if (!node.children?.length) return false;
    const allChecked = node.children.every((c) => this.checked().has(c));
    const someChecked = node.children.some(
      (c) => this.checked().has(c) || this.isPartialChecked(c),
    );
    return !allChecked && someChecked;
  }

  toggleCheck(node: TreeNode): void {
    const set = new Set(this.checked());
    if (set.has(node)) set.delete(node);
    else set.add(node);
    if (node.children) this.toggleChildrenCheck(node, set.has(node), set);
    this.checked.set(set);
    this.selection.set(Array.from(set));
  }

  private toggleChildrenCheck(
    node: TreeNode,
    checked: boolean,
    set: Set<TreeNode>,
  ): void {
    for (const child of node.children || []) {
      if (checked) set.add(child);
      else set.delete(child);
      if (child.children) this.toggleChildrenCheck(child, checked, set);
    }
  }
}
