import { Component, inject } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { FeatureAnnouncementService } from "src/app/core/services/feature-announcement.service";

/**
 * 🎉 WHATS NEW
 * -------------------------------------------------------------------------
 * Dialogo modal que muestra el changelog o novedades de la versión.
 * Se controla via FeatureAnnouncementService.
 */
@Component({
  selector: "app-whats-new",
  imports: [DialogModule, ButtonModule],
  template: `
    <!-- <p-dialog
      header="🎉 ¡Novedades de la Versión 5.0.2!"
      [visible]="service.showDialog()"
      (visibleChange)="onClose()"
      [modal]="true"
      [style]="{ width: '50vw', maxWidth: '600px' }"
      [breakpoints]="{ '960px': '75vw', '640px': '95vw' }"
      [draggable]="false"
      [resizable]="false"
      [closable]="true"
    >
      <div class="line-height-3 text-lg">
        <p class="mb-4">
          ¡Hola! Hemos trabajado duro para traerte estas mejoras increíbles:
        </p>

        <ul class="list-none p-0 m-0">
          <li class="flex items-start mb-3">
            <app-icon [icon]="'mdi:check-circle'" class="pi text-green-500 mr-2 mt-1"
              style="font-size: 1.2rem"
            ></app-icon>
            <div>
              <span class="font-bold text-900">Auditoría IA en Compras 🤖</span>
              <p class="text-600 m-0">
                Ahora puedes auditar cotizaciones automáticamente. Detecta
                errores, sugerencias de precios y valida PDFs escaneados.
              </p>
            </div>
          </li>

          <li class="flex items-start mb-3">
            <app-icon [icon]="'mdi:check-circle'" class="pi text-green-500 mr-2 mt-1"
              style="font-size: 1.2rem"
            ></app-icon>
            <div>
              <span class="font-bold text-900"
                >Listado de Solicitudes Mejorado 📊</span
              >
              <p class="text-600 m-0">
                Nueva columna "Cotizaciones" con acceso directo al cuadro
                comparativo.
              </p>
            </div>
          </li>

          <li class="flex items-start mb-3">
            <app-icon [icon]="'mdi:check-circle'" class="pi text-green-500 mr-2 mt-1"
              style="font-size: 1.2rem"
            ></app-icon>
            <div>
              <span class="font-bold text-900">Compartir Solicitudes 🚀</span>
              <p class="text-600 m-0">
                Comparte tu solicitud por WhatsApp o Correo mediante una lista
                de texto simple y directa.
              </p>
            </div>
          </li>

          <li class="flex items-start mb-3">
            <app-icon [icon]="'mdi:check-circle'" class="pi text-green-500 mr-2 mt-1"
              style="font-size: 1.2rem"
            ></app-icon>
            <div>
              <span class="font-bold text-900"
                >Adjuntar Cotizaciones PDF 📎</span
              >
              <p class="text-600 m-0">
                Ahora puedes adjuntar el PDF original de la cotización del
                proveedor para un mejor control y auditoría.
              </p>
            </div>
          </li>
        </ul>

        <div class="surface-ground p-3 border-round mt-4 text-sm text-700">
          <app-icon [icon]="'mdi:information'" class="pi mr-1"></app-icon>
          Recuerda usar el botón <strong>"Guardar Cambios"</strong> al editar
          cotizaciones.
        </div>
      </div>

      <ng-template #footer>
        <p-button
          label="¡Entendido, gracias!"
          icon="mdi:thumb-up"
          (onClick)="onClose()"
          autofocus="true"
          styleClass="p-button-rounded "
        ></p-button>
      </ng-template>
    </p-dialog> -->
  `,
})
export class WhatsNew {
  public service = inject(FeatureAnnouncementService);

  onClose() {
    this.service.markAsSeen();
  }
}
