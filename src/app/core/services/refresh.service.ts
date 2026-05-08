import { Injectable, signal } from "@angular/core";

/**
 * 🔄 REFRESH SERVICE
 * -------------------------------------------------------------------------
 * Servicio global para coordinar acciones de actualización en la interfaz.
 * Permite que componentes (especialmente los de listados) reaccionen a eventos
 * de "Refrescar" disparados desde el Header o disparadores globales.
 */
@Injectable({
  providedIn: "root",
})
export class RefreshService {
  // Señal interna que se incrementa cada vez que se solicita un refresh
  private refreshSignal = signal<number>(0);

  // Señal para controlar la visibilidad del outlet (para forzar re-render)
  private outletVisibleSignal = signal<boolean>(true);

  // Exponemos las señales
  public readonly refreshTrigger = this.refreshSignal.asReadonly();
  public readonly outletVisible = this.outletVisibleSignal.asReadonly();

  /**
   * Dispara el evento de actualización.
   * Cualquier componente con un effect() que dependa de refreshTrigger() se ejecutará.
   */
  public triggerRefresh(): void {
    this.refreshSignal.update((n) => n + 1);
  }

  /**
   * Fuerza un re-render físico del router-outlet mediante un parpadeo de señal.
   */
  public forceRouteReload(): void {
    this.outletVisibleSignal.set(false);
    setTimeout(() => {
      this.outletVisibleSignal.set(true);
    }, 10);
  }
}
