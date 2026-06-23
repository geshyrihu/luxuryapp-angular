import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { CardModule } from "primeng/card";
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
    CardModule,
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
    <p-card header="Ionic Custom Buttons">
      <div class="flex flex-column gap-4">
        <ion-list lines="none" class="bg-transparent border-1 surface-border border-round">
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
    </p-card>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MobileButtons {}