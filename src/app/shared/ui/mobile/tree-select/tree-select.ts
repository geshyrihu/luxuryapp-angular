import { Component, ViewEncapsulation, signal } from "@angular/core";
import { TreeSelectBase } from "@ui/base/tree-select.base";

@Component({
  selector: "ili-tree-select",

  imports: [],
  template: `
    <div class="ili-tree-select-root">
      <button class="ili-tree-select-trigger" (click)="toggleOpen()">
        <span class="ili-tree-select-label">{{ displayText() }}</span>
        <app-icon icon="mdi:chevron-down" />
      </button>
      @if (isOpen()) {
        <div class="ili-tree-select-overlay">
          <div class="ili-tree-select-header">
            <app-icon icon="mdi:close" (click)="close()" />
          </div>
          <div class="ili-tree-select-tree">
            @for (node of options(); track $index) {
              @if (selectionMode() === "checkbox") {
                <div class="ili-tree-select-node">
                  <label class="ili-tree-select-checkbox-row">
                    <input
                      type="checkbox"
                      [checked]="isChecked(node)"
                      (change)="toggleNode(node)"
                    />
                    <span>{{ getLabel(node) }}</span>
                  </label>
                  @if (node.children) {
                    <div class="ili-tree-select-children">
                      @for (child of node.children; track $index) {
                        <label class="ili-tree-select-checkbox-row">
                          <input
                            type="checkbox"
                            [checked]="isChecked(child)"
                            (change)="toggleNode(child)"
                          />
                          <span>{{ getLabel(child) }}</span>
                        </label>
                      }
                    </div>
                  }
                </div>
              } @else {
                <div
                  class="ili-tree-select-node-item"
                  (click)="selectNode(node)"
                >
                  <span>{{ getLabel(node) }}</span>
                  @if (node.children) {
                    <app-icon icon="mdi:chevron-right" />
                  }
                </div>
                @if (node.children && expandedNode() === node) {
                  <div class="ili-tree-select-children">
                    @for (child of node.children; track $index) {
                      <div
                        class="ili-tree-select-node-item ili-tree-select-child"
                        (click)="selectNode(child)"
                      >
                        <span>{{ getLabel(child) }}</span>
                      </div>
                    }
                  </div>
                }
              }
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .ili-tree-select-root {
        position: relative;
        width: 100%;
      }
      .ili-tree-select-trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0.625rem 0.75rem;
        background: var(--ds-bg-surface, #fff);
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-md, 6px);
        color: var(--ds-text-primary, #1e293b);
        font-size: var(--ds-font-size-body, 0.875rem);
        cursor: pointer;
      }
      .ili-tree-select-label {
        color: var(--ds-text-muted, #94a3b8);
      }
      .ili-tree-select-overlay {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 100;
        background: var(--ds-bg-surface, #fff);
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-md, 6px);
        box-shadow: var(--ds-shadow-lg, 0 10px 15px rgba(0, 0, 0, 0.1));
        max-height: 300px;
        overflow-y: auto;
      }
      .ili-tree-select-header {
        padding: 0.5rem;
        border-bottom: 1px solid var(--ds-border, #e2e8f0);
        display: flex;
        justify-content: flex-end;
      }
      .ili-tree-select-tree {
        padding: 0.25rem 0;
      }
      .ili-tree-select-node-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 0.75rem;
        cursor: pointer;
        font-size: var(--ds-font-size-body, 0.875rem);
        color: var(--ds-text-primary, #1e293b);
      }
      .ili-tree-select-node-item:hover {
        background: var(--ds-bg-hover, #f1f5f9);
      }
      .ili-tree-select-child {
        padding-left: 1.5rem;
      }
      .ili-tree-select-children {
        border-left: 1px solid var(--ds-border, #e2e8f0);
        margin-left: 0.75rem;
      }
      .ili-tree-select-checkbox-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        cursor: pointer;
        font-size: var(--ds-font-size-body, 0.875rem);
        color: var(--ds-text-primary, #1e293b);
      }
      .ili-tree-select-checkbox-row input[type="checkbox"] {
        accent-color: var(--ds-primary, #003d9b);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileTreeSelect extends TreeSelectBase {
  protected isOpen = signal(false);
  protected expandedNode = signal<any>(null);
  protected selectedNodes = signal<any[]>([]);

  protected toggleOpen(): void {
    this.isOpen.update((v) => !v);
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  protected getLabel(node: any): string {
    if (!node) return "";
    return node.label ?? node.name ?? String(node);
  }

  protected selectNode(node: any): void {
    if (node.children && this.expandedNode() !== node) {
      this.expandedNode.set(node);
    } else if (node.children) {
      this.expandedNode.set(null);
    } else {
      if (this.selectionMode() === "multiple") {
        const idx = this.selectedNodes().indexOf(node);
        if (idx >= 0) {
          this.selectedNodes.update((v) => v.filter((_, i) => i !== idx));
        } else {
          this.selectedNodes.update((v) => [...v, node]);
        }
        this.value.set(this.selectedNodes());
      } else {
        this.value.set(node);
        this.isOpen.set(false);
      }
    }
  }

  protected toggleNode(node: any): void {
    const idx = this.selectedNodes().indexOf(node);
    if (idx >= 0) {
      this.selectedNodes.update((v) => v.filter((_, i) => i !== idx));
    } else {
      this.selectedNodes.update((v) => [...v, node]);
    }
    this.value.set(this.selectedNodes());
  }

  protected isChecked(node: any): boolean {
    return this.selectedNodes().includes(node);
  }

  protected displayText(): string {
    const v = this.value();
    if (!v) return "Seleccionar...";
    if (Array.isArray(v)) {
      return v.length > 0 ? `${v.length} seleccionados` : "Seleccionar...";
    }
    return this.getLabel(v);
  }
}
