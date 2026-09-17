import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { EmptyState } from "@ui/web/empty-state/empty-state";
import { FileUpload } from "@ui/web/file-upload/file-upload";
import { FunnelChart } from "@ui/web/funnel-chart/funnel-chart";
import { DataGrid, DataGridColumn } from "@ui/web/data-grid/data-grid";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

const LABELS: Record<string, string> = {
  datagrid: "Data Grid",
  emptystate: "Empty State",
  fileupload: "File Upload",
  funnelchart: "Funnel Chart",
};

@Component({
  selector: "app-catalog-core-item",
  imports: [WebButtonLabel, EmptyState, FileUpload, FunnelChart, DataGrid, AppIcon],
  template: `
    <section class="fadein">
      <div class="section-header mb-4"><h2 class="text-3xl fw-bold m-0">{{ label() }}</h2></div>
      @switch (item()) {
        @case ("datagrid") {
          <div class="card"><div class="card-body">
            <app-data-grid [data]="gridData" [columns]="gridColumns" dataKey="id" [paginator]="true" [rows]="5" />
          </div></div>
        }
        @case ("emptystate") {
          <div class="card"><div class="card-body">
            <app-empty-state icon="material-symbols-light:inbox" title="Sin resultados" message="No se encontraron registros." actionLabel="Nuevo registro" />
          </div></div>
        }
        @case ("fileupload") {
          <div class="card"><div class="card-body"><app-file-upload chooseLabel="Subir archivos" accept="image/*,.pdf" [maxFileSize]="5000000" [multiple]="true" /></div></div>
        }
        @case ("funnelchart") {
          <div class="card"><div class="card-body"><app-funnel-chart title="Embudo de ventas" [labels]="['Leads', 'Contactados', 'Propuesta', 'Cerrados']" [values]="[1200, 820, 430, 95]" /></div></div>
        }
        @default {
          <div class="card"><div class="card-body d-flex align-items-center gap-2"><app-icon icon="material-symbols-light:info" /> Demo no disponible.</div></div>
        }
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogCoreItem {
  private readonly route = inject(ActivatedRoute);
  readonly item = signal("");
  readonly label = () => LABELS[this.item()] ?? this.item();
  readonly gridColumns: DataGridColumn[] = [
    { field: "name", header: "Nombre", type: "text", sortable: true },
    { field: "area", header: "Area", type: "text", sortable: true },
    { field: "active", header: "Activo", type: "boolean" },
  ];
  readonly gridData = [
    { id: 1, name: "Juan Garcia", area: "Operaciones", active: true },
    { id: 2, name: "Ana Martinez", area: "Contabilidad", active: true },
    { id: 3, name: "Luis Torres", area: "Ventas", active: false },
  ];

  constructor() {
    this.route.paramMap.subscribe((params) => this.item.set(params.get("item") ?? "datagrid"));
  }
}
