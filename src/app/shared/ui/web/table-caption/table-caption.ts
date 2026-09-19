import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  ChangeDetectionStrategy
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { WebButtonLabelAdd } from "@ui/buttons/web-label/button-add";
import { CustomSearchInput } from "@ui/inputs/web/custom-search-input-signal";
import { GlobalTableFilterService } from "@core/services/global-table-filter.service";

@Component({
  selector: "app-table-caption",
  templateUrl: "./table-caption.html",
  imports: [RouterModule, WebButtonLabelAdd, CustomSearchInput],
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TableCaption {
  private globalFilter = inject(GlobalTableFilterService);
  private destroyRef = inject(DestroyRef);

  dt = input<any>(undefined);
  showAdd = input<boolean>(true);
  label = input<string>("Agregar");
  rolAuth = input<boolean>(true);
  viewNavigateButton = input<boolean>(true);
  isDataView = input<boolean>(false);
  showSearch = input<boolean>(true);
  noMargin = input<boolean>(false);
  noPadding = input<boolean>(false);
  listenGlobalFilter = input<boolean>(true);

  add = output<any>();
  search = output<string>();

  constructor() {
    effect(() => {
      const term = this.globalFilter.filterTerm();
      const table = this.dt();
      if (this.listenGlobalFilter() && table && term !== undefined) {
        table.filterGlobal(term, "contains");
      }
    });
  }

  onAdd(data: any) {
    this.add.emit(data);
  }

  /**
   * Recibe el término ya resuelto por `custom-search-input-signal`
   * (`string`), lo publica por `(search)` y además lo aplica al filtro
   * global de la tabla para los consumidores client-side.
   *
   * Antes este método esperaba un `Event` nativo, pero el input se
   * reemplazó por `custom-search-input-signal`: el output `search` quedó
   * sin emitir y las tablas server-side (`[lazy]="true"`) nunca se
   * enteraban del término.
   */
  onSearch(value: string) {
    this.search.emit(value);
    const table = this.dt();
    if (table) {
      table.filterGlobal(value, "contains");
    }
  }
}
