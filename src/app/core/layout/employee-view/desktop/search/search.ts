import { Component, inject } from "@angular/core";
import { LuxSearchInput } from "@ui/inputs/web/lux-search-input-signal";
import { GlobalTableFilterService } from "@core/services/global-table-filter.service";

@Component({
  selector: "app-search",
  template: `
    <lux-search-input-signal
      placeholder="Buscar en tabla actual..."
      (searchChange)="onSearch($event)"
    />
  `,
  imports: [LuxSearchInput],
})
export class Search {
  private globalFilter = inject(GlobalTableFilterService);

  onSearch(value: string): void {
    this.globalFilter.setFilter(value);
  }
}

