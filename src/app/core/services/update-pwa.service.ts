import { Injectable } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";
import { BehaviorSubject, Observable } from "rxjs"; // CAMBIO: Importar BehaviorSubject y Observable

@Injectable({
  providedIn: "root",
})
export class UpdateService {
  // CAMBIO: Usamos un BehaviorSubject para notificar a los componentes de forma reactiva.
  private updateAvailableSubject = new BehaviorSubject<boolean>(false);
  public updateAvailable$: Observable<boolean> =
    this.updateAvailableSubject.asObservable();
  constructor(private swUpdate: SwUpdate) {
    console.log(
      `%c🔄 UpdateService: Inicializando servicio de actualizaciones`,
      "color: blue; font-weight: bold;",
    );

    if (this.swUpdate.isEnabled) {
      console.log(
        `%c🔄 UpdateService: ✅ Service Worker habilitado`,
        "color: green;",
      );

      // Escuchar continuamente por actualizaciones disponibles
      this.swUpdate.versionUpdates.subscribe((event) => {
        console.log(
          `%c🔄 UpdateService: Evento recibido: ${event.type}`,
          "color: blue;",
        );

        if (event.type === "VERSION_READY") {
          console.log(
            `%c🔄 UpdateService: ✅ Nueva versión lista para activar. Notificando...`,
            "color: green; font-weight: bold;",
          );
          // CAMBIO: En lugar de una variable simple, emitimos un valor a través del Subject.
          this.updateAvailableSubject.next(true);
        }
      });

      // También verificamos una vez al inicio
      this.swUpdate.checkForUpdate();
    } else {
      console.log(
        `%c🔄 UpdateService: ❌ Service Worker NO habilitado`,
        "color: red; font-weight: bold;",
      );
    }
  }

  // Este método ahora solo activa la actualización y recarga.
  // Será llamado desde la UI (el toast de notificación).
  activateUpdate(): void {
    console.log(
      `%c🔄 UpdateService: Intentando activar actualización...`,
      "color: orange; font-weight: bold;",
    );

    if (this.swUpdate.isEnabled && this.updateAvailableSubject.value) {
      console.log(
        `%c🔄 UpdateService: ✅ Activando actualización y recargando`,
        "color: green; font-weight: bold;",
      );

      this.swUpdate.activateUpdate().then(() => {
        console.log(
          `%c🔄 UpdateService: 🔄 Recargando aplicación...`,
          "color: blue; font-weight: bold;",
        );
        // La recarga se hace aquí, después de que el usuario da su consentimiento.
        window.location.reload();
      });
    } else {
      console.log(
        `%c🔄 UpdateService: ❌ No se puede activar - SW: ${this.swUpdate.isEnabled}, Update disponible: ${this.updateAvailableSubject.value}`,
        "color: red; font-weight: bold;",
      );
    }
  }

  // Este método ya no es estrictamente necesario si usamos el observable, pero lo mantenemos por si se necesita.
  isUpdateAvailable(): boolean {
    return this.updateAvailableSubject.value;
  }

  // Mantenemos la capacidad de forzar una verificación si es necesario desde alguna parte de la app.
  forceCheckUpdate(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate();
    }
  }
}









