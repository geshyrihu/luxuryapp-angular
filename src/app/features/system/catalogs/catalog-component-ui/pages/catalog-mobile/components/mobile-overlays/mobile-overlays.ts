import { CommonModule } from "@angular/common";
import { Component, inject, signal, ViewEncapsulation } from "@angular/core";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/angular/standalone";
import {
  ActionSheetController,
  AlertController,
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
  standalone: true,
  imports: [CommonModule, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Overlays nativos (ion-alert / action-sheet / toast / loading)</div>
      <div class="mobile-card-body flex flex-column gap-5">

        <!-- Alert -->
        <div>
          <div class="font-bold text-sm mb-2">Alert (ion-alert)</div>
          <p class="text-xs text-secondary mb-2">Dialogo nativo iOS/Android con botones de confirmación.</p>
          <div class="flex gap-2 flex-wrap">
            <ion-button size="small" color="danger" (click)="presentAlert('danger')">
              <ion-icon name="alert-circle-outline" slot="start"></ion-icon>
              Eliminar
            </ion-button>
            <ion-button size="small" color="warning" (click)="presentAlert('warning')">
              <ion-icon name="warning-outline" slot="start"></ion-icon>
              Advertencia
            </ion-button>
            <ion-button size="small" color="primary" (click)="presentAlert('info')">
              <ion-icon name="information-circle-outline" slot="start"></ion-icon>
              Información
            </ion-button>
          </div>
        </div>

        <!-- Action Sheet -->
        <div>
          <div class="font-bold text-sm mb-2">Action Sheet (ion-action-sheet)</div>
          <p class="text-xs text-secondary mb-2">Menú de acciones emergente desde la parte inferior.</p>
          <div class="flex gap-2 flex-wrap">
            <ion-button size="small" color="secondary" (click)="presentActionSheet()">
              <ion-icon name="list-outline" slot="start"></ion-icon>
              Opciones de registro
            </ion-button>
            <ion-button size="small" color="secondary" fill="outline" (click)="presentActionSheetDestructive()">
              <ion-icon name="layers-outline" slot="start"></ion-icon>
              Con acción peligrosa
            </ion-button>
          </div>
        </div>

        <!-- Toast -->
        <div>
          <div class="font-bold text-sm mb-2">Toast (ion-toast)</div>
          <p class="text-xs text-secondary mb-2">Notificación temporal no intrusiva.</p>
          <div class="flex gap-2 flex-wrap">
            <ion-button size="small" color="success" (click)="presentToast('success')">
              <ion-icon name="checkmark-circle-outline" slot="start"></ion-icon>
              Éxito
            </ion-button>
            <ion-button size="small" color="danger" (click)="presentToast('danger')">
              <ion-icon name="alert-circle-outline" slot="start"></ion-icon>
              Error
            </ion-button>
            <ion-button size="small" color="warning" (click)="presentToast('warning')">
              <ion-icon name="warning-outline" slot="start"></ion-icon>
              Advertencia
            </ion-button>
            <ion-button size="small" color="medium" (click)="presentToast('top')">
              Arriba
            </ion-button>
          </div>
        </div>

        <!-- Loading -->
        <div>
          <div class="font-bold text-sm mb-2">Loading (ion-loading)</div>
          <p class="text-xs text-secondary mb-2">Overlay de carga que bloquea la interacción.</p>
          <div class="flex gap-2 flex-wrap">
            <ion-button size="small" color="primary" (click)="presentLoading(1500)">
              <ion-icon name="refresh-outline" slot="start"></ion-icon>
              Cargando 1.5s
            </ion-button>
            <ion-button size="small" color="secondary" (click)="presentLoading(3000)">
              <ion-icon name="refresh-outline" slot="start"></ion-icon>
              Procesando 3s
            </ion-button>
          </div>
        </div>

        <!-- Modal -->
        <div>
          <div class="font-bold text-sm mb-2">Modal (ion-modal)</div>
          <p class="text-xs text-secondary mb-2">Overlay de pantalla completa o bottom sheet con breakpoints arrastrables.</p>
          <div class="flex gap-2 flex-wrap">
            <ion-button size="small" color="primary" (click)="modalOpen.set(true)">
              <ion-icon name="expand-outline" slot="start"></ion-icon>
              Modal completo
            </ion-button>
            <ion-button size="small" color="secondary" (click)="sheetOpen.set(true)">
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
            Contenido del modal. Puede incluir formularios, listas o cualquier componente Angular/Ionic.
          </p>
          <ion-button expand="block" color="primary" (click)="modalOpen.set(false)">Guardar</ion-button>
          <ion-button expand="block" fill="outline" color="medium" class="ion-margin-top" (click)="modalOpen.set(false)">Cancelar</ion-button>
        </ion-content>
      </ng-template>
    </ion-modal>

    <!-- ion-modal: bottom sheet con breakpoints -->
    <ion-modal
      [isOpen]="sheetOpen()"
      (didDismiss)="sheetOpen.set(false)"
      [breakpoints]="[0, 0.4, 0.75]"
      [initialBreakpoint]="0.4"
      handleBehavior="cycle">
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
            Bottom sheet con breakpoints <code>[0, 0.4, 0.75]</code>. Arrastra el handle para expandir o cerrar.
          </p>
          <ion-button expand="block" fill="outline" (click)="sheetOpen.set(false)">Cerrar</ion-button>
        </ion-content>
      </ng-template>
    </ion-modal>
  `,
  styles: [`
    .mobile-card { background: var(--ds-bg-surface,#fff); border: 1px solid var(--ds-border,#e2e8f0); border-radius: var(--ds-radius-lg,8px); overflow: hidden; }
    .mobile-card-header { padding: 0.75rem 1rem; background: var(--ds-bg-elevated,#f4f5f8); font-weight: 600; font-size: var(--ds-font-size-body,0.9375rem); color: var(--ds-text-primary); border-bottom: 1px solid var(--ds-border,#e2e8f0); }
    .mobile-card-body { padding: 1rem; }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileOverlays {
  private alertCtrl = inject(AlertController);
  private actionSheetCtrl = inject(ActionSheetController);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);

  modalOpen = signal(false);
  sheetOpen = signal(false);

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

  async presentAlert(type: 'danger' | 'warning' | 'info'): Promise<void> {
    const configs = {
      danger: { header: 'Confirmar eliminación', message: '¿Deseas eliminar este registro? Esta acción no se puede deshacer.', confirmText: 'Eliminar', confirmRole: 'destructive' },
      warning: { header: 'Atención', message: 'Este proceso afectará múltiples registros. ¿Deseas continuar?', confirmText: 'Continuar', confirmRole: 'confirm' },
      info: { header: 'Información', message: 'El proceso se ha programado y se ejecutará en los próximos minutos.', confirmText: 'Entendido', confirmRole: 'confirm' },
    };
    const cfg = configs[type];
    const alert = await this.alertCtrl.create({
      header: cfg.header,
      message: cfg.message,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: cfg.confirmText, role: cfg.confirmRole, cssClass: type === 'danger' ? 'alert-button-danger' : '' },
      ],
    });
    await alert.present();
  }

  async presentActionSheet(): Promise<void> {
    const sheet = await this.actionSheetCtrl.create({
      header: 'Acciones del registro',
      buttons: [
        { text: 'Editar', icon: 'create-outline', handler: () => {} },
        { text: 'Duplicar', icon: 'copy-outline', handler: () => {} },
        { text: 'Exportar PDF', icon: 'document-outline', handler: () => {} },
        { text: 'Cancelar', role: 'cancel', icon: 'close-outline' },
      ],
    });
    await sheet.present();
  }

  async presentActionSheetDestructive(): Promise<void> {
    const sheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      subHeader: 'Selecciona una acción',
      buttons: [
        { text: 'Archivar', icon: 'archive-outline', handler: () => {} },
        { text: 'Eliminar', role: 'destructive', icon: 'trash-outline', handler: () => {} },
        { text: 'Cancelar', role: 'cancel' },
      ],
    });
    await sheet.present();
  }

  async presentToast(variant: 'success' | 'danger' | 'warning' | 'top'): Promise<void> {
    const configs = {
      success: { message: 'Registro guardado exitosamente.', color: 'success', position: 'bottom' as const },
      danger: { message: 'Error al procesar la solicitud.', color: 'danger', position: 'bottom' as const },
      warning: { message: 'Revisa los campos requeridos antes de continuar.', color: 'warning', position: 'bottom' as const },
      top: { message: 'Notificación desde la parte superior.', color: 'medium', position: 'top' as const },
    };
    const cfg = configs[variant];
    const toast = await this.toastCtrl.create({
      message: cfg.message,
      duration: 2500,
      color: cfg.color,
      position: cfg.position,
      buttons: [{ text: 'OK', role: 'cancel' }],
    });
    await toast.present();
  }

  async presentLoading(duration: number): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: duration <= 1500 ? 'Cargando datos...' : 'Procesando solicitud...',
      duration,
      spinner: 'crescent',
    });
    await loading.present();
  }
}
