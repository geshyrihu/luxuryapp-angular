import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

/**
 * Showcase de botones móviles — usa el COMPONENTE REAL `lux-button-mobile`
 * (`ButtonMobile`), no mockups. Si algo se ve mal aquí, se ve mal en la app.
 * Las acciones de negocio se expresan con `kind`, no con un selector por acción.
 */
@Component({
  selector: "app-mobile-buttons",
  imports: [MobileActionMenu, ButtonMobile],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Mobile Buttons · componentes reales</div>
      <div class="mobile-card-body">
        <div class="phone-frame">
          <div class="phone-frame__screen d-flex flex-column gap-4">
            <!-- Variantes semánticas (lux-button-mobile variant="…") -->
            <div>
              <div class="section-label">Variantes semánticas</div>
              <p class="section-desc">
                <code>&lt;lux-button-mobile variant="…"&gt;</code> — primary,
                secondary, outline, text, danger, ghost.
              </p>
              <div class="d-flex flex-column gap-2">
                <lux-button-mobile
                  variant="primary"
                  label="Primary"
                  expand="block"
                />
                <lux-button-mobile
                  variant="secondary"
                  label="Secondary"
                  expand="block"
                />
                <lux-button-mobile
                  variant="outline"
                  label="Outline"
                  expand="block"
                />
                <lux-button-mobile variant="text" label="Text" expand="block" />
                <lux-button-mobile
                  variant="danger"
                  label="Danger"
                  expand="block"
                />
                <lux-button-mobile
                  variant="ghost"
                  label="Ghost"
                  expand="block"
                />
              </div>
            </div>

            <!-- Tamaños -->
            <div>
              <div class="section-label">Tamaños</div>
              <p class="section-desc">small · default · large.</p>
              <div class="d-flex align-items-center gap-2 flex-wrap">
                <lux-button-mobile variant="primary" size="small" label="Small" />
                <lux-button-mobile variant="primary" label="Default" />
                <lux-button-mobile variant="primary" size="large" label="Large" />
              </div>
            </div>

            <!-- Acciones de negocio (kind semántico) -->
            <div>
              <div class="section-label">Acciones de negocio</div>
              <p class="section-desc">
                Cada botón trae icono, label y variante por defecto (delete →
                rojo) vía <code>kind</code>.
              </p>
              <div class="d-flex flex-column gap-2">
                <lux-button-mobile kind="add" expand="block" />
                <lux-button-mobile kind="edit" expand="block" />
                <lux-button-mobile kind="confirm" expand="block" />
                <lux-button-mobile kind="send-email" expand="block" />
                <lux-button-mobile kind="view-pdf" expand="block" />
                <lux-button-mobile kind="delete" expand="block" />
                <lux-button-mobile kind="download" expand="block" />
                <lux-button-mobile kind="item" expand="block" />
                <lux-button-mobile kind="tracking" expand="block" />
              </div>
            </div>

            <!-- Guardar / toggle -->
            <div>
              <div class="section-label">Guardar y estado</div>
              <div class="d-flex flex-column gap-2">
                <lux-button-mobile kind="save" expand="block" />
                <lux-button-mobile
                  kind="save"
                  label="Actualizando…"
                  [loading]="true"
                  expand="block"
                />
                <lux-button-mobile kind="active-desactive" expand="block" />
              </div>
            </div>

            <!-- Iconos compactos (displayMode="icon") -->
            <div>
              <div class="section-label">
                Iconos compactos (displayMode="icon")
              </div>
              <div class="d-flex align-items-center gap-3 flex-wrap">
                <lux-button-mobile
                  displayMode="icon"
                  ariaLabel="Acción personalizada"
                />
                <lux-button-mobile kind="add" displayMode="icon" />
                <lux-button-mobile kind="edit" displayMode="icon" />
                <lux-button-mobile kind="save" displayMode="icon" />
                <lux-button-mobile kind="delete" displayMode="icon" />
                <lux-button-mobile kind="confirm" displayMode="icon" />
                <lux-button-mobile kind="download" displayMode="icon" />
                <lux-button-mobile kind="send-email" displayMode="icon" />
                <lux-button-mobile kind="view-pdf" displayMode="icon" />
                <lux-button-mobile kind="active-desactive" displayMode="icon" />
                <lux-button-mobile kind="tracking" displayMode="icon" />
              </div>
            </div>

            <!-- Action-sheet real -->
            <div>
              <div class="section-label">Action-sheet (ili-action-menu)</div>
              <p class="section-desc">
                Toca el menú ⋮ — se abre como bottom-sheet nativo (CDK Overlay).
              </p>
              <div
                class="d-flex align-items-center justify-content-between p-2 border-round"
                style="background: var(--ds-bg-elevated)"
              >
                <span class="text-sm">Registro de ejemplo</span>
                <ili-action-menu title="Opciones">
                  <lux-button-mobile kind="edit" label="Editar" />
                  <lux-button-mobile kind="view-pdf" label="Ver PDF" />
                  <lux-button-mobile kind="delete" label="Eliminar" />
                </ili-action-menu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["../../shared/mobile-showcase-styles.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MobileButtons {}
