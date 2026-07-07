import { Component, ChangeDetectionStrategy, ViewEncapsulation } from "@angular/core";
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { alertCircleOutline, closeOutline } from "ionicons/icons";
import { CommonModule } from "@angular/common";
import { GlobalErrorAlertBase } from "@ui/base/global-error-alert.base";

@Component({
  selector: "ili-global-error-alert",
  standalone: true,
  imports: [CommonModule, IonItem, IonLabel, IonButton, IonIcon],
  template: `
    @if (error) {
      <ion-item color="danger" lines="none" class="global-error-alert">
        <ion-icon
          name="alert-circle-outline"
          slot="start"
          class="text-2xl"
        ></ion-icon>
        <ion-label class="ion-text-wrap font-medium">
          {{ error.message }}
        </ion-label>
        <ion-button
          fill="clear"
          slot="end"
          (click)="onClose()"
          class="close-btn"
        >
          <ion-icon name="close-outline" slot="icon-only"></ion-icon>
        </ion-button>
      </ion-item>
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .global-error-alert {
        --background: var(--ion-color-danger);
        --color: var(--ion-color-danger-contrast);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        animation: fadeInDown 300ms ease-out;
        border-left: 4px solid var(--ion-color-danger-shade);
        margin-bottom: 1rem;
      }

      .close-btn {
        --color: var(--ion-color-danger-contrast);
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
})
export class MobileGlobalErrorAlert extends GlobalErrorAlertBase {
  constructor() {
    super();
    addIcons({ alertCircleOutline, closeOutline });
  }
}

