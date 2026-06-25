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
      <div class="mobile-card-header">Mobile Buttons — DS</div>
      <div class="mobile-card-body flex flex-column gap-5">

        <!-- SECCIÓN 1: Botones de lista contextual -->
        <div>
          <div class="section-label">Botones de lista contextual (ion-item)</div>
          <p class="section-desc">Se usan dentro de listas de acciones, drawers o toolbars de detalle. Llevan ícono tonal + label + chevron.</p>
          <div class="flex flex-column gap-0">
            <ion-button-add    label="Agregar registro" />
            <ion-button-edit   label="Editar perfil" />
            <ion-button-confirm label="Confirmar acción" />
            <ion-button-send-email label="Enviar correo" />
            <ion-button-view-pdf url="" fileName="documento.pdf" label="Ver archivo PDF" />
            <ion-button-delete label="Eliminar registro" />
            <ion-button-item   [ionicIcon]="'star-outline'" label="Acción personalizada" />
          </div>
        </div>

        <!-- SECCIÓN 2: Botón de acción principal -->
        <div>
          <div class="section-label">Botón de acción principal (expand="block")</div>
          <p class="section-desc">Footer de formularios y acciones primarias. Gradiente de marca, altura 52px.</p>
          <div class="flex flex-column gap-2">
            <ion-button-save label="Guardar" />
            <ion-button-save label="Actualizando..." [submitting]="true" />
          </div>
        </div>

        <!-- SECCIÓN 3: Toggle de estado -->
        <div>
          <div class="section-label">Toggle de estado (ion-button-active-desactive)</div>
          <p class="section-desc">Cambia entre Activo e Inactivo. Estado activo → gradiente primario; inactivo → outline suave.</p>
          <div class="flex flex-column gap-2">
            <ion-button-active-desactive [state]="true"  activasLabel="Activos" inactivasLabel="Inactivos" />
            <ion-button-active-desactive [state]="false" activasLabel="Activos" inactivasLabel="Inactivos" />
          </div>
        </div>

        <!-- SECCIÓN 4: Botones compactos / toolbar -->
        <div>
          <div class="section-label">Botones compactos (icon-only)</div>
          <p class="section-desc">Se usan en encabezados de tabla o toolbars de detalle. Son 40×40px, no llevan texto.</p>
          <div class="compact-toolbar">
            <div class="compact-item">
              <ion-button-download />
              <span class="compact-label">Descargar</span>
            </div>
            <div class="compact-item">
              <ion-button-tracking [badgeCount]="3" [ticketId]="228" />
              <span class="compact-label">Seguimiento</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .mobile-card { background: var(--ds-bg-surface,#fff); border: 1px solid var(--ds-border,#e2e8f0); border-radius: var(--ds-radius-lg,8px); overflow: hidden; }
    .mobile-card-header { padding: 0.75rem 1rem; background: var(--ds-bg-elevated,#f4f5f8); font-weight: 600; font-size: var(--ds-font-size-body,0.9375rem); color: var(--ds-text-primary); border-bottom: 1px solid var(--ds-border,#e2e8f0); }
    .mobile-card-body { padding: 1rem; }

    .section-label { font-weight: 700; font-size: 0.8125rem; color: var(--ds-text-secondary,#64748b); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.25rem; }
    .section-desc { font-size: 0.75rem; color: var(--ds-text-muted,#94a3b8); margin: 0 0 0.75rem 0; line-height: 1.4; }

    .compact-toolbar { display: flex; gap: 1.5rem; align-items: flex-start; padding: 0.5rem; background: var(--ds-bg-elevated,#f4f5f8); border-radius: 10px; }
    .compact-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .compact-label { font-size: 0.65rem; color: var(--ds-text-muted,#94a3b8); font-weight: 500; }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileButtons {}
