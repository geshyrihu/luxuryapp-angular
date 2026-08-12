import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { MessageBase } from "@ui/base/message.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-message",

  imports: [AppIcon],
  template: `
    <div
      class="app-message"
      [style.background]="colors().bg"
      [style.color]="colors().text"
      [style.border-color]="colors().border"
    >
      <app-icon [icon]="displayIcon()" class="app-message-icon" />
      <div class="app-message-content">
        @if (text()) {
          {{ text() }}
        } @else {
          <ng-content />
        }
      </div>
      @if (closable()) {
        <button
          type="button"
          class="app-message-close"
          [style.color]="colors().text"
          (click)="onClose()"
          aria-label="Cerrar"
        >
          <app-icon icon="material-symbols-light:close" />
        </button>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .app-message {
        width: 100%;
        display: flex;
        align-items: flex-start;
        gap: 0.625rem;
        padding: 0.75rem 0.875rem;
        border-radius: var(--ds-radius-md);
        border: 1px solid transparent;
      }
      .app-message-icon {
        margin-top: 0.05rem;
        font-size: 1rem;
        flex: 0 0 auto;
      }
      .app-message-content {
        flex: 1 1 auto;
        line-height: 1.45;
        min-width: 0;
      }
      .app-message-close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        border: 0;
        background: transparent;
        cursor: pointer;
        padding: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppMessage extends MessageBase {}
