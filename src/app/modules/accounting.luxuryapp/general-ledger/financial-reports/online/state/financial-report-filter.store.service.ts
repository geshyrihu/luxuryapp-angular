import { Injectable, signal } from "@angular/core";

/**
 * Estado de filtro de reportes financieros (año/mes y contexto de reporte).
 *
 * Es un store inyectable con alcance por ruta: cada punto de entrada
 * (wrapper de reportes online, visor de reportes dinámicos) provee su propia
 * instancia, de modo que el año/mes seleccionado no se filtra entre rutas.
 */
@Injectable()
export class FinancialReportFilterStore {
  readonly year = signal<number>(new Date().getFullYear());
  readonly mesIdx = signal<number>(Math.max(2, new Date().getMonth() - 1));
  readonly refreshTick = signal<number>(0);
  readonly currentReportName = signal<string>("");
  readonly currentReportContext = signal<string>("");
}
