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
    <p-dialog
      header="Novedades de la versión 5.0.2"
      [visible]="service.showDialog()"
      (visibleChange)="onClose()"
      [modal]="true"
      [style]="{ width: '50vw', maxWidth: '600px' }"
      [breakpoints]="{ '960px': '75vw', '640px': '95vw' }"
      [draggable]="false"
      [resizable]="false"
      [closable]="true"
    >
      <div class="line-height-3">
        <p class="mb-4">
          Resumen rápido de las mejoras destacadas en la experiencia:
        </p>

        <ul class="pl-3 m-0 line-height-3">
          <li>Auditoría asistida para procesos de compras y validación documental.</li>
          <li>Listados con accesos directos a acciones y seguimiento.</li>
          <li>Mejoras de compartición por correo y canales operativos.</li>
          <li>Adjuntos PDF y trazabilidad más clara para revisiones.</li>
        </ul>

        <div class="surface-ground p-3 border-round mt-4 text-sm text-700">
          Recuerda guardar cambios antes de salir de un formulario o diálogo.
        </div>
      </div>

      <ng-template #footer>
        <p-button
          label="Entendido"
          (onClick)="onClose()"
          autofocus="true"
          styleClass="p-button-rounded"
        ></p-button>
      </ng-template>
    </p-dialog>
  `,
})
export class WhatsNew {
  public service = inject(FeatureAnnouncementService);

  onClose() {
    this.service.markAsSeen();
  }
}
