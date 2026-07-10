import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import {
  MobileButtonIconDownload,
  MobileButtonIconEdit,
  MobileButtonIconTracking,
} from "@ui/buttons/mobile-icon";
import {
  MobileButtonLabel,
  MobileButtonLabelActiveDesactive,
  MobileButtonLabelAdd,
  MobileButtonLabelConfirm,
  MobileButtonLabelDelete,
  MobileButtonLabelEdit,
  MobileButtonLabelSave,
  MobileButtonLabelSendEmail,
  MobileButtonLabelViewPdf,
} from "@ui/buttons/mobile-label";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

/**
 * Showcase de botones móviles — usa los COMPONENTES REALES `ili-*` / `ii-*`,
 * no mockups. Si algo se ve mal aquí, se ve mal en la app.
 */
@Component({
  selector: "app-mobile-buttons",
  imports: [
    CommonModule,
    MobileButtonLabel,
    MobileButtonLabelAdd,
    MobileButtonLabelEdit,
    MobileButtonLabelSave,
    MobileButtonLabelDelete,
    MobileButtonLabelConfirm,
    MobileButtonLabelSendEmail,
    MobileButtonLabelViewPdf,
    MobileButtonLabelActiveDesactive,
    MobileButtonIconEdit,
    MobileButtonIconDownload,
    MobileButtonIconTracking,
    MobileActionMenu,
  ],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Mobile Buttons · componentes reales</div>
      <div class="mobile-card-body">
        <div class="phone-frame">
          <div class="phone-frame__screen flex flex-column gap-4">
            <!-- Variantes semánticas (ili-button variant="…") -->
            <div>
              <div class="section-label">Variantes semánticas</div>
              <p class="section-desc">
                <code>&lt;ili-button variant="…"&gt;</code> — primary,
                secondary, outline, text, danger, ghost.
              </p>
              <div class="flex flex-column gap-2">
                <ili-button variant="primary" label="Primary" expand="block" />
                <ili-button
                  variant="secondary"
                  label="Secondary"
                  expand="block"
                />
                <ili-button variant="outline" label="Outline" expand="block" />
                <ili-button variant="text" label="Text" expand="block" />
                <ili-button variant="danger" label="Danger" expand="block" />
                <ili-button variant="ghost" label="Ghost" expand="block" />
              </div>
            </div>

            <!-- Tamaños -->
            <div>
              <div class="section-label">Tamaños</div>
              <p class="section-desc">small · default · large.</p>
              <div class="flex align-items-center gap-2 flex-wrap">
                <ili-button variant="primary" size="small" label="Small" />
                <ili-button variant="primary" label="Default" />
                <ili-button variant="primary" size="large" label="Large" />
              </div>
            </div>

            <!-- Acciones de negocio (semánticas) -->
            <div>
              <div class="section-label">Acciones de negocio</div>
              <p class="section-desc">
                Cada botón trae icono, label y variante por defecto (delete →
                rojo).
              </p>
              <div class="flex flex-column gap-2">
                <ili-button-add expand="block" />
                <ili-button-edit expand="block" />
                <ili-button-confirm expand="block" />
                <ili-button-send-email expand="block" />
                <ili-button-view-pdf
                  url=""
                  fileName="documento.pdf"
                  expand="block"
                />
                <ili-button-delete expand="block" />
              </div>
            </div>

            <!-- Guardar / toggle -->
            <div>
              <div class="section-label">Guardar y estado</div>
              <div class="flex flex-column gap-2">
                <ili-button-save expand="block" />
                <ili-button-save
                  label="Actualizando…"
                  [submitting]="true"
                  expand="block"
                />
                <ili-button-active-desactive
                  [state]="true"
                  activasLabel="Activos"
                  inactivasLabel="Inactivos"
                  expand="block"
                />
              </div>
            </div>

            <!-- Iconos compactos -->
            <div>
              <div class="section-label">Iconos compactos (ii-*)</div>
              <div class="flex align-items-center gap-3">
                <ii-button-edit />
                <ii-button-download />
                <ii-button-tracking [badgeCount]="3" [ticketId]="228" />
              </div>
            </div>

            <!-- Action-sheet real -->
            <div>
              <div class="section-label">Action-sheet (ili-action-menu)</div>
              <p class="section-desc">
                Toca el menú ⋮ — se abre como bottom-sheet nativo (CDK Overlay).
              </p>
              <div
                class="flex align-items-center justify-content-between p-2 border-round"
                style="background: var(--ds-bg-elevated)"
              >
                <span class="text-sm">Registro de ejemplo</span>
                <ili-action-menu title="Opciones">
                  <ili-button-edit label="Editar" />
                  <ili-button-view-pdf
                    url=""
                    fileName="doc.pdf"
                    label="Ver PDF"
                  />
                  <ili-button-delete label="Eliminar" />
                </ili-action-menu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["../../../../shared/mobile-showcase-styles.css"],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileButtons {}
