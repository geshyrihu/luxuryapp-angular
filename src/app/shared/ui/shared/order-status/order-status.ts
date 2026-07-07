import { Component, computed, input, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

export interface OrderStatusStep {
  label: string;
  date?: string;
  completed: boolean;
  active: boolean;
  icon?: string;
}

@Component({
  selector: "app-order-status",
  standalone: true,
  imports: [CommonModule, AppIcon],
  template: `
    <div class="order-status-root" [class.order-status-vertical]="vertical()">
      @for (step of steps(); track $index; let i = $index) {
        <div class="order-step" [class.order-step-completed]="step.completed" [class.order-step-active]="step.active">
          <div class="order-step-marker">
            @if (step.completed) {
              <div class="order-step-dot order-step-done">
                <app-icon icon="mdi:check" class="text-xs" />
              </div>
            } @else if (step.active) {
              <div class="order-step-dot order-step-current">
                <div class="order-step-pulse"></div>
              </div>
            } @else {
              <div class="order-step-dot order-step-pending"></div>
            }
            @if (!vertical() && !$last) {
              <div class="order-step-line" [class.order-step-line-filled]="step.completed"></div>
            }
          </div>
          <div class="order-step-content">
            <strong class="order-step-label">{{ step.label }}</strong>
            @if (step.date) {
              <span class="order-step-date">{{ step.date }}</span>
            }
          </div>
        </div>
        @if (vertical() && !$last) {
          <div class="order-step-vline" [class.order-step-line-filled]="step.completed"></div>
        }
      }
    </div>
  `,
  styles: [`
    .order-status-root {
      display: flex;
      align-items: flex-start;
      gap: 0;
    }
    .order-status-vertical {
      flex-direction: column;
    }
    .order-step {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      position: relative;
    }
    .order-status-vertical .order-step {
      flex-direction: row;
    }
    .order-step-marker {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }
    .order-step-dot {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      z-index: 1;
    }
    .order-step-done {
      background: var(--ds-success, #006837);
      color: #fff;
    }
    .order-step-current {
      background: var(--ds-primary);
      color: #fff;
    }
    .order-step-pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #fff;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.3); }
    }
    .order-step-pending {
      background: var(--ds-bg-elevated, #f4f5f8);
      border: 2px solid var(--ds-border, #e2e8f0);
    }
    .order-step-line {
      width: 60px;
      height: 2px;
      background: var(--ds-border, #e2e8f0);
      margin: 0 0.25rem;
    }
    .order-step-line-filled {
      background: var(--ds-success, #006837);
    }
    .order-step-vline {
      width: 2px;
      height: 24px;
      background: var(--ds-border, #e2e8f0);
      margin-left: 13px;
    }
    .order-step-content {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      white-space: nowrap;
    }
    .order-status-vertical .order-step-content {
      margin-left: 0.5rem;
    }
    .order-step-label {
      font-size: var(--ds-font-size-table, 0.875rem);
      color: var(--ds-text-primary);
    }
    .order-step-date {
      font-size: var(--ds-font-size-micro, 0.75rem);
      color: var(--ds-text-muted);
    }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class OrderStatus {
  steps = input.required<OrderStatusStep[]>();
  vertical = input<boolean>(false);
}
