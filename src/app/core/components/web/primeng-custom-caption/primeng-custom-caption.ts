import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { WebButtonLabelAdd } from "src/app/core/components/buttons/web/label/button-add";
import { CustomSearchInput } from "src/app/core/components/inputs/web/custom-search-input-signal";
import { GlobalTableFilterService } from "src/app/core/services/global-table-filter.service";

@Component({
  selector: "primeng-custom-caption",
  templateUrl: "./primeng-custom-caption.html",
  imports: [RouterModule, WebButtonLabelAdd, CustomSearchInput],
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class PrimeNgCustomCaption {
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

  onSearch(event: any) {
    const value = event.target.value;
    this.search.emit(value);
    const table = this.dt();
    if (table) {
      table.filterGlobal(value, "contains");
    }
  }
}
