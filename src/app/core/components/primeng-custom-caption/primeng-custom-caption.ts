import { Component, EventEmitter, input, Output } from "@angular/core";
import { RouterModule } from "@angular/router";
// import { CustomButtonAdd } from "../buttons/custom-button-add";
import { CustomButtonAdd } from "../buttons/web/custom-button-add";
import { CustomSearchInput } from "../inputs/web/custom-search-input-signal";

/**
 * 🎛️ PRIMENG CUSTOM CAPTION
 * -------------------------------------------------------------------------
 * Barra de herramientas estándar para tablas PrimeNG.
 * Incluye búsqueda y botón de agregar, adaptándose a móvil y escritorio.
 */
@Component({
  selector: "primeng-custom-caption",
  templateUrl: "./primeng-custom-caption.html",
  imports: [RouterModule, CustomButtonAdd, CustomSearchInput],
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class PrimeNgCustomCaption {
  // <--- Inputs --->
  dt = input<any>(undefined);
  showAdd = input<boolean>(true);
  label = input<string>("Agregar");
  rolAuth = input<boolean>(true);
  viewNavigateButton = input<boolean>(true);
  isDataView = input<boolean>(false);
  showSearch = input<boolean>(true);
  noMargin = input<boolean>(false);
  noPadding = input<boolean>(false);

  // <--- Outputs --->
  @Output() add = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();

  onAdd(data: any) {
    this.add.emit(data);
  }

  onSearch(event: any) {
    const value = event.target.value;
    this.search.emit(value);
    const table = this.dt();
    if (table) {
      table.filterGlobal(value, "contains");
    }
  }
}
