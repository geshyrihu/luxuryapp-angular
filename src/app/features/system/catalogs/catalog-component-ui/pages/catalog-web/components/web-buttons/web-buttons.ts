import { CommonModule } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import { BadgeModule } from "primeng/badge";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { TooltipModule } from "primeng/tooltip";

import {
  CustomBtnActiveDesactive,
  CustomButton,
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
} from "src/app/core/components/buttons/legacy/buttons";

@Component({
  selector: "app-web-buttons",
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    BadgeModule,
    DividerModule,
    TooltipModule,
    CustomButton,
    CustomBtnActiveDesactive,
    CustomButtonAdd,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButtonSave,
    CustomButtonDownload,
    CustomButtonConfirm,
    CustomButtonViewPdf,
    CustomButtonItem,
    CustomButtonSendEmail,
    CustomButtonTracking,
  ],
  template: `
    <div class="flex flex-column gap-3">
      <!-- Botones Custom de la App -->
      <p-card header="Action Buttons (Web Custom)">
        <p class="m-0 mb-3 text-sm text-color-secondary">
          Botones con l�gica integrada: confirmaciones SweetAlert2, estados
          reactivos, descarga y trazabilidad.
        </p>
        <div class="flex flex-wrap gap-2 mb-3">
          <custom-button label="Bot�n Gen�rico" />
          <custom-button-add label="Crear Solicitud" />
          <custom-button-edit label="Editar" />
          <custom-button-save label="Guardar" />
          <custom-button-delete label="Eliminar" />
          <custom-button-confirm label="Aprobar" />
          <custom-button-download />
          <custom-button-view-pdf />
          <custom-button-send-email />
          <custom-button-tracking />
          <custom-button-item [iconClass]="'mdi:star'" label="Item Especial" />
        </div>
        <p-divider />
        <p class="text-xs font-semibold text-color-secondary mb-2">
          Estados Activo / Inactivo
        </p>
        <div class="flex gap-2">
          <custom-button-active-desactive [state]="true" />
          <custom-button-active-desactive [state]="false" />
        </div>
      </p-card>

      <!-- Severidades Filled -->
      <p-card header="PrimeNG — Severidades (Filled)">
        <p class="m-0 mb-3 text-sm text-color-secondary">
          Usa la severidad que coincida con el nivel sem�ntico de la acci�n.
        </p>
        <div class="flex flex-wrap gap-2">
          <p-button label="Primary" />
          <p-button label="Secondary" severity="secondary" />
          <p-button label="Success" severity="success" />
          <p-button label="Info" severity="info" />
          <p-button label="Warning" severity="warn" />
          <p-button label="Danger" severity="danger" />
          <p-button label="Help" severity="help" />
          <p-button label="Contrast" severity="contrast" />
        </div>
      </p-card>

      <!-- Botones con Íconos -->
      <p-card header="Botones con Íconos">
        <p class="m-0 mb-3 text-sm text-color-secondary">
          Ícono izquierda (default), derecha con <code>iconPos="right"</code>, o
          solo �cono circular.
        </p>
        <div class="flex flex-wrap gap-2 mb-4">
          <p-button label="Guardar" icon="pi pi-save" />
          <p-button label="Nuevo" icon="pi pi-plus" severity="success" />
          <p-button label="Eliminar" icon="pi pi-trash" severity="danger" />
          <p-button label="Descargar" icon="pi pi-download" severity="info" />
          <p-button
            label="Siguiente"
            icon="pi pi-arrow-right"
            iconPos="right"
            severity="secondary"
          />
          <p-button label="Buscar" icon="pi pi-search" [outlined]="true" />
        </div>
        <p class="text-xs font-semibold text-color-secondary mb-2">
          Solo �cono (rounded)
        </p>
        <div class="flex flex-wrap gap-2">
          <p-button
            icon="pi pi-plus"
            [rounded]="true"
            pTooltip="Agregar"
            tooltipPosition="top"
          />
          <p-button
            icon="pi pi-pencil"
            [rounded]="true"
            severity="secondary"
            pTooltip="Editar"
            tooltipPosition="top"
          />
          <p-button
            icon="pi pi-trash"
            [rounded]="true"
            severity="danger"
            pTooltip="Eliminar"
            tooltipPosition="top"
          />
          <p-button
            icon="pi pi-download"
            [rounded]="true"
            severity="info"
            pTooltip="Descargar"
            tooltipPosition="top"
          />
          <p-button
            icon="pi pi-check"
            [rounded]="true"
            severity="success"
            pTooltip="Aprobar"
            tooltipPosition="top"
          />
          <p-button
            icon="pi pi-times"
            [rounded]="true"
            [outlined]="true"
            severity="danger"
            pTooltip="Cancelar"
            tooltipPosition="top"
          />
          <p-button
            icon="pi pi-cog"
            [rounded]="true"
            [text]="true"
            severity="secondary"
            pTooltip="Configurar"
            tooltipPosition="top"
          />
          <p-button
            icon="pi pi-bell"
            [rounded]="true"
            [text]="true"
            pTooltip="Notificaciones"
            tooltipPosition="top"
          />
        </div>
      </p-card>

      <!-- Tama�os y Estados -->
      <p-card header="Tama�os y Estados">
        <div class="flex flex-column gap-4">
          <div>
            <p class="text-xs font-semibold text-color-secondary mb-2">
              Tama�os
            </p>
            <div class="flex flex-wrap align-items-center gap-2">
              <p-button label="Small" size="small" />
              <p-button label="Normal" />
              <p-button label="Large" size="large" />
            </div>
          </div>
          <div>
            <p class="text-xs font-semibold text-color-secondary mb-2">
              Estados
            </p>
            <div class="flex flex-wrap align-items-center gap-2">
              <p-button
                label="Cargando..."
                [loading]="isLoading()"
                (onClick)="simulateLoad()"
                severity="secondary"
              />
              <p-button label="Deshabilitado" [disabled]="true" />
              <p-button label="Raised" [raised]="true" severity="secondary" />
              <p-button label="Rounded" [rounded]="true" />
            </div>
          </div>
          <div>
            <p class="text-xs font-semibold text-color-secondary mb-2">
              Ancho completo
            </p>
            <p-button
              label="Bot�n de ancho completo"
              class="w-full"
              styleClass="w-full"
            />
          </div>
        </div>
      </p-card>

      <!-- Badge -->
      <p-card header="Con Badge">
        <p class="m-0 mb-3 text-sm text-color-secondary">
          Indicadores de cantidad sobre el bot�n.
        </p>
        <div class="flex flex-wrap gap-3">
          <p-button
            label="Mensajes"
            icon="pi pi-envelope"
            [outlined]="true"
            pBadge
            value="3"
            badgeSeverity="danger"
          />
          <p-button
            label="Alertas"
            icon="pi pi-bell"
            [outlined]="true"
            pBadge
            value="12"
            badgeSeverity="warn"
          />
          <p-button
            icon="pi pi-inbox"
            [rounded]="true"
            [outlined]="true"
            pBadge
            value="5"
            pTooltip="Bandeja"
            tooltipPosition="top"
          />
        </div>
      </p-card>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class WebButtons {
  isLoading = signal(false);

  simulateLoad() {
    this.isLoading.set(true);
    setTimeout(() => this.isLoading.set(false), 2000);
  }
}
