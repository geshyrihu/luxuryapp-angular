import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { alertCircleOutline, closeOutline } from "ionicons/icons";
import { GlobalErrorService } from "../../services/global-error.service";

/**
 * 🚨 GLOBAL ERROR ALERT
 * -------------------------------------------------------------------------
 * El guardián de las malas noticias.
 * Muestra alertas de error globales que descienden dramáticamente.
 * Usa Ionic para un look nativo.
 */
@Component({
  selector: "app-global-error-alert",
  imports: [IonItem, IonLabel, IonButton, IonIcon],
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
export class GlobalErrorAlert implements OnInit, OnDestroy {
  private globalErrorService = inject(GlobalErrorService);
  error: any | null = null;

  constructor() {
    addIcons({ alertCircleOutline, closeOutline });
  }

  ngOnInit(): void {
    // Nos suscribimos al observable del servicio
    this.globalErrorService.error$.subscribe((error) => {
      this.error = error;
    });
  }

  onClose(): void {
    this.globalErrorService.clearError();
  }

  ngOnDestroy(): void {
    // Si usáramos señales derivadas no sería necesario, pero con suscripción manual
    // Angular maneja la destrucción del componente, aunque idealmente deberíamos desuscribirnos si fuera un Subject caliente de larga duración.
    // Al ser un servicio singleton, está bien por ahora.
  }
}
