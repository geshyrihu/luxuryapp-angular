import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import {
  IonButtonAdd,
  IonButtonEdit,
  IonButtonSave,
  IonButtonDelete,
  IonButtonConfirm,
  IonButtonDownload,
  IonButtonSendEmail,
  IonButtonTracking,
  IonButtonViewPdf,
  IonButtonActiveDesactive,
  IonButtonItem,
} from "src/app/core/components/buttons/mobile";

@Component({
  selector: "app-mobile-buttons",
  imports: [
    CommonModule,
    IonButtonAdd,
    IonButtonEdit,
    IonButtonSave,
    IonButtonDelete,
    IonButtonConfirm,
    IonButtonDownload,
    IonButtonSendEmail,
    IonButtonTracking,
    IonButtonViewPdf,
    IonButtonActiveDesactive,
    IonButtonItem,
  ],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Ionic Native Buttons</div>
      <div class="mobile-card-body">
        <div class="flex flex-column gap-2">
          <ion-button-add label="Nuevo Registro" />
          <ion-button-edit label="Editar Perfil" />
          <ion-button-save label="Guardar" />
          <ion-button-delete label="Borrar Datos" />
          <ion-button-confirm label="Confirmar Acción" />
          <ion-button-download />
          <ion-button-send-email />
          <ion-button-tracking [badgeCount]="3" [ticketId]="228" />
          <ion-button-view-pdf url="https://example.com/demo.pdf" fileName="demo.pdf" />
          <ion-button-item icon="mdi:star" label="Destacar Elemento" />
          <ion-button-active-desactive [state]="true" />
          <ion-button-active-desactive [state]="false" />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mobile-card { background: var(--ds-bg-surface,#fff); border: 1px solid var(--ds-border,#e2e8f0); border-radius: var(--ds-radius-lg,8px); overflow: hidden; }
    .mobile-card-header { padding: 0.75rem 1rem; background: var(--ds-bg-elevated,#f4f5f8); font-weight: 600; font-size: var(--ds-font-size-body,0.9375rem); color: var(--ds-text-primary); border-bottom: 1px solid var(--ds-border,#e2e8f0); }
    .mobile-card-body { padding: 1rem; }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileButtons {}
