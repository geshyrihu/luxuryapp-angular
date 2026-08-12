import { CommonModule } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import { OrgChartBase, OrgChartNode } from "@ui/base/org-chart.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "ili-org-chart",

  imports: [CommonModule, AppIcon],
  template: `
    <div class="ili-org-chart">
      @for (node of value(); track $index) {
        <ng-container
          *ngTemplateOutlet="
            nodeTemplate;
            context: { $implicit: node, depth: 0 }
          "
        />
      }
    </div>

    <ng-template #nodeTemplate let-node let-depth="depth">
      <div class="ili-org-node" [style.marginLeft.px]="depth * 24">
        <div
          class="ili-org-node-row"
          [class.ili-org-node-selected]="selection() === node"
          (click)="selectNode(node)"
        >
          @if (node.children?.length) {
            <button
              class="ili-org-node-toggle"
              (click)="toggleNode(node); $event.stopPropagation()"
            >
              <app-icon
                [icon]="
                  isExpanded(node) ? 'material-symbols-light:keyboard-arrow-down' : 'material-symbols-light:chevron-right'
                "
              />
            </button>
          } @else {
            <span class="ili-org-node-toggle-spacer"></span>
          }
          <div class="ili-org-node-content">
            <span class="ili-org-node-label">{{ node.label }}</span>
            @if (node.type) {
              <span class="ili-org-node-type">{{ node.type }}</span>
            }
          </div>
        </div>
        @if (isExpanded(node) && node.children?.length) {
          <div class="ili-org-node-children">
            @for (child of node.children; track $index) {
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
      .ili-org-chart {
        width: 100%;
      }
      .ili-org-node {
        padding: 0.25rem 0;
      }
      .ili-org-node-row {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.625rem 0.75rem;
        border-radius: var(--ds-radius-md);
        border: 1px solid var(--ds-border);
        background: var(--ds-bg-primary);
        cursor: pointer;
        transition:
          background 0.15s,
          border-color 0.15s;
      }
      .ili-org-node-row:active {
        background: var(--ds-bg-muted);
      }
      .ili-org-node-selected {
        border-color: var(--ds-primary);
        background: var(--ds-bg-elevated);
      }
      .ili-org-node-toggle {
        display: flex;
        align-items: center;
        border: none;
        background: none;
        cursor: pointer;
        padding: 0;
        color: var(--ds-text-secondary);
        font-size: 1.125rem;
      }
      .ili-org-node-toggle-spacer {
        display: inline-block;
        width: 1.25rem;
      }
      .ili-org-node-content {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }
      .ili-org-node-label {
        font-size: var(--ds-font-size-body);
        font-weight: 500;
        color: var(--ds-text-primary);
      }
      .ili-org-node-type {
        font-size: var(--ds-font-size-help);
        color: var(--ds-text-secondary);
      }
      .ili-org-node-children {
        border-left: 1px solid var(--ds-border);
        margin-left: 0.75rem;
        padding-left: 1rem;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileOrgChart extends OrgChartBase {
  private expanded = signal<Set<OrgChartNode>>(new Set());

  isExpanded(node: OrgChartNode): boolean {
    return this.expanded().has(node);
  }

  toggleNode(node: OrgChartNode): void {
    const set = new Set(this.expanded());
    if (set.has(node)) set.delete(node);
    else set.add(node);
    this.expanded.set(set);
  }

  selectNode(node: OrgChartNode): void {
    this.selection.set(node);
  }
}
