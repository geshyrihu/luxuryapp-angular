import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import {
  MobileButtonIconDownload,
  MobileButtonIconTracking,
} from "src/app/core/components/buttons/mobile-icon";
import {
  MobileButtonLabelActiveDesactive,
  MobileButtonLabelAdd,
  MobileButtonLabelConfirm,
  MobileButtonLabelDelete,
  MobileButtonLabelEdit,
  MobileButtonLabelItem,
  MobileButtonLabelSave,
  MobileButtonLabelSendEmail,
  MobileButtonLabelViewPdf,
} from "src/app/core/components/buttons/mobile-label";
import { MOBILE_SHOWCASE_STYLES } from "../../../../../shared/mobile-showcase-styles";

@Component({
  selector: "app-mobile-buttons",
  imports: [
    CommonModule,
    MobileButtonLabelAdd,
    MobileButtonLabelEdit,
    MobileButtonLabelSave,
    MobileButtonLabelDelete,
    MobileButtonLabelConfirm,
    MobileButtonIconDownload,
    MobileButtonLabelSendEmail,
    MobileButtonIconTracking,
    MobileButtonLabelViewPdf,
    MobileButtonLabelActiveDesactive,
    MobileButtonLabelItem,
  ],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Mobile Buttons - DS</div>
      <div class="mobile-card-body flex flex-column gap-5">
        <div>
          <div class="section-label">Variantes estandar</div>
          <p class="section-desc">
            Primary, secondary, outline y text con altura base de 48px para
            mobile.
          </p>
          <div class="flex flex-column gap-2">
            <div class="flex gap-2">
              <button class="ds-btn ds-btn--primary ds-btn--flex">
                Primary Action
              </button>
              <button class="ds-btn ds-btn--secondary ds-btn--flex">
                Secondary
              </button>
            </div>
            <div class="flex gap-2">
              <button class="ds-btn ds-btn--outline ds-btn--flex">
                Outline
              </button>
              <button class="ds-btn ds-btn--text ds-btn--flex">
                Text Button
              </button>
            </div>
            <div class="flex gap-2">
              <button
                class="ds-btn ds-btn--primary ds-btn--flex ds-btn--loading"
                disabled
              >
                <span class="material-symbols-outlined ds-btn__spinner"
                  >progress_activity</span
                >
                Processing
              </button>
              <button
                class="ds-btn ds-btn--primary ds-btn--flex ds-btn--disabled"
                disabled
              >
                Disabled
              </button>
            </div>
          </div>
        </div>

        <div>
          <div class="section-label">Size variants</div>
          <p class="section-desc">
            Large (56px), default (48px), small (32px) y FAB circular.
          </p>
          <div class="flex items-center gap-2 flex-wrap">
            <button class="ds-btn ds-btn--primary ds-btn--lg">Large</button>
            <button class="ds-btn ds-btn--primary">Default</button>
            <button class="ds-btn ds-btn--primary ds-btn--sm">Small</button>
            <button class="ds-btn ds-btn--fab">
              <span class="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>

        <div>
          <div class="section-label">Botones de lista contextual</div>
          <p class="section-desc">
            Uso recomendado dentro de listas, drawers y acciones de detalle.
          </p>
          <div class="flex flex-column gap-0">
            <ili-button-add label="Agregar registro" />
            <ili-button-edit label="Editar perfil" />
            <ili-button-confirm label="Confirmar accion" />
            <ili-button-send-email label="Enviar correo" />
            <ili-button-view-pdf
              url=""
              fileName="documento.pdf"
              label="Ver archivo PDF"
            />
            <ili-button-delete label="Eliminar registro" />
            <ili-button-item
              label="Accion personalizada"
            />
          </div>
        </div>

        <div>
          <div class="section-label">Boton principal</div>
          <p class="section-desc">
            Pensado para footers de formularios y acciones primarias.
          </p>
          <div class="flex flex-column gap-2">
            <ili-button-save label="Guardar" />
            <ili-button-save label="Actualizando..." [submitting]="true" />
          </div>
        </div>

        <div>
          <div class="section-label">Toggle de estado</div>
          <p class="section-desc">Alterna entre estados activos e inactivos.</p>
          <div class="flex flex-column gap-2">
            <ili-button-active-desactive
              [state]="true"
              activasLabel="Activos"
              inactivasLabel="Inactivos"
            />
            <ili-button-active-desactive
              [state]="false"
              activasLabel="Activos"
              inactivasLabel="Inactivos"
            />
          </div>
        </div>

        <div>
          <div class="section-label">Botones compactos</div>
          <p class="section-desc">
            Versiones compactas para toolbars de 40x40px.
          </p>
          <div class="compact-toolbar">
            <div class="compact-item">
              <ii-button-download />
              <span class="compact-label">Descargar</span>
            </div>
            <div class="compact-item">
              <ii-button-tracking [badgeCount]="3" [ticketId]="228" />
              <span class="compact-label">Seguimiento</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    MOBILE_SHOWCASE_STYLES,
    `
      .compact-toolbar {
        display: flex;
        gap: 1.5rem;
        align-items: flex-start;
        padding: 0.5rem;
        background: var(--ds-bg-elevated, #f4f5f8);
        border-radius: 10px;
      }
      .compact-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }
      .compact-label {
        font-size: 0.65rem;
        color: var(--ds-text-muted, #94a3b8);
        font-weight: 500;
      }

      .ds-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
        cursor: pointer;
        font-family: inherit;
        transition: all 150ms;
        font-weight: 600;
        border-radius: 8px;
        height: 48px;
        padding: 0 1.25rem;
        font-size: 0.85rem;
        gap: 0.5rem;
      }
      .ds-btn--flex {
        flex: 1;
      }
      .ds-btn--primary {
        background: #00050e;
        color: #fff;
        box-shadow: 0 2px 4px rgba(0, 5, 14, 0.15);
      }
      .ds-btn--primary:hover {
        opacity: 0.92;
      }
      .ds-btn--secondary {
        background: #d0e1fb;
        color: #54647a;
      }
      .ds-btn--outline {
        background: transparent;
        color: #00050e;
        border: 1px solid #727687;
      }
      .ds-btn--text {
        background: transparent;
        color: #00050e;
      }
      .ds-btn--loading {
        opacity: 0.7;
        cursor: wait;
      }
      .ds-btn--disabled {
        background: #cbd5e1;
        color: #94a3b8;
        cursor: not-allowed;
        box-shadow: none;
      }
      .ds-btn--lg {
        height: 56px;
        padding: 0 1.5rem;
      }
      .ds-btn--sm {
        height: 32px;
        padding: 0 0.75rem;
        font-size: 0.78rem;
        border-radius: 6px;
      }
      .ds-btn--fab {
        width: 48px;
        height: 48px;
        padding: 0;
        border-radius: 50%;
        background: #00050e;
        color: #fff;
        box-shadow: 0 4px 12px rgba(0, 5, 14, 0.25);
      }
      .ds-btn__spinner {
        font-size: 1.1rem;
        animation: ds-spin 1.5s linear infinite;
      }
      @keyframes ds-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
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
  encapsulation: ViewEncapsulation.None,
})
export class MobileButtons {}

