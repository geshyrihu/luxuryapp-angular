import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { Component, input, output, ChangeDetectionStrategy } from "@angular/core";
import { ButtonModule } from "primeng/button";

import { TooltipModule } from "primeng/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { LxTag } from "@ui/adaptive/tag/tag";
@Component({
  selector: "app-orden-compra-status-parcial",
  templateUrl: "./orden-compra-status-parcial.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ButtonModule, TooltipModule, AppIcon, WebButtonIcon, LxTag],
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









