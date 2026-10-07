import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { IonButton } from "@ionic/angular";
import { EmptyStateBase } from "@ui/core/empty-state.base";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "lux-empty-state-mobile",

  imports: [IonButton, AppIcon],
  template: `
    <div class="lux-empty-state-mobile">
      @if (tag()) {
        <span class="lux-empty-state-mobile-tag">{{ tag() }}</span>
      }
      <lux-icon-base
        [icon]="icon()"
        class="lux-empty-state-mobile-icon"
        [style.color]="iconColor()"
      />
      <strong class="lux-empty-state-mobile-title">{{ title() }}</strong>
      <p class="lux-empty-state-mobile-message">{{ message() }}</p>
      @if (actionLabel()) {
        <ion-button
          [color]="actionSeverity() === 'warn' ? 'warning' : actionSeverity()"
          fill="solid"
          size="small"
          (click)="action.emit()"
        >
          <lux-icon-base [icon]="actionIcon()" class="me-2" />
          {{ actionLabel() }}
        </ion-button>
      }
    </div>
  `,
  styles: [
    `
      .lux-empty-state-mobile {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 0.75rem;
        padding: 2rem 1.25rem;
        min-height: 200px;
      }
      .lux-empty-state-mobile-tag {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--ds-text-muted);
        background: var(--ds-bg-sunken);
        padding: 0.2rem 0.6rem;
        border-radius: var(--ds-radius-full);
      }
      .lux-empty-state-mobile-icon {
        font-size: 3rem;
        line-height: 1;
      }
      .lux-empty-state-mobile-title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--ds-text-primary);
      }
      .lux-empty-state-mobile-message {
        margin: 0;
        font-size: 0.875rem;
        color: var(--ds-text-secondary);
        line-height: 1.5;
      }
    `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileEmptyState extends EmptyStateBase {}

