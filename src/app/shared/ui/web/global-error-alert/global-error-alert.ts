import { Component, ViewEncapsulation } from "@angular/core";
import { GlobalErrorAlertBase } from "@ui/base/global-error-alert.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { ButtonModule } from "primeng/button";
import { MessageModule } from "primeng/message";

@Component({
  selector: "app-global-error-alert",

  imports: [MessageModule, ButtonModule, AppIcon],
  template: `
    @if (error) {
      <div class="global-error-web">
        <p-message
          severity="error"
          [text]="error.message"
          [style]="{ width: '100%' }"
        >
          <ng-template #messageicon>
            <app-icon icon="material-symbols-light:error" />
          </ng-template>
          <ng-template #messageaction>
            <p-button severity="danger" [text]="true" (onClick)="onClose()">
              <ng-template #icon>
                <app-icon icon="material-symbols-light:close" />
              </ng-template>
            </p-button>
          </ng-template>
        </p-message>
      </div>
    }
  `,
  styles: [
    `
      .global-error-web {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        animation: fadeInDown 300ms ease-out;
      }
      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class GlobalErrorAlert extends GlobalErrorAlertBase {}
