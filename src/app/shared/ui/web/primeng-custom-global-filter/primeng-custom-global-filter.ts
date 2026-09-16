import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppTable } from "@ui/web/table/table";
import { AppIcon } from "../../shared/app-icon/app-icon";

/**
 * 🔍 GLOBAL FILTER
 * -------------------------------------------------------------------------
 * Campo de búsqueda global independiente.
 * Se conecta a una p-table para filtrar en todos los campos configurados.
 */
@Component({
  selector: "primeng-custom-global-filter",
  imports: [FormsModule, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="input-group input-group-sm">
      <span class="input-group-text">
        <app-icon icon="material-symbols-light:search" />
      </span>
      <input
        type="text"
        (input)="onFilter($event)"
        placeholder="Buscar..."
        class="form-control"
      />
    </div>
  `,
})
export class PrimeNgCustomGlobalFilter {
  dt = input<AppTable | undefined>(undefined);

  onFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const table = this.dt();
    if (table) {
      table.filterGlobal(value, "contains");
    }
  }
}
