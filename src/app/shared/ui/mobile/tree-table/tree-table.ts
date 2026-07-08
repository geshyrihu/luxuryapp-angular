import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonProgressBar,
} from "@ionic/angular/standalone";
import { TreeNodeBase, TreeTableBase } from "@ui/base/tree-table.base";
import { MobileEmptyState } from "@ui/mobile/empty-state/empty-state";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "ili-tree-table",

  imports: [
    CommonModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonProgressBar,
    AppIcon,
    MobileEmptyState,
  ],
  template: `
    <div class="ili-tree-table-root">
      @if (headerTitle()) {
        <div class="ili-tree-table-header">
          <strong>{{ headerTitle() }}</strong>
        </div>
      }

      @if (loading()) {
        <ion-progress-bar type="indeterminate" />
      }

      @if (nodes().length === 0 && !loading()) {
        <ili-empty-state
          icon="mdi:file-tree-outline"
          [title]="'Sin datos'"
          [message]="emptyMessage()"
        />
      }

      <div class="ili-tree-table-nodes">
        @for (node of nodes(); track node.key || $index) {
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
          <div class="ili-tree-node-row" (click)="toggleNode(node)">
            @if (!node.leaf) {
              <ion-button
                fill="clear"
                size="small"
                class="ili-tree-node-toggle"
              >
                <app-icon
                  [icon]="
                    node.expanded ? 'mdi:chevron-down' : 'mdi:chevron-right'
                  "
                />
              </ion-button>
            } @else {
              <span class="ili-tree-node-toggle-spacer"></span>
            }

            @if (node.icon) {
              <app-icon [icon]="node.icon" class="ili-tree-node-icon" />
            }

            <span
              class="ili-tree-node-label"
              [class.ili-tree-node-selectable]="node.selectable !== false"
              (click)="selectNode(node)"
            >
              {{ node.label || node.data?.[columns()?.[0]?.field] }}
            </span>
          </div>

          @if (node.expanded && node.children?.length) {
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
    </div>
  `,
  styles: [
    `
      .ili-tree-table-root {
        width: 100%;
      }
      .ili-tree-table-header {
        padding: 0.75rem 0.5rem;
        font-size: var(--ds-font-size-section-title, 1rem);
        color: var(--ds-text-primary);
      }
      .ili-tree-table-nodes {
        padding: 0.25rem 0;
      }
      .ili-tree-node {
        padding: 0.25rem 0;
      }
      .ili-tree-node-row {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.375rem 0;
        cursor: pointer;
        border-radius: var(--ds-radius-md, 8px);
      }
      .ili-tree-node-row:hover {
        background: var(--ds-bg-muted, #f1f5f9);
      }
      .ili-tree-node-toggle {
        --padding-start: 0;
        --padding-end: 0;
        min-height: 1.5rem;
      }
      .ili-tree-node-toggle-spacer {
        display: inline-block;
        width: 2rem;
      }
      .ili-tree-node-icon {
        font-size: 1.125rem;
        color: var(--ds-text-secondary, #64748b);
        margin-right: 0.25rem;
      }
      .ili-tree-node-label {
        font-size: 0.875rem;
        color: var(--ds-text-primary);
      }
      .ili-tree-node-selectable {
        cursor: pointer;
        font-weight: 500;
      }
      .ili-tree-node-children {
        margin-left: 0.5rem;
        border-left: 1px solid var(--ds-border, #e2e8f0);
        padding-left: 0.5rem;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileTreeTable extends TreeTableBase {
  toggleNode(node: TreeNodeBase): void {
    if (node.leaf) return;
    node.expanded = !node.expanded;
    if (node.expanded) {
      this.nodeExpand.emit(node);
    } else {
      this.nodeCollapse.emit(node);
    }
  }

  selectNode(node: TreeNodeBase): void {
    if (node.selectable === false) return;
    if (this.selectionMode() === "single") {
      this.selection.set(node);
      this.nodeSelect.emit(node);
    } else if (
      this.selectionMode() === "multiple" ||
      this.selectionMode() === "checkbox"
    ) {
      const current = this.selection() || [];
      const exists = current.find(
        (s: any) => (s.key || s.data) === (node.key || node.data),
      );
      if (exists) {
        this.selection.set(
          current.filter(
            (s: any) => (s.key || s.data) !== (node.key || node.data),
          ),
        );
        this.nodeUnselect.emit(node);
      } else {
        this.selection.set([...current, node]);
        this.nodeSelect.emit(node);
      }
    }
  }
}
