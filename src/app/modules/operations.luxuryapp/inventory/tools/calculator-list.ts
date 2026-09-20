import { Component, ChangeDetectionStrategy } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxMessage } from "@ui/adaptive/message/message";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
@Component({
  selector: "app-calculator-list",
  templateUrl: "./calculator-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, LxMessage, CustomInputNumberSignal],
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









