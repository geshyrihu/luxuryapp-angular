import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { ButtonModule } from "@ui/web/primeng-button/primeng-button";

@Component({
  selector: "app-orden-compra-status-parcial",
  templateUrl: "./orden-compra-status-parcial.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ AppIcon, WebButtonIcon, LxTag],
})
export class OrdenCompraStatusParcial {
  ordenCompra = input<any>();
  mostrarTabla = input<boolean>();
  ordenCompraPresupuestoUtilizado = input<boolean>();
  bloqueada = input<boolean>();
  modalOrdenCompra = output<void>();

  onModalOrdenCompraStatus() {
    this.modalOrdenCompra.emit();
  }
}
