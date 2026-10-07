import { Component, ViewEncapsulation } from "@angular/core";
import { IonButton } from "@ionic/angular";
import { ConfirmDialogBase } from "@ui/core/confirm-dialog.base";
import { AppIconMobile } from "@ui/mobile/app-icon/app-icon";

@Component({
  selector: "lux-confirm-dialog-mobile",

  imports: [IonButton, AppIconMobile],
  template: `
    @if (visible()) {
      <div class="lux-confirm-dialog-mobile-backdrop" (click)="onCancel()">
        <div class="lux-confirm-dialog-mobile-sheet" (click)="$event.stopPropagation()">
          <lux-icon-mobile
            [icon]="config().icon"
            class="lux-confirm-dialog-mobile-icon"
            [style.color]="config().color"
          />
          <strong class="lux-confirm-dialog-mobile-title">{{ title() }}</strong>
          <p class="lux-confirm-dialog-mobile-message">{{ message() }}</p>
          <div class="lux-confirm-dialog-mobile-actions">
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
      .lux-confirm-dialog-mobile-backdrop {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        background: var(--ds-bg-overlay);
        backdrop-filter: blur(2px);
      }
      .lux-confirm-dialog-mobile-sheet {
        width: 100%;
        max-width: 480px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 0.75rem;
        padding: 1.5rem 1.25rem calc(1.25rem + env(safe-area-inset-bottom));
        background: var(--ds-bg-surface);
        border-radius: var(--ds-radius-modal) var(--ds-radius-modal)
          0 0;
        box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.15);
      }
      .lux-confirm-dialog-mobile-icon {
        font-size: 2.75rem;
        line-height: 1;
      }
      .lux-confirm-dialog-mobile-title {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--ds-text-primary);
      }
      .lux-confirm-dialog-mobile-message {
        margin: 0;
        font-size: 0.9rem;
        color: var(--ds-text-secondary);
        line-height: 1.5;
      }
      .lux-confirm-dialog-mobile-actions {
        width: 100%;
        margin-top: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
    `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileConfirmDialog extends ConfirmDialogBase {}

