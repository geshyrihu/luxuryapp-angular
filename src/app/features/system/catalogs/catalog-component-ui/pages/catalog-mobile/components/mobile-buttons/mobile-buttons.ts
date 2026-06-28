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
import { MOBILE_SHOWCASE_STYLES } from "../../../../shared/mobile-showcase-styles";

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

        <!-- SECCIÓN 1: Variantes estándar (DS) -->
        <div>
          <div class="section-label">Variantes estándar (DS)</div>
          <p class="section-desc">Primary, secondary, outline, text. Altura 48px en mobile.</p>
          <div class="flex flex-column gap-2">
            <div class="flex gap-2">
              <button class="ds-btn ds-btn--primary ds-btn--flex">Primary Action</button>
              <button class="ds-btn ds-btn--secondary ds-btn--flex">Secondary</button>
            </div>
            <div class="flex gap-2">
              <button class="ds-btn ds-btn--outline ds-btn--flex">Outline</button>
              <button class="ds-btn ds-btn--text ds-btn--flex">Text Button</button>
            </div>
            <div class="flex gap-2">
              <button class="ds-btn ds-btn--primary ds-btn--flex ds-btn--loading" disabled>
                <span class="material-symbols-outlined ds-btn__spinner">progress_activity</span>
                Processing
              </button>
              <button class="ds-btn ds-btn--primary ds-btn--flex ds-btn--disabled" disabled>Disabled</button>
            </div>
          </div>
        </div>

        <!-- SECCIÓN 2: Variantes de tamaño -->
        <div>
          <div class="section-label">Size Variants</div>
          <p class="section-desc">Large (56px), default (48px), small (32px), e icon FAB (48px circular).</p>
          <div class="flex items-center gap-2 flex-wrap">
            <button class="ds-btn ds-btn--primary ds-btn--lg">Large</button>
            <button class="ds-btn ds-btn--primary">Default</button>
            <button class="ds-btn ds-btn--primary ds-btn--sm">Small</button>
            <button class="ds-btn ds-btn--fab">
              <span class="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>

        <!-- SECCIÓN 3: Botones de lista contextual -->
        <div>
          <div class="section-label">Botones de lista contextual (ion-item)</div>
          <p class="section-desc">Se usan dentro de listas de acciones, drawers o toolbars de detalle.</p>
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

        <!-- SECCIÓN 4: Botón de acción principal -->
        <div>
          <div class="section-label">Botón de acción principal (expand="block")</div>
          <p class="section-desc">Footer de formularios y acciones primarias. Gradiente de marca, altura 52px.</p>
          <div class="flex flex-column gap-2">
            <ion-button-save label="Guardar" />
            <ion-button-save label="Actualizando..." [submitting]="true" />
          </div>
        </div>

        <!-- SECCIÓN 5: Toggle de estado -->
        <div>
          <div class="section-label">Toggle de estado (ion-button-active-desactive)</div>
          <p class="section-desc">Cambia entre Activo e Inactivo.</p>
          <div class="flex flex-column gap-2">
            <ion-button-active-desactive [state]="true"  activasLabel="Activos" inactivasLabel="Inactivos" />
            <ion-button-active-desactive [state]="false" activasLabel="Activos" inactivasLabel="Inactivos" />
          </div>
        </div>

        <!-- SECCIÓN 6: Botones compactos / toolbar -->
        <div>
          <div class="section-label">Botones compactos (icon-only)</div>
          <p class="section-desc">Se usan en toolbars de detalle. Son 40×40px.</p>
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
  styles: [MOBILE_SHOWCASE_STYLES, `
    .compact-toolbar { display: flex; gap: 1.5rem; align-items: flex-start; padding: 0.5rem; background: var(--ds-bg-elevated,#f4f5f8); border-radius: 10px; }
    .compact-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .compact-label { font-size: 0.65rem; color: var(--ds-text-muted,#94a3b8); font-weight: 500; }

    .ds-btn { display:inline-flex; align-items:center; justify-content:center; border:none; cursor:pointer; font-family:inherit; transition:all 150ms; font-weight:600; border-radius:8px; height:48px; padding:0 1.25rem; font-size:0.85rem; gap:0.5rem; }
    .ds-btn--flex { flex:1; }
    .ds-btn--primary { background:#00050e; color:#fff; box-shadow:0 2px 4px rgba(0,5,14,0.15); }
    .ds-btn--primary:hover { opacity:0.92; }
    .ds-btn--secondary { background:#d0e1fb; color:#54647a; }
    .ds-btn--outline { background:transparent; color:#00050e; border:1px solid #727687; }
    .ds-btn--text { background:transparent; color:#00050e; }
    .ds-btn--loading { opacity:0.7; cursor:wait; }
    .ds-btn--disabled { background:#cbd5e1; color:#94a3b8; cursor:not-allowed; box-shadow:none; }
    .ds-btn--lg { height:56px; padding:0 1.5rem; }
    .ds-btn--sm { height:32px; padding:0 0.75rem; font-size:0.78rem; border-radius:6px; }
    .ds-btn--fab { width:48px; height:48px; padding:0; border-radius:50%; background:#00050e; color:#fff; box-shadow:0 4px 12px rgba(0,5,14,0.25); }
    .ds-btn__spinner { font-size:1.1rem; animation:ds-spin 1.5s linear infinite; }
    @keyframes ds-spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
    .material-symbols-outlined { font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; vertical-align:middle; }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileButtons {}
