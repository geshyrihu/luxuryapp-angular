import { CommonModule } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import { TreeBase, TreeNode } from "@ui/core/tree.base";
import { AppIconMobile } from "@ui/mobile/app-icon/app-icon";

@Component({
  selector: "lux-tree-mobile",

  imports: [CommonModule, AppIconMobile],
  template: `
    <div class="lux-tree-mobile">
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
      <div class="lux-tree-mobile-node" [style.paddingLeft.px]="depth * 20 + 8">
        <div class="lux-tree-mobile-node-row" (click)="selectNode(node)">
          @if (!node.leaf && node.children?.length) {
            <button
              class="lux-tree-mobile-node-toggle"
              (click)="toggleNode(node); $event.stopPropagation()"
            >
              <lux-icon-mobile
                [icon]="
                  isExpanded(node) ? 'material-symbols-light:keyboard-arrow-down' : 'material-symbols-light:chevron-right'
                "
              />
            </button>
          } @else {
            <span class="lux-tree-mobile-node-toggle-spacer"></span>
          }

          @if (selectionMode() === "checkbox") {
            <button
              class="lux-tree-mobile-checkbox"
              (click)="toggleCheck(node); $event.stopPropagation()"
            >
              <lux-icon-mobile
                [icon]="
                  isChecked(node)
                    ? 'material-symbols-light:check-box'
                    : isPartialChecked(node)
                      ? 'material-symbols-light:remove'
                      : 'material-symbols-light:check-box-outline-blank'
                "
              />
            </button>
          }

          @if (node.icon) {
            <lux-icon-mobile [icon]="node.icon" class="lux-tree-mobile-node-icon" />
          }

          <span
            class="lux-tree-mobile-node-label"
            [class.lux-tree-mobile-node-selected]="isSelected(node)"
          >
            {{ node.label }}
          </span>
        </div>

        @if (isExpanded(node) && node.children?.length) {
          <div class="lux-tree-mobile-node-children">
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
      .lux-tree-mobile {
        width: 100%;
      }
      .lux-tree-mobile-node {
        padding: 0.125rem 0;
      }
      .lux-tree-mobile-node-row {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.375rem 0.5rem;
        cursor: pointer;
        border-radius: var(--ds-radius-md);
        transition: background 0.15s;
      }
      .lux-tree-mobile-node-row:hover {
        background: var(--ds-bg-muted);
      }
      .lux-tree-mobile-node-toggle {
        display: flex;
        align-items: center;
        border: none;
        background: none;
        cursor: pointer;
        padding: 0;
        color: var(--ds-text-secondary);
        font-size: 1rem;
      }
      .lux-tree-mobile-node-toggle-spacer {
        display: inline-block;
        width: 1.25rem;
      }
      .lux-tree-mobile-checkbox {
        display: flex;
        align-items: center;
        border: none;
        background: none;
        cursor: pointer;
        padding: 0;
        color: var(--ds-primary);
        font-size: 1.125rem;
      }
      .lux-tree-mobile-node-icon {
        font-size: 1rem;
        color: var(--ds-text-secondary);
      }
      .lux-tree-mobile-node-label {
        font-size: var(--ds-font-size-body);
        color: var(--ds-text-primary);
        flex: 1;
      }
      .lux-tree-mobile-node-selected {
        font-weight: 600;
        color: var(--ds-primary);
      }
      .lux-tree-mobile-node-children {
        border-left: 1px solid var(--ds-border);
        margin-left: 0.75rem;
        padding-left: 0.5rem;
      }
    `],
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

