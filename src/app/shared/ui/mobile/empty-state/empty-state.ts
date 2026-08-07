import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { EmptyStateBase } from "@ui/base/empty-state.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "ili-empty-state",

  imports: [IonButton, AppIcon],
  template: `
    <div class="ili-empty-state">
      @if (tag()) {
        <span class="ili-empty-tag">{{ tag() }}</span>
      }
      <app-icon
        [icon]="icon()"
        class="ili-empty-icon"
        [style.color]="iconColor()"
      />
      <strong class="ili-empty-title">{{ title() }}</strong>
      <p class="ili-empty-message">{{ message() }}</p>
      @if (actionLabel()) {
        <ion-button
          [color]="actionSeverity() === 'warn' ? 'warning' : actionSeverity()"
          fill="solid"
          size="small"
          (click)="action.emit()"
        >
          <app-icon [icon]="actionIcon()" slot="start" />
          {{ actionLabel() }}
        </ion-button>
      }
    </div>
  `,
  styles: [
    `
      .ili-empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 0.75rem;
        padding: 2rem 1.25rem;
        min-height: 200px;
      }
      .ili-empty-tag {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--ds-text-muted);
        background: var(--ds-bg-sunken);
        padding: 0.2rem 0.6rem;
        border-radius: var(--ds-radius-full);
      }
      .ili-empty-icon {
        font-size: 3rem;
        line-height: 1;
      }
      .ili-empty-title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--ds-text-primary);
      }
      .ili-empty-message {
        margin: 0;
        font-size: 0.875rem;
        color: var(--ds-text-secondary);
        line-height: 1.5;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileEmptyState extends EmptyStateBase {}
