import { Component, ViewEncapsulation } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { ConfirmDialogBase } from "@ui/base/confirm-dialog.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "ili-confirm-dialog",

  imports: [IonButton, AppIcon],
  template: `
    @if (visible()) {
      <div class="ili-confirm-backdrop" (click)="onCancel()">
        <div class="ili-confirm-sheet" (click)="$event.stopPropagation()">
          <app-icon
            [icon]="config().icon"
            class="ili-confirm-icon"
            [style.color]="config().color"
          />
          <strong class="ili-confirm-title">{{ title() }}</strong>
          <p class="ili-confirm-message">{{ message() }}</p>
          <div class="ili-confirm-actions">
            <ion-button
              expand="block"
              [color]="
                config().severity === 'warn' ? 'warning' : config().severity
              "
              (click)="onConfirm()"
            >
              {{ confirmLabel() }}
            </ion-button>
            <ion-button
              expand="block"
              fill="clear"
              color="medium"
              (click)="onCancel()"
            >
              {{ cancelLabel() }}
            </ion-button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .ili-confirm-backdrop {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        background: var(--ds-bg-overlay, rgba(0, 0, 0, 0.4));
        backdrop-filter: blur(2px);
      }
      .ili-confirm-sheet {
        width: 100%;
        max-width: 480px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 0.75rem;
        padding: 1.5rem 1.25rem calc(1.25rem + env(safe-area-inset-bottom));
        background: var(--ds-bg-surface, #fff);
        border-radius: var(--ds-radius-modal, 12px) var(--ds-radius-modal, 12px)
          0 0;
        box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.15);
      }
      .ili-confirm-icon {
        font-size: 2.75rem;
        line-height: 1;
      }
      .ili-confirm-title {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--ds-text-primary);
      }
      .ili-confirm-message {
        margin: 0;
        font-size: 0.9rem;
        color: var(--ds-text-secondary);
        line-height: 1.5;
      }
      .ili-confirm-actions {
        width: 100%;
        margin-top: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileConfirmDialog extends ConfirmDialogBase {}
