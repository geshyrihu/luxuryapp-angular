import { Component, computed, input, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";

export interface ApprovalNode {
  id: string;
  label: string;
  status: "pending" | "approved" | "rejected" | "skip";
  assignee?: string;
  date?: string;
  comment?: string;
  icon?: string;
}

@Component({
  selector: "app-approval-workflow",
  standalone: true,
  imports: [CommonModule, AppIcon],
  template: `
    <div class="approval-root">
      @for (node of nodes(); track node.id; let i = $index) {
        <div class="approval-node" [class]="'approval-' + node.status">
          <div class="approval-node-marker">
            <div class="approval-dot" [class]="'approval-dot-' + node.status">
              <app-icon [icon]="statusIcon(node.status)" class="text-xs" />
            </div>
            @if (i < nodes().length - 1) {
              <div class="approval-connector" [class.approval-connector-done]="node.status === 'approved'"></div>
            }
          </div>
          <div class="approval-node-card">
            <div class="approval-node-header">
              <strong>{{ node.label }}</strong>
              <span class="approval-badge" [class]="'approval-badge-' + node.status">
                {{ statusLabel(node.status) }}
              </span>
            </div>
            @if (node.assignee) {
              <span class="approval-assignee">{{ node.assignee }}</span>
            }
            @if (node.date) {
              <span class="approval-date">{{ node.date }}</span>
            }
            @if (node.comment) {
              <p class="approval-comment">{{ node.comment }}</p>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .approval-root {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    .approval-node {
      display: flex;
      gap: 0.75rem;
    }
    .approval-node-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      width: 32px;
    }
    .approval-dot {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }
    .approval-dot-approved {
      background: var(--ds-success, #006837);
      color: #fff;
    }
    .approval-dot-rejected {
      background: var(--ds-danger, #ba1a1a);
      color: #fff;
    }
    .approval-dot-pending {
      background: var(--ds-bg-elevated, #f4f5f8);
      border: 2px solid var(--ds-border, #e2e8f0);
      color: var(--ds-text-muted);
    }
    .approval-dot-skip {
      background: var(--ds-bg-elevated, #f4f5f8);
      border: 2px dashed var(--ds-border, #e2e8f0);
      color: var(--ds-text-muted);
    }
    .approval-connector {
      width: 2px;
      flex: 1;
      min-height: 16px;
      background: var(--ds-border, #e2e8f0);
    }
    .approval-connector-done {
      background: var(--ds-success, #006837);
    }
    .approval-node-card {
      flex: 1;
      background: var(--ds-bg-surface, #ffffff);
      border: 1px solid var(--ds-border, #e2e8f0);
      border-radius: var(--ds-radius-lg, 8px);
      padding: 0.625rem 0.75rem;
      margin-bottom: 0.75rem;
    }
    .approval-node-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      font-size: var(--ds-font-size-body, 0.9375rem);
      color: var(--ds-text-primary);
    }
    .approval-badge {
      font-size: var(--ds-font-size-micro, 0.75rem);
      padding: 0.125rem 0.5rem;
      border-radius: var(--ds-radius-pill, 999px);
      font-weight: 500;
      text-transform: capitalize;
    }
    .approval-badge-approved {
      background: color-mix(in srgb, var(--ds-success) 15%, transparent);
      color: var(--ds-success);
    }
    .approval-badge-rejected {
      background: color-mix(in srgb, var(--ds-danger) 15%, transparent);
      color: var(--ds-danger);
    }
    .approval-badge-pending {
      background: color-mix(in srgb, var(--ds-warning) 15%, transparent);
      color: var(--ds-warning);
    }
    .approval-badge-skip {
      background: var(--ds-bg-elevated, #f4f5f8);
      color: var(--ds-text-muted);
    }
    .approval-assignee,
    .approval-date {
      display: block;
      font-size: var(--ds-font-size-help, 0.8125rem);
      color: var(--ds-text-muted);
      margin-top: 0.125rem;
    }
    .approval-comment {
      margin: 0.25rem 0 0;
      font-size: var(--ds-font-size-table, 0.875rem);
      color: var(--ds-text-secondary);
      font-style: italic;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class ApprovalWorkflow {
  nodes = input.required<ApprovalNode[]>();

  statusIcon(status: string): string {
    switch (status) {
      case "approved": return "mdi:check-circle";
      case "rejected": return "mdi:close-circle";
      case "skip": return "mdi:minus-circle";
      default: return "mdi:circle-outline";
    }
  }

  statusLabel(status: string): string {
    switch (status) {
      case "approved": return "Aprobado";
      case "rejected": return "Rechazado";
      case "skip": return "Saltado";
      default: return "Pendiente";
    }
  }
}
