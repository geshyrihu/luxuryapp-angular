import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { TooltipModule } from "primeng/tooltip";

import {
  CustomButtonAdd,
  CustomButtonEdit,
  CustomButtonDelete,
  CustomButtonSave,
  CustomButtonDownload,
  CustomButtonConfirm,
  CustomButtonViewPdf,
} from "src/app/core/components/buttons/web";

@Component({
  selector: "app-web-buttons",
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    DividerModule,
    TooltipModule,
    CustomButtonAdd,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButtonSave,
    CustomButtonDownload,
    CustomButtonConfirm,
    CustomButtonViewPdf,
  ],
  template: `
    <p-card header="Action Buttons (Web Custom)">
      <div class="flex flex-wrap gap-2">
        <custom-button-add label="Crear Solicitud" />
        <custom-button-edit label="Modificar" />
        <custom-button-save label="Guardar" />
        <custom-button-delete label="Eliminar" />
        <custom-button-download />
        <custom-button-confirm label="Aprobar" />
        <custom-button-view-pdf />
      </div>
      <p class="mt-3 text-xs opacity-60">Botones con lógica integrada (confirmaciones SweetAlert2 y estados).</p>
    </p-card>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class WebButtons {}
