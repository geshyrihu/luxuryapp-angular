import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  Signal,
} from "@angular/core";
import { OrdenCompraService } from "@purchases.luxuryapp/purchase-orders/services/orden-compra.service";
import { LxMessage } from "@ui/adaptive/message/message";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { PurchaseOrderAuthorizationStatus } from "@core/enums/purchase-order-authorization-status.enum";
import { PurchaseOrderView } from "../purchase-order.types";
@Component({
  selector: "app-orden-compra-datos-auth-parcial",
  templateUrl: "./orden-compra-datos-auth-parcial.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ LxIcon, WebButtonLabel, LxMessage],
})
export class OrdenCompraDatosAuthParcial {
  private ordenCompraService = inject(OrdenCompraService);
  ordenCompra = input.required<PurchaseOrderView>();
  bloqueada = input<boolean>();
  readonly purchaseOrderAuthorizationStatus = PurchaseOrderAuthorizationStatus;

  autorizarCompra = output<void>();
  deautorizarCompra = output<void>();

  // Crear computed signals específicas para cada condición
  public authorizationStatus = computed(() => {
    const status = this.ordenCompra()?.ordenCompraAuth?.statusOrdenCompra;
    const totalOC = this.ordenCompraService.totalOrdenCompra();
    const totalPorCubrir = this.ordenCompraService.totalPorCubrir();
    const isDevolucion = this.ordenCompra()?.isDevolucion;

    if (status === PurchaseOrderAuthorizationStatus.Autorizado) {
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
  public canRevoke: Signal<boolean> = computed(() => {
    const status = this.ordenCompra()?.ordenCompraAuth?.statusOrdenCompra;
    const sePago = this.ordenCompra()?.ordenCompraStatus?.sePago;
    return !sePago && status === PurchaseOrderAuthorizationStatus.Autorizado;
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
