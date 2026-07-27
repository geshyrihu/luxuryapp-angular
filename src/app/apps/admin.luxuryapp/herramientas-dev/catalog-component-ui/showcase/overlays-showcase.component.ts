import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { Dialog } from "@ui/web/dialog/dialog";
import { Sidebar } from "@ui/web/sidebar/sidebar";
import { AppMessage } from "@ui/web/message/message";
import { WebButtonLabel } from "@ui/buttons/web-label/button";

@Component({
  selector: "app-overlays-showcase",
  imports: [Dialog, Sidebar, AppMessage, WebButtonLabel],
  template: `
    <div class="p-4 fadein">
      <h2 class="text-2xl font-bold mb-4">Overlays & Modals</h2>
      <p class="text-secondary mb-6">
        Ejemplos de diálogos, modales, alertas y notificaciones.
      </p>

      <section class="mb-8">
        <h3 class="section-header">Dialog & Sidebar</h3>
        <div class="flex gap-4 mb-4">
          <il-button label="Abrir Dialog" (clicked)="dialogOpen.set(true)" />
          <il-button label="Abrir Sidebar" (clicked)="sidebarOpen.set(true)" severity="secondary" />
        </div>
        
        <app-dialog [(visible)]="dialogOpen" header="Dialogo de Ejemplo">
          <p>Contenido del modal</p>
        </app-dialog>

        <app-sidebar [(visible)]="sidebarOpen" position="right">
          <h3>Sidebar Content</h3>
          <p>Información complementaria</p>
        </app-sidebar>
      </section>

      <section class="mb-8">
        <h3 class="section-header">Messages</h3>
        <div class="flex flex-column gap-2 max-w-30rem">
          <app-message severity="info" text="Este es un mensaje informativo" />
          <app-message severity="success" text="Operación completada con éxito" />
          <app-message severity="warn" text="Advertencia de sistema" />
          <app-message severity="error" text="Ocurrió un error inesperado" />
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlaysShowcaseComponent {
  dialogOpen = signal(false);
  sidebarOpen = signal(false);
}
