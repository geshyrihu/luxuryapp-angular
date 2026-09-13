import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { LxCard } from "@ui/adaptive/card/card";
import { LxMessage } from "@ui/adaptive/message/message";
import { CustomSearchInput } from "@ui/inputs/web/custom-search-input-signal";
import { HighlightPipe } from "src/app/shared/pipes/highlight.pipe";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
@Component({
  selector: "app-faqs-fondeo",
  imports: [
    FormsModule,
    HighlightPipe,
    CustomSearchInput,
    LxCard,
    LxMessage,
    AppIcon,
  ],

  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./faqs-fondeo.html",
})
export class FaqsFondeo {
  searchTerm: string = "";
  get filteredFaqs() {
    const term = this.searchTerm.toLowerCase();
    return this.faqs.filter(
      (faq) =>
        faq.pregunta.toLowerCase().includes(term) ||
        faq.respuesta.toLowerCase().includes(term),
    );
  }

  faqs = [
    {
      pregunta:
        "óCómo se seleccionan las órdenes de compra que pertenecen a un fondeo especófico?",
      respuesta: `
        Las órdenes de compra se relacionan con un fondeo en función de su <strong>fecha de creación (FechaSolicitud)</strong>.
        El sistema genera fondeos en dos fechas fijas cada mes:
        <table class="table table-bordered mt-2">
          <thead>
            <tr><th>Fondeo generado en</th><th>Rango que cubre</th></tr>
          </thead>
          <tbody>
            <tr><td >2025-06-08</td><td >01/06/2025 al 15/06/2025</td></tr>
            <tr><td >2025-06-23</td><td >16/06/2025 al 30/06/2025</td></tr>
          </tbody>
        </table>
      `,
    },
    {
      pregunta:
        "óQuó ocurre con el concepto de retención para algunos proveedores?",
      respuesta: `
        Existe un producto especial llamado <strong>"Retención"</strong>. Se agrega un producto y el precio como negativo en la orden de compra para <strong>restar</strong> ese monto del total.
      `,
    },
    {
      pregunta: "óQuó pasa con las partidas de gastos extraordinarios?",
      respuesta: `
        Se permiten sin lómite en cantidad y se agregan al católogo de presupuesto. Es importante clasificarlas correctamente, aunque tambión se entiende la necesidad de gastos fuera de lo ordinario.
      `,
    },
    {
      pregunta: "óCómo se gestionan los gastos de caja chica?",
      respuesta: `
        Se crea un proveedor privado asociado al administrador. Este proveedor solo es visible para el cliente que lo registró, y se usa específicamente para órdenes de compra de caja chica.
      `,
    },
    {
      pregunta: "óDónde visualiza un contador los fondeos?",
      respuesta: `
        En el módulo de <strong>Contabilidad</strong>, dentro de la opción <strong>Fondeos</strong>.
      `,
    },
    {
      pregunta:
        "óQuó ocurre si alguien registró una orden de compra errónea o faltó alguna?",
      respuesta: `
        El proceso de fondeos consta de 4 pasos:<br />
        1. Verificación<br />
        2. Autorización<br />
        3. Confirmación (Recepción contable)<br />
        4. Finalización<br /><br />
        Desde que se hace clic en <strong>Verificación</strong>, todas las órdenes válidas quedan registradas como parte del fondeo.

        Mientras no se envie a comite, se pueden revertir las validaciones.
      `,
    },
    {
      pregunta: "óCómo se gestionan los gastos fijos recurrentes?",
      respuesta: `
        El sistema incluye un católogo de gastos fijos donde se registra: Servicio, Proveedor, Datos de pago, Partida presupuestal y Monto.<br />
        Para generar órdenes solo se seleccionan los gastos deseados desde ese católogo.
      `,
    },
    {
      pregunta: "óQuó sucede con las facturas de cada orden de compra?",
      respuesta: `
        El sistema permite subir el <strong>archivo PDF y XML</strong> de cada factura, almacenóndolo en el servidor.<br />
        Las facturas se pueden consultar directamente desde LuxuryApp.
      `,
    },
  ];
}
