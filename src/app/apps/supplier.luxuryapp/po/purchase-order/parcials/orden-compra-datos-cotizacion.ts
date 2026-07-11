import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { ButtonModule } from "primeng/button";
@Component({
  selector: "app-orden-compra-datos-cotizacion",
  templateUrl: "./orden-compra-datos-cotizacion.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterModule, ButtonModule, AppIcon, WebButtonIcon],
})
export class OrdenCompraDatosCotizacion {
  ordenCompra = input<any>();
  bloqueada = input<boolean>();
  solicitudCompraId = input<string>("");
  modalOrdenCompra = output<void>();
  onModalOrdenCompra() {
    this.modalOrdenCompra.emit();
  }
}
