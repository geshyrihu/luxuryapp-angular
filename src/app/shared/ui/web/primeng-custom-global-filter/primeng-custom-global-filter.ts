import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { Table } from "primeng/table";
import { AppIcon } from "../../shared/app-icon/app-icon.component";

/**
 * 🔍 GLOBAL FILTER
 * -------------------------------------------------------------------------
 * Campo de búsqueda global independiente.
 * Se conecta a una p-table para filtrar en todos los campos configurados.
 */
@Component({
  selector: "primeng-custom-global-filter",
  imports: [
    FormsModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <p-iconfield iconPosition="left" fluid>
      <p-inputicon>
        <app-icon icon="mdi:magnify" />
      </p-inputicon>
      <input
        pInputText
        type="text"
        (input)="onFilter($event)"
        placeholder="Buscar..."
        fluid
        pSize="small"
      />
    </p-iconfield>
  `,
})
export class PrimeNgCustomGlobalFilter {
  dt = input<Table | undefined>(undefined);

  onFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const table = this.dt();
    if (table) {
      table.filterGlobal(value, "contains");
    }
  }
}

