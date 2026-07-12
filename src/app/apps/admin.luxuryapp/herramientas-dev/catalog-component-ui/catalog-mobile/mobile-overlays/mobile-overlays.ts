import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import {
  ActionSheetController,
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
  LoadingController,
  ToastController,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  alertCircleOutline,
  checkmarkCircleOutline,
  chevronUpOutline,
  closeOutline,
  expandOutline,
  informationCircleOutline,
  layersOutline,
  listOutline,
  notificationsOutline,
  refreshOutline,
  warningOutline,
} from "ionicons/icons";

@Component({
  selector: "app-mobile-overlays",

  imports: [
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonModal,
    IonTitle,
    IonToolbar,
  ],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">
        Overlays nativos (ion-alert / action-sheet / toast / loading)
      </div>
      <div class="mobile-card-body flex flex-column gap-5">
        <!-- Alert -->
        <div>
          <div class="font-bold text-sm mb-2">Alert (ion-alert)</div>
          <p class="text-xs text-secondary mb-2">
            Dialogo nativo iOS/Android con botones de confirmación.
          </p>
          <div class="flex gap-2 flex-wrap">
            <ion-button
              size="small"
              color="danger"
              (click)="presentAlert('danger')"
            >
              <ion-icon name="alert-circle-outline" slot="start"></ion-icon>
              Eliminar
            </ion-button>
            <ion-button
              size="small"
              color="warning"
              (click)="presentAlert('warning')"
            >
              <ion-icon name="warning-outline" slot="start"></ion-icon>
              Advertencia
            </ion-button>
            <ion-button
              size="small"
              color="primary"
              (click)="presentAlert('info')"
            >
              <ion-icon
                name="information-circle-outline"
                slot="start"
              ></ion-icon>
              Información
            </ion-button>
          </div>
        </div>

        <!-- Action Sheet -->
        <div>
          <div class="font-bold text-sm mb-2">
            Action Sheet (ion-action-sheet)
          </div>
          <p class="text-xs text-secondary mb-2">
            Mené de acciones emergente desde la parte inferior.
          </p>
          <div class="flex gap-2 flex-wrap">
            <ion-button
              size="small"
              color="secondary"
              (click)="presentActionSheet()"
            >
              <ion-icon name="list-outline" slot="start"></ion-icon>
              Opciones de registro
            </ion-button>
            <ion-button
              size="small"
              color="secondary"
              fill="outline"
              (click)="presentActionSheetDestructive()"
            >
              <ion-icon name="layers-outline" slot="start"></ion-icon>
              Con acción peligrosa
            </ion-button>
          </div>
        </div>

        <!-- Toast -->
        <div>
          <div class="font-bold text-sm mb-2">Toast (ion-toast)</div>
          <p class="text-xs text-secondary mb-2">
            Notificación temporal no intrusiva.
          </p>
          <div class="flex gap-2 flex-wrap">
            <ion-button
              size="small"
              color="success"
              (click)="presentToast('success')"
            >
              <ion-icon name="checkmark-circle-outline" slot="start"></ion-icon>
              óxito
            </ion-button>
            <ion-button
              size="small"
              color="danger"
              (click)="presentToast('danger')"
            >
              <ion-icon name="alert-circle-outline" slot="start"></ion-icon>
              Error
            </ion-button>
            <ion-button
              size="small"
              color="warning"
              (click)="presentToast('warning')"
            >
              <ion-icon name="warning-outline" slot="start"></ion-icon>
              Advertencia
            </ion-button>
            <ion-button
              size="small"
              color="medium"
              (click)="presentToast('top')"
            >
              Arriba
            </ion-button>
          </div>
        </div>

        <!-- Loading -->
        <div>
          <div class="font-bold text-sm mb-2">Loading (ion-loading)</div>
          <p class="text-xs text-secondary mb-2">
            Overlay de carga que bloquea la interacción.
          </p>
          <div class="flex gap-2 flex-wrap">
            <ion-button
              size="small"
              color="primary"
              (click)="presentLoading(1500)"
            >
              <ion-icon name="refresh-outline" slot="start"></ion-icon>
              Cargando 1.5s
            </ion-button>
            <ion-button
              size="small"
              color="secondary"
              (click)="presentLoading(3000)"
            >
              <ion-icon name="refresh-outline" slot="start"></ion-icon>
              Procesando 3s
            </ion-button>
          </div>
        </div>

        <!-- Modal -->
        <div>
          <div class="font-bold text-sm mb-2">Modal (ion-modal)</div>
          <p class="text-xs text-secondary mb-2">
            Overlay de pantalla completa o bottom sheet con breakpoints
            arrastrables.
          </p>
          <div class="flex gap-2 flex-wrap">
            <ion-button
              size="small"
              color="primary"
              (click)="modalOpen.set(true)"
            >
              <ion-icon name="expand-outline" slot="start"></ion-icon>
              Modal completo
            </ion-button>
            <ion-button
              size="small"
              color="secondary"
              (click)="sheetOpen.set(true)"
            >
              <ion-icon name="chevron-up-outline" slot="start"></ion-icon>
              Bottom sheet
            </ion-button>
          </div>
        </div>
      </div>
    </div>

    <!-- ion-modal: pantalla completa -->
    <ion-modal [isOpen]="modalOpen()" (didDismiss)="modalOpen.set(false)">
      <ng-template>
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Detalle del registro</ion-title>
            <ion-buttons slot="end">
              <ion-button (click)="modalOpen.set(false)">
                <ion-icon name="close-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <p class="text-secondary text-sm mb-4">
            Contenido del modal. Puede incluir formularios, listas o cualquier
            componente Angular/Ionic.
          </p>
          <ion-button
            expand="block"
            color="primary"
            (click)="modalOpen.set(false)"
            >Guardar</ion-button
          >
          <ion-button
            expand="block"
            fill="outline"
            color="medium"
            class="ion-margin-top"
            (click)="modalOpen.set(false)"
            >Cancelar</ion-button
          >
        </ion-content>
      </ng-template>
    </ion-modal>

    <!-- ion-modal: bottom sheet con breakpoints -->
    <ion-modal
      [isOpen]="sheetOpen()"
      (didDismiss)="sheetOpen.set(false)"
      [breakpoints]="[0, 0.4, 0.75]"
      [initialBreakpoint]="0.4"
      handleBehavior="cycle"
    >
      <ng-template>
        <ion-header>
          <ion-toolbar>
            <ion-title>Opciones</ion-title>
            <ion-buttons slot="end">
              <ion-button (click)="sheetOpen.set(false)">
                <ion-icon name="close-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <p class="text-secondary text-sm mb-4">
            Bottom sheet con breakpoints <code>[0, 0.4, 0.75]</code>. Arrastra
            el handle para expandir o cerrar.
          </p>
          <ion-button
            expand="block"
            fill="outline"
            (click)="sheetOpen.set(false)"
            >Cerrar</ion-button
          >
        </ion-content>
      </ng-template>
    </ion-modal>

    <!-- --- PATRóN: Rating & Feedback (ui-stiich Corporate Integrity) --- -->
    <div class="stiich-section">
      <div class="stiich-section__header">
        <span class="stiich-section__eyebrow">Corporate Integrity</span>
        <h4 class="stiich-section__title">
          Rating & Feedback ó valoración y comentarios
        </h4>
      </div>
      <p class="stiich-section__desc">
        Componente de valoración con estrellas, feedback rápido y campo de
        comentario. Inspirado en <code>rating_y_feedback_modo_claro</code>.
      </p>
      <div class="stiich-rating-card">
        <div class="stiich-rating-header">
          <span class="material-symbols-outlined stiich-rating-header__icon"
            >rate_review</span
          >
          <span class="stiich-rating-header__title"
            >Califica tu experiencia</span
          >
        </div>
        <div class="stiich-rating-body">
          <div class="stiich-stars">
            @for (s of [1, 2, 3, 4, 5]; track s) {
              <button
                class="stiich-star"
                [class.stiich-star--filled]="s <= rating()"
                (click)="setRating(s)"
              >
                <span class="material-symbols-outlined stiich-star__icon">
                  {{ s <= rating() ? "star" : "star" }}
                </span>
              </button>
            }
          </div>
          <p class="stiich-rating-label">{{ ratingLabel() }}</p>

          <div class="stiich-feedback-row">
            <button
              class="stiich-feedback-btn"
              [class.stiich-feedback-btn--active]="feedback() === 'like'"
              (click)="feedback.set('like')"
            >
              <span class="material-symbols-outlined">thumb_up</span>
              <span>Me gusta</span>
            </button>
            <button
              class="stiich-feedback-btn"
              [class.stiich-feedback-btn--active]="feedback() === 'dislike'"
              (click)="feedback.set('dislike')"
            >
              <span class="material-symbols-outlined">thumb_down</span>
              <span>No me gusta</span>
            </button>
            <button
              class="stiich-feedback-btn"
              [class.stiich-feedback-btn--active]="feedback() === 'idea'"
              (click)="feedback.set('idea')"
            >
              <span class="material-symbols-outlined">lightbulb</span>
              <span>Sugerencia</span>
            </button>
          </div>

          @if (feedback()) {
            <div class="stiich-comment-area">
              <textarea
                class="stiich-textarea"
                placeholder="Cuóntanos mós..."
                rows="3"
              ></textarea>
              <button class="stiich-btn-block stiich-btn-block--primary">
                Enviar feedback
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styleUrls: ["../../shared/mobile-showcase-styles.css"],
  styles: [
    `
      /* -----------------------------------------------
       Corporate Integrity DS é patrones ui-stiich
       ----------------------------------------------- */
      .stiich-section {
        margin-top: 1.5rem;
      }
      .stiich-section__header {
        margin-bottom: 0.25rem;
      }
      .stiich-section__eyebrow {
        font-size: 0.65rem;
        font-weight: 700;
        color: var(--ds-primary);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .stiich-section__desc {
        font-size: 0.75rem;
        color: var(--ds-text-muted);
        margin: 0.25rem 0 0.75rem 0;
        line-height: 1.4;
      }

      .stiich-rating-card {
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border-strong);
        border-radius: 0.5rem;
        overflow: hidden;
      }
      .stiich-rating-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        background: var(--ds-bg-sunken);
      }
      .stiich-rating-header__icon {
        font-size: 1.25rem;
        color: var(--ds-primary-dark, var(--ds-primary));
      }
      .stiich-rating-header__title {
        font-weight: 600;
        font-size: 0.8125rem;
        color: var(--ds-text-primary);
      }
      .stiich-rating-body {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
      }
      .stiich-stars {
        display: flex;
        gap: 0.25rem;
      }
      .stiich-star {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        line-height: 1;
      }
      .stiich-star__icon {
        font-size: 2rem;
        color: var(--ds-border-strong);
        font-variation-settings: "FILL" 0;
        transition: all 150ms;
      }
      .stiich-star--filled .stiich-star__icon {
        color: var(--ds-warning);
        font-variation-settings: "FILL" 1;
      }
      .stiich-rating-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--ds-text-primary);
        margin: 0;
      }
      .stiich-feedback-row {
        display: flex;
        gap: 0.5rem;
        width: 100%;
      }
      .stiich-feedback-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.375rem;
        padding: 0.625rem;
        border: 1px solid var(--ds-border-strong);
        border-radius: 0.5rem;
        background: var(--ds-bg-surface);
        cursor: pointer;
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--ds-text-secondary);
        transition: all 150ms;
        font-family: inherit;
      }
      .stiich-feedback-btn:hover {
        border-color: var(--ds-primary);
        color: var(--ds-primary);
      }
      .stiich-feedback-btn--active {
        background: var(--ds-bg-sunken);
        border-color: var(--ds-primary);
        color: var(--ds-primary);
      }
      .stiich-comment-area {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .stiich-textarea {
        width: 100%;
        border: 1px solid var(--ds-border-strong);
        border-radius: 0.5rem;
        padding: 0.75rem;
        font-size: 0.8125rem;
        font-family: inherit;
        resize: vertical;
        outline: none;
      }
      .stiich-textarea:focus {
        border-color: var(--ds-primary);
        box-shadow: 0 0 0 2px
          color-mix(in srgb, var(--ds-primary) 15%, transparent);
      }
      .stiich-btn-block {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        border: none;
        cursor: pointer;
        font-weight: 700;
        border-radius: 0.5rem;
        padding: 0.75rem;
        font-size: 0.875rem;
        font-family: inherit;
        transition: all 150ms;
      }
      .stiich-btn-block--primary {
        background: var(--ds-primary);
        color: var(--ds-on-primary);
      }
      .stiich-btn-block--primary:hover {
        background: var(--ds-primary-dark, var(--ds-primary));
      }
      .material-symbols-outlined {
        font-variation-settings:
          "FILL" 0,
          "wght" 400,
          "GRAD" 0,
          "opsz" 24;
        vertical-align: middle;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MobileOverlays {
  private alertCtrl = inject(AlertController);
  private actionSheetCtrl = inject(ActionSheetController);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);

  modalOpen = signal(false);
  sheetOpen = signal(false);

  // --- Rating & Feedback ---
  rating = signal(0);
  feedback = signal<"like" | "dislike" | "idea" | "">("");

  ratingLabel(): string {
    const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
    return labels[this.rating()] || "";
  }

  setRating(value: number): void {
    this.rating.set(value);
  }

  constructor() {
    addIcons({
      alertCircleOutline,
      checkmarkCircleOutline,
      chevronUpOutline,
      closeOutline,
      expandOutline,
      informationCircleOutline,
      layersOutline,
      listOutline,
      notificationsOutline,
      refreshOutline,
      warningOutline,
    });
  }

  async presentAlert(type: "danger" | "warning" | "info"): Promise<void> {
    const configs = {
      danger: {
        header: "Confirmar eliminación",
        message:
          "óDeseas eliminar este registro? Esta acción no se puede deshacer.",
        confirmText: "Eliminar",
        confirmRole: "destructive",
      },
      warning: {
        header: "Atención",
        message:
          "Este proceso afectaré méltiples registros. óDeseas continuar?",
        confirmText: "Continuar",
        confirmRole: "confirm",
      },
      info: {
        header: "Información",
        message:
          "El proceso se ha programado y se ejecutaré en los préximos minutos.",
        confirmText: "Entendido",
        confirmRole: "confirm",
      },
    };
    const cfg = configs[type];
    const alert = await this.alertCtrl.create({
      header: cfg.header,
      message: cfg.message,
      buttons: [
        { text: "Cancelar", role: "cancel" },
        {
          text: cfg.confirmText,
          role: cfg.confirmRole,
          cssClass: type === "danger" ? "alert-button-danger" : "",
        },
      ],
    });
    await alert.present();
  }

  async presentActionSheet(): Promise<void> {
    const sheet = await this.actionSheetCtrl.create({
      header: "Acciones del registro",
      buttons: [
        { text: "Editar", icon: "create-outline", handler: () => {} },
        { text: "Duplicar", icon: "copy-outline", handler: () => {} },
        { text: "Exportar PDF", icon: "document-outline", handler: () => {} },
        { text: "Cancelar", role: "cancel", icon: "close-outline" },
      ],
    });
    await sheet.present();
  }

  async presentActionSheetDestructive(): Promise<void> {
    const sheet = await this.actionSheetCtrl.create({
      header: "Opciones",
      subHeader: "Selecciona una acción",
      buttons: [
        { text: "Archivar", icon: "archive-outline", handler: () => {} },
        {
          text: "Eliminar",
          role: "destructive",
          icon: "trash-outline",
          handler: () => {},
        },
        { text: "Cancelar", role: "cancel" },
      ],
    });
    await sheet.present();
  }

  async presentToast(
    variant: "success" | "danger" | "warning" | "top",
  ): Promise<void> {
    const configs = {
      success: {
        message: "Registro guardado exitosamente.",
        color: "success",
        position: "bottom" as const,
      },
      danger: {
        message: "Error al procesar la solicitud.",
        color: "danger",
        position: "bottom" as const,
      },
      warning: {
        message: "Revisa los campos requeridos antes de continuar.",
        color: "warning",
        position: "bottom" as const,
      },
      top: {
        message: "Notificación desde la parte superior.",
        color: "medium",
        position: "top" as const,
      },
    };
    const cfg = configs[variant];
    const toast = await this.toastCtrl.create({
      message: cfg.message,
      duration: 2500,
      color: cfg.color,
      position: cfg.position,
      buttons: [{ text: "OK", role: "cancel" }],
    });
    await toast.present();
  }

  async presentLoading(duration: number): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message:
        duration <= 1500 ? "Cargando datos..." : "Procesando solicitud...",
      duration,
      spinner: "crescent",
    });
    await loading.present();
  }
}
