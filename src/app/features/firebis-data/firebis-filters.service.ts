import { Injectable, signal } from "@angular/core";

/**
 * Servicio de estado global para los filtros de los reportes financieros Firebird.
 * El wrapper escribe aquí; los componentes individuales leen de aquí.
 */
@Injectable({ providedIn: "root" })
export class FirebisFiltersService {
  /** Ejercicio fiscal seleccionado (ej. 2025) */
  ejercicio = signal<number>(2025);

  /** Mes de corte (1 = Enero … 12 = Diciembre) */
  mes = signal<number>(12);

  /**
   * Contador que se incrementa cada vez que el usuario hace clic en "Generar".
   * Los componentes escuchan este signal con effect() para disparar loadData().
   */
  loadTrigger = signal<number>(0);

  /** Dispara la carga en todos los reportes activos */
  generar(): void {
    this.loadTrigger.update((n) => n + 1);
  }
}









