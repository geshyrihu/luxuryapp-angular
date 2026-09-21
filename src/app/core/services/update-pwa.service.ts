import { DestroyRef, Injectable, inject } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UpdateService {
  // Mantiene pendiente una actualización sin obligar a la interfaz a mostrar
  // avisos. App decide cuándo es seguro activarla.
  private updateAvailableSubject = new BehaviorSubject<boolean>(false);
  public updateAvailable$: Observable<boolean> =
    this.updateAvailableSubject.asObservable();
  private readonly destroyRef = inject(DestroyRef);
  private activationInProgress = false;

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

      // El Service Worker descarga archivos nuevos en segundo plano. Solo
      // VERSION_READY significa que ya podemos cambiar a la nueva versión.
      this.swUpdate.versionUpdates
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event) => {
          console.log(
            `%c🔄 UpdateService: Evento recibido: ${event.type}`,
            "color: blue;",
          );

          if (event.type === "VERSION_READY") {
            console.log(
              `%c🔄 UpdateService: ✅ Nueva versión lista para activar. Notificando...`,
              "color: green; font-weight: bold;",
            );
            // Evita activaciones repetidas si el worker vuelve a emitir el evento.
            if (!this.updateAvailableSubject.value) {
              this.updateAvailableSubject.next(true);
            }
          }
        });

      // También verificamos una vez al inicio
      void this.swUpdate.checkForUpdate().catch((error: unknown) => {
        console.error("UpdateService: error verificando actualización", error);
      });
    } else {
      console.log(
        `%c🔄 UpdateService: ❌ Service Worker NO habilitado`,
        "color: red; font-weight: bold;",
      );
    }
  }

  // Activa versión pendiente y recarga únicamente cuando App detecta un punto
  // seguro: login, cambio de módulo, refresh voluntario o inactividad.
  async activateUpdate(): Promise<boolean> {
    console.log(
      `%c🔄 UpdateService: Intentando activar actualización...`,
      "color: orange; font-weight: bold;",
    );

    if (
      !this.swUpdate.isEnabled ||
      !this.updateAvailableSubject.value ||
      this.activationInProgress
    ) {
      console.log(
        `%c🔄 UpdateService: ❌ No se puede activar - SW: ${this.swUpdate.isEnabled}, Update disponible: ${this.updateAvailableSubject.value}, Activación en curso: ${this.activationInProgress}`,
        "color: red; font-weight: bold;",
      );
      return false;
    }

    this.activationInProgress = true;
    try {
      await this.swUpdate.activateUpdate();
      this.updateAvailableSubject.next(false);
      console.log(
        `%c🔄 UpdateService: ✅ Activando actualización y recargando`,
        "color: green; font-weight: bold;",
      );
      console.log(
        `%c🔄 UpdateService: 🔄 Recargando aplicación...`,
        "color: blue; font-weight: bold;",
      );
      window.location.reload();
      return true;
    } catch (error: unknown) {
      console.log(
        `%c🔄 UpdateService: ❌ Error activando actualización`,
        "color: red; font-weight: bold;",
      );
      console.error(error);
      this.updateAvailableSubject.next(false);
      return false;
    } finally {
      this.activationInProgress = false;
    }
  }

  // Este método ya no es estrictamente necesario si usamos el observable, pero lo mantenemos por si se necesita.
  isUpdateAvailable(): boolean {
    return this.updateAvailableSubject.value;
  }

  // Mantenemos la capacidad de forzar una verificación si es necesario desde alguna parte de la app.
  forceCheckUpdate(): void {
    if (this.swUpdate.isEnabled) {
      void this.swUpdate.checkForUpdate().catch((error: unknown) => {
        console.error("UpdateService: error verificando actualización", error);
      });
    }
  }
}
