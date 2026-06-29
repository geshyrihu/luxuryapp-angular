import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import {
  Component,
  computed,
  inject,
  input,
  output,
  Signal,
} from "@angular/core";
import { ButtonModule } from "primeng/button";
import { MessageModule } from "primeng/message";
import { OrdenCompraService } from "src/app/core/services/orden-compra.service";
@Component({
  selector: "app-orden-compra-datos-auth-parcial",
  templateUrl: "./orden-compra-datos-auth-parcial.html",
  imports: [ButtonModule, MessageModule, AppIcon],
})
export class OrdenCompraDatosAuthParcial {
  private ordenCompraService = inject(OrdenCompraService);
  ordenCompra = input.required<any>();
  bloqueada = input<boolean>();

  autorizarCompra = output<void>();
  deautorizarCompra = output<void>();

  // Crear computed signals específicas para cada condición
  public authorizationStatus = computed(() => {
    const status = this.ordenCompra()?.ordenCompraAuth?.statusOrdenCompra;
    const totalOC = this.ordenCompraService.totalOrdenCompra();
    const totalPorCubrir = this.ordenCompraService.totalPorCubrir();
    const isDevolucion = this.ordenCompra()?.isDevolucion;

    if (status === "Autorizado") {
      return {
        disabled: true,
        reason: "already_authorized",
        message: "La orden ya esté autorizada",
      };
    }

    if (totalOC <= 0 && !isDevolucion) {
      return {
        disabled: true,
        reason: "invalid_total",
        message: "El total de la orden debe ser mayor a cero",
      };
    }

    if (totalPorCubrir > 0 && !isDevolucion) {
      return {
        disabled: true,
        reason: "insufficient_budget",
        message: `Falta cubrir $${totalPorCubrir.toFixed(2)} del presupuesto`,
      };
    }

    return { disabled: false, reason: null, message: null };
  });

  // Mantener el signal original para compatibilidad
  public isAuthorizationDisabled: Signal<boolean> = computed(
    () => this.authorizationStatus().disabled,
  );
  // // REFACTOR: Se crea una `computed signal` para la lígica del botín de autorizar.
  // // Esto resuelve el bucle infinito porque solo se recalcula cuando uno de los
  // // signals de los que depende (`totalOrdenCompra` o `totalPorCubrir`) cambia su valor.
  // public isAuthorizationDisabled: Signal<boolean> = computed(() => {
  //   const status = this.ordenCompra?.ordenCompraAuth?.statusOrdenCompra;
  //   const totalOC = this.ordenCompraService.totalOrdenCompra();
  //   const totalPorCubrir = this.ordenCompraService.totalPorCubrir();

  //   // El botón se deshabilita si:
  //   // 1. Ya esté 'Autorizado'.
  //   // 2. El total de la orden de compra es cero o menos (no hay nada que pagar).
  //   // 3. Queda un monto por cubrir del presupuesto.
  //   return status === "Autorizado" || totalOC <= 0 || totalPorCubrir > 0;
  // });

  public canRevoke: Signal<boolean> = computed(() => {
    const status = this.ordenCompra()?.ordenCompraAuth?.statusOrdenCompra;
    const sePago = this.ordenCompra()?.ordenCompraStatus?.sePago;
    return !sePago && status === "Autorizado";
  });

  onAutorizarCompra() {
    this.autorizarCompra.emit();
  }

  onDeautorizarCompra() {
    this.deautorizarCompra.emit();
  }

  // REFACTOR: Los getters `hayMontoParaPagar` y `totalParaCubrir` se han eliminado.
  // Su lígica ahora vive dentro de la `computed signal` `isAuthorizationDisabled`.
}









