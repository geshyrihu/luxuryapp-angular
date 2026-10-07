import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxMessage } from "@ui/adaptive/message/message";
import { LuxInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
@Component({
  selector: "app-calculator-list",
  templateUrl: "./calculator-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, LxMessage, LuxInputNumberSignal],
})
export class CalculatorList {
  precio: number = 0;
  precioSinIva: number = 0;
  iva: number = 0;
  calcularPrecioSinIva() {
    ((this.precioSinIva = this.precio / 1.16), 2);
    this.iva = (this.precioSinIva * 16) / 100;
  }
}
