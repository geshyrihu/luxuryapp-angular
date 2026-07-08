import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { MessageBase } from "@ui/base/message.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "ili-message",
  standalone: true,
  imports: [AppIcon],
  template: `
    <div
      class="ili-message"
      [style.background]="colors().bg"
      [style.color]="colors().text"
      [style.border-color]="colors().border"
    >
      <app-icon [icon]="displayIcon()" class="ili-message-icon" />
      <div class="ili-message-content">
        @if (text()) {
          {{ text() }}
        } @else {
          <ng-content />
        }
      </div>
      @if (closable()) {
        <button
          type="button"
          class="ili-message-close"
          [style.color]="colors().text"
          (click)="onClose()"
          aria-label="Cerrar"
        >
          <app-icon icon="mdi:close" />
        </button>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .ili-message {
      width: 100%;
      display: flex;
      align-items: flex-start;
      gap: 0.625rem;
      padding: 0.75rem 0.875rem;
      border-radius: var(--ds-radius-md, 8px);
      border: 1px solid transparent;
    }
    .ili-message-icon {
      margin-top: 0.05rem;
      font-size: 1rem;
      flex: 0 0 auto;
    }
    .ili-message-content {
      flex: 1 1 auto;
      line-height: 1.45;
      min-width: 0;
    }
    .ili-message-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border: 0;
      background: transparent;
      cursor: pointer;
      padding: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileMessage extends MessageBase {}
