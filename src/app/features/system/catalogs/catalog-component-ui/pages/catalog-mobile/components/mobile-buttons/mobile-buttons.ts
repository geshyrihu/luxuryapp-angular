import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import {
  IonList,
  IonItemDivider,
  IonLabel,
} from "@ionic/angular/standalone";

import {
  CustomBtnActiveDesactive,
  CustomButtonAdd,
  CustomButtonConfirm,
  CustomButtonDelete,
  CustomButtonDownload,
  CustomButtonEdit,
  CustomButtonItem,
  CustomButtonSave,
  CustomButtonSendEmail,
  CustomButtonTracking,
  CustomButtonViewPdf,
} from "src/app/core/components/buttons/web";

@Component({
  selector: "app-mobile-buttons",
  imports: [
    CommonModule,
    IonList,
    IonItemDivider,
    IonLabel,
    CustomBtnActiveDesactive,
    CustomButtonAdd,
    CustomButtonConfirm,
    CustomButtonDelete,
    CustomButtonDownload,
    CustomButtonEdit,
    CustomButtonItem,
    CustomButtonSave,
    CustomButtonSendEmail,
    CustomButtonTracking,
    CustomButtonViewPdf,
  ],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Ionic Custom Buttons</div>
      <div class="mobile-card-body">
        <ion-list lines="none" class="bg-transparent">
          <ion-item-divider class="bg-transparent"><ion-label class="text-xs text-500 font-bold uppercase">Acciones Principales</ion-label></ion-item-divider>
          <custom-button-add label="Nuevo Registro" />
          <custom-button-edit label="Editar Perfil" />
          <custom-button-save label="Guardar" />
          <custom-button-delete label="Borrar Datos" />

          <ion-item-divider class="bg-transparent mt-3"><ion-label class="text-xs text-500 font-bold uppercase">Menú Contextual (Sliding/Action)</ion-label></ion-item-divider>
          <custom-button-active-desactive [state]="true" />
          <custom-button-active-desactive [state]="false" />
          <custom-button-confirm label="Confirmar Acción" />
          <custom-button-download />
          <custom-button-send-email />
          <custom-button-tracking />
          <custom-button-view-pdf />

          <ion-item-divider class="bg-transparent mt-3"><ion-label class="text-xs text-500 font-bold uppercase">Item Genérico</ion-label></ion-item-divider>
          <custom-button-item icon="mdi:star" label="Destacar Elemento" />
        </ion-list>
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