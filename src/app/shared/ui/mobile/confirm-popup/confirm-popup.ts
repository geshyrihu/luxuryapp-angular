import { Component, ViewEncapsulation, signal } from "@angular/core";
import { ConfirmPopupBase } from "@ui/base/confirm-popup.base";
import { AppIconMobile } from "src/app/shared/ui/mobile/app-icon/app-icon";

@Component({
  selector: "ili-confirm-popup",

  imports: [AppIconMobile],
  template: `
    @if (visible()) {
      <div class="ili-cp-backdrop" (click)="close()">
        <div class="ili-cp-sheet" (click)="$event.stopPropagation()">
          <ili-icon
            [icon]="severityConfig().icon"
            class="ili-cp-icon"
            [style.color]="severityConfig().color"
          />
          <p class="ili-cp-message">{{ message() }}</p>
          <div class="ili-cp-actions">
            <button
              class="ili-cp-btn ili-cp-btn-accept"
              [style.--btn-color]="severityConfig().color"
              (click)="accept.emit(); close()"
            >
              {{ acceptLabel() }}
            </button>
            <button
              class="ili-cp-btn ili-cp-btn-reject"
              (click)="reject.emit(); close()"
            >
              {{ rejectLabel() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .ili-cp-backdrop {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--ds-bg-overlay);
        backdrop-filter: blur(2px);
      }
      .ili-cp-sheet {
        width: 85%;
        max-width: 340px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 1.5rem;
        background: var(--ds-bg-surface);
        border-radius: var(--ds-radius-modal);
        box-shadow: var(--ds-shadow-lg);
        text-align: center;
      }
      .ili-cp-icon {
        font-size: 2.5rem;
      }
      .ili-cp-message {
        margin: 0;
        font-size: 0.9rem;
        color: var(--ds-text-secondary);
        line-height: 1.5;
      }
      .ili-cp-actions {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }
      .ili-cp-btn {
        padding: 0.7rem;
        border-radius: var(--ds-radius-md);
        font-size: 0.9rem;
        font-weight: 600;
        border: none;
        cursor: pointer;
        transition: opacity 0.15s;
      }
      .ili-cp-btn-accept {
        background: var(--btn-color);
        color: var(--ds-on-primary);
      }
      .ili-cp-btn-reject {
        background: var(--ds-bg-muted);
        color: var(--ds-text-secondary);
      }
      .ili-cp-btn:active {
        opacity: 0.8;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileConfirmPopup extends ConfirmPopupBase {
  private _visible = signal(false);

  visible = this._visible.asReadonly();

  confirm(_event: Event): void {
    this._visible.set(true);
  }

  close(): void {
    this._visible.set(false);
  }
}
