import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { EmptyStateBase } from "@ui/base/empty-state.base";
import { ButtonModule } from "primeng/button";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-empty-state",

  imports: [ButtonModule, AppIcon],
  template: `
    <div class="empty-state-root">
      <div class="empty-state-content">
        @if (tag()) {
          <span class="empty-state-tag">{{ tag() }}</span>
        }
        <app-icon
          [icon]="icon()"
          class="empty-state-icon"
          [style.color]="iconColor()"
        />
        <strong class="empty-state-title">{{ title() }}</strong>
        <p class="empty-state-message">{{ message() }}</p>
        @if (actionLabel()) {
          <p-button
            [label]="actionLabel()"
            [icon]="actionIcon()"
            [severity]="actionSeverity()"
            (onClick)="action.emit()"
            size="small"
          />
        }
      </div>
    </div>
  `,
  styles: [
    `
      .empty-state-root {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        min-height: 200px;
      }
      .empty-state-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 0.75rem;
        max-width: 360px;
      }
      .empty-state-tag {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--ds-text-muted);
        background: var(--ds-bg-sunken);
        padding: 0.2rem 0.6rem;
        border-radius: var(--ds-radius-full);
      }
      .empty-state-icon {
        font-size: 3rem;
        line-height: 1;
      }
      .empty-state-title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--ds-text-primary);
      }
      .empty-state-message {
        margin: 0;
        font-size: 0.875rem;
        color: var(--ds-text-secondary);
        line-height: 1.5;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class EmptyState extends EmptyStateBase {}
