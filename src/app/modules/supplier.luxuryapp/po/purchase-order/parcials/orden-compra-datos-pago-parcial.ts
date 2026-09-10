import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ButtonModule } from "@ui/web/primeng-button/primeng-button";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
@Component({
  selector: "app-orden-compra-datos-pago-parcial",
  templateUrl: "./orden-compra-datos-pago-parcial.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ButtonModule, AppIcon, WebButtonIcon, LxTag],
})
export class OrdenCompraDatosPagoParcial {
  ordenCompra = input<any>();
  bloqueada = input<boolean>();
  modalOrdenCompra = output<void>();
  onModalOrdenCompraDatosPago() {
    this.modalOrdenCompra.emit();
  }
}
