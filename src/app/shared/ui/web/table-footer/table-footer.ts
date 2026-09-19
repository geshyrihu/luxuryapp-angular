import { Component, input, ChangeDetectionStrategy } from "@angular/core";

/**
 * 🦶 TABLE FOOTER
 * -------------------------------------------------------------------------
 * Pie de página simple para mostrar el conteo total de registros.
 */
@Component({
  selector: "app-table-footer",

  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="d-flex align-items-center justify-content-between">
      En total hay
      {{ data()?.length ?? 0 }} registros.
    </div>
  `,
})
export class TableFooter {
  data = input<any[]>([]);
}









