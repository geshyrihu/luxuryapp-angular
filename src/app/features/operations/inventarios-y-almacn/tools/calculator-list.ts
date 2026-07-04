import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { MessageModule } from "primeng/message";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
@Component({
  selector: "app-calculator-list",
  templateUrl: "./calculator-list.html",
  imports: [FormsModule, MessageModule, CardModule, CustomInputNumberSignal],
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









