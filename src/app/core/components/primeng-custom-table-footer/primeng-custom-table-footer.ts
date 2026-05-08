import { Component, input } from "@angular/core";

/**
 * 🦶 TABLE FOOTER
 * -------------------------------------------------------------------------
 * Pie de página simple para mostrar el conteo total de registros.
 */
@Component({
  selector: "primeng-custom-table-footer",

  template: `
    <div class="flex align-items-center justify-content-between">
      En total hay
      {{ data()?.length ?? 0 }} registros.
    </div>
  `,
})
export class PrimeNgCustomTableFooter {
  data = input<any[]>([]);
}









