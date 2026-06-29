import { Component, inject } from "@angular/core";
import { CustomSearchInput } from "src/app/core/components/web/inputs/custom-search-input-signal";
import { GlobalTableFilterService } from "src/app/core/services/global-table-filter.service";

@Component({
  selector: "app-search",
  template: `
    <custom-search-input-signal
      placeholder="Buscar en tabla actual..."
      (searchChange)="onSearch($event)"
    />
  `,
  imports: [CustomSearchInput],
})
export class Search {
  private globalFilter = inject(GlobalTableFilterService);

  onSearch(value: string): void {
    this.globalFilter.setFilter(value);
  }
}

