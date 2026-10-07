import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { GlobalTableFilterService } from "@core/services/global-table-filter.service";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxSearchInput } from "@ui/inputs/web/lux-search-input-signal";

@Component({
  selector: "lux-table-caption",
  templateUrl: "./lux-table-caption.html",
  imports: [RouterModule, ButtonWeb, LuxSearchInput],
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host {
        display: block;
      }
    `],
})
export class LuxTableCaption {
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
   * Recibe el término ya resuelto por `lux-search-input-signal`
   * (`string`), lo publica por `(search)` y además lo aplica al filtro
   * global de la tabla para los consumidores client-side.
   *
   * Antes este método esperaba un `Event` nativo, pero el input se
   * reemplazó por `lux-search-input-signal`: el output `search` quedó
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
