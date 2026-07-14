// REFACTOR: Se ha refactorizado el servicio para utilizar Angular Signals.
// Esto mejora el rendimiento y la reactividad, y es clave para solucionar
// el bucle infinito en la detección de cambios.
import {
  inject,
  Injectable,
  OnDestroy,
  signal,
  WritableSignal,
} from "@angular/core";
import { Subject } from "rxjs";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";

@Injectable({
  providedIn: "root",
})
export class OrdenCompraService implements OnDestroy {
  apiResponseS = inject(ApiResponseService);
  private destroy$ = new Subject<void>();
  // REFACTOR: Los totales ahora son WritableSignal para una gestión de estado reactiva.
  // Los componentes pueden suscribirse a estos signals y reaccionar a sus cambios.
  totalOrdenCompra: WritableSignal<number> = signal(0);
  totalCubierto: WritableSignal<number> = signal(0);
  totalPorCubrir: WritableSignal<number> = signal(0);

  // REFACTOR: La comunicación del ID puede simplificarse, pero mantenemos la lógica original por ahora.
  private ordenCompraIdSignal: WritableSignal<string> = signal("");

  // Mantenemos estos para compatibilidad si otros componentes los usan.
  statusCompras: number = 2;

  constructor() {
    // El servicio ApiRequestService ya no se inyecta aquí, sino directamente con inject()
  }

  getOrdenCompraId(): string {
    return this.ordenCompraIdSignal();
  }

  setOrdenCompraId(ordenCompraId: string): void {
    this.ordenCompraIdSignal.set(ordenCompraId);
  }

  // REFACTOR: Los métodos `getTotal...` ya no son necesarios.
  // Los componentes accederán directamente a los signals (ej: `ordenCompraService.totalPorCubrir()`).

  async actualizarTotalOrdenCompra(ordenCompraId: string): Promise<void> {
    // Reseteamos los signals al inicio de la actualización.
    this.totalOrdenCompra.set(0);
    this.totalCubierto.set(0);
    this.totalPorCubrir.set(0);

    // Usamos el ApiRequestService que ya maneja async/await y loaders.
    const detalleResult: any = await this.apiResponseS.onGetList(
      Endpoints.PurchaseOrderDetails.getAllTotal(ordenCompraId),
    );
    if (detalleResult) {
      const nuevoTotalOC = detalleResult.reduce(
        (acc: number, n: any) => acc + n.total,
        0,
      );
      this.totalOrdenCompra.set(nuevoTotalOC);
    }

    const presupuestoResult: any = await this.apiResponseS.onGetList(
      Endpoints.PurchaseOrderBudgets.getAllForOrdenCompraTotal(ordenCompraId),
    );
    if (presupuestoResult) {
      const nuevoTotalCubierto = presupuestoResult.reduce(
        (acc: number, n: any) => acc + n.amount,
        0,
      );
      this.totalCubierto.set(nuevoTotalCubierto);
    }

    // El cálculo final se hace una vez que ambos valores están actualizados.
    const totalFinalPorCubrir =
      Math.round((this.totalOrdenCompra() - this.totalCubierto()) * 100) / 100;
    this.totalPorCubrir.set(totalFinalPorCubrir);
  }

  //... Estatus de compras
  setStatusCompras(statusCompras: number): void {
    this.statusCompras = statusCompras;
  }

  getStatusCompras(): number {
    return this.statusCompras;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
