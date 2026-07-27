import { ChangeDetectionStrategy, Component, computed, signal } from "@angular/core";
import { UI_DICTIONARY, UIDictionaryItem } from "../shared/ui-dictionary";
import { DataGrid } from "@ui/web/data-grid/data-grid";
import { AppTag } from "@ui/web/tag/tag";
import { WebInputText } from "@ui/inputs/web/input-text/input-text";
import { FormsModule } from "@angular/forms";
import { AppCard } from "@ui/web/card/card";

@Component({
  selector: "app-dictionary-showcase",
  imports: [DataGrid, AppTag, WebInputText, FormsModule, AppCard],
  template: `
    <div class="p-4 fadein h-full flex flex-column">
      <div class="mb-4">
        <h2 class="text-2xl font-bold mb-2">Diccionario Completo de Componentes</h2>
        <p class="text-secondary">
          Listado autogenerado de todos los {{ totalCount() }} componentes disponibles en <code>shared/ui</code>.
          Utiliza este directorio para encontrar el selector y la ruta de importación de cualquier componente.
        </p>
      </div>

      <app-card class="flex-1 overflow-hidden flex flex-column">
        <div class="p-3 border-bottom-1 surface-border flex align-items-center justify-content-between">
          <div class="font-semibold">Filtro Rápido</div>
          <web-input-text 
            [placeholder]="'Buscar por nombre, selector o categoría...'" 
            [(ngModel)]="searchQuery" 
            (ngModelChange)="filterData()"
            styleClass="w-20rem"
          />
        </div>

        <div class="flex-1 overflow-auto">
          <app-data-grid
            [data]="filteredData()"
            [columns]="columns"
            [paginator]="true"
            [rows]="50"
            [rowsPerPageOptions]="[20, 50, 100, 200]"
          >
            <ng-template #body let-col="col" let-rowData="rowData">
              @if (col.field === 'category') {
                <app-tag [severity]="getCategorySeverity(rowData.category)">
                  {{ rowData.category | uppercase }}
                </app-tag>
              }
              @else if (col.field === 'path') {
                <code class="text-sm text-secondary">{{ rowData.path }}</code>
              }
              @else {
                <span class="font-medium">{{ rowData[col.field] }}</span>
              }
            </ng-template>
          </app-data-grid>
        </div>
      </app-card>
    </div>
  `,
  styles: [
    `
    :host { display: block; height: 100%; }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictionaryShowcaseComponent {
  searchQuery = signal('');
  
  allData = UI_DICTIONARY;
  filteredData = signal<UIDictionaryItem[]>(this.allData);
  totalCount = computed(() => this.allData.length);

  columns = [
    { field: "category", header: "Categoría", sortable: true },
    { field: "className", header: "Clase del Componente", sortable: true },
    { field: "selector", header: "Selector (<tag>)", sortable: true },
    { field: "path", header: "Ruta de Importación", sortable: true },
  ];

  filterData() {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      this.filteredData.set(this.allData);
      return;
    }
    
    const filtered = this.allData.filter(item => 
      item.className.toLowerCase().includes(query) ||
      item.selector.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.path.toLowerCase().includes(query)
    );
    this.filteredData.set(filtered);
  }

  getCategorySeverity(category: string): 'primary' | 'secondary' | 'success' | 'warn' | 'danger' {
    const map: Record<string, any> = {
      mobile: 'primary',
      web: 'secondary',
      adaptive: 'success',
      inputs: 'warn',
      buttons: 'danger'
    };
    return map[category] || 'secondary';
  }
}
