import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { GlobalErrorAlertBase } from "@ui/base/global-error-alert.base";
import { ButtonModule } from "primeng/button";
import { MessageModule } from "primeng/message";

@Component({
  selector: "app-global-error-alert",

  imports: [CommonModule, MessageModule, ButtonModule],
  template: `
    @if (error) {
      <div class="global-error-web">
        <p-message
          severity="error"
          [text]="error.message"
          [style]="{ width: '100%' }"
        >
          <ng-template #messageicon>
            <span class="pi pi-exclamation-circle"></span>
          </ng-template>
          <ng-template #messageaction>
            <p-button
              icon="pi pi-times"
              severity="danger"
              [text]="true"
              (onClick)="onClose()"
            />
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
