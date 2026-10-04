import { CommonModule } from "@angular/common";
import {
  Component,
  inject,
  signal,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppTable } from "@ui/web/table/table";
import { AppTag } from "@ui/web/tag/tag";

type TagSeverity =
  "success" | "info" | "warn" | "danger" | "secondary" | "contrast";

const DOCS_LABELS: Record<string, string> = {
  documenttypes: "Document Types",
  nomenclature: "Nomenclature",
  accessmatrix: "Access Matrix",
};

@Component({
  selector: "app-catalog-docs-item",
  imports: [CommonModule, AppTable, AppTag],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">{{ label }}</h2>
      </div>
      @switch (item()) {
        @case ("documenttypes") {
          <lux-table-web [value]="tiposDocumento" class="p-datatable-sm">
            <ng-template #header
              ><tr>
                <th>Tipo</th>
                <th>Código</th>
                <th>Confidencialidad</th>
              </tr></ng-template
            >
            <ng-template #body let-doc>
              <tr>
                <td>{{ doc.tipo }}</td>
                <td>{{ doc.codigo }}</td>
                <td>
                  <lux-tag-web
                    [value]="doc.confidencialidad"
                    [severity]="doc.severity"
                  />
                </td>
              </tr>
            </ng-template>
          </lux-table-web>
        }
        @case ("nomenclature") {
          <lux-table-web [value]="camposNomenclatura" class="p-datatable-sm">
            <ng-template #header
              ><tr>
                <th>Campo</th>
                <th>Valores</th>
              </tr></ng-template
            >
            <ng-template #body let-row
              ><tr>
                <td>
                  <code>{{ row.campo }}</code>
                </td>
                <td>{{ row.valores }}</td>
              </tr></ng-template
            >
          </lux-table-web>
        }
        @case ("accessmatrix") {
          <lux-table-web [value]="matrizAcceso" class="p-datatable-sm">
            <ng-template #header
              ><tr>
                <th>Documento</th>
                <th>Super Usuario</th>
              </tr></ng-template
            >
            <ng-template #body let-row
              ><tr>
                <td>{{ row.documento }}</td>
                <td>{{ row.superUsuario }}</td>
              </tr></ng-template
            >
          </lux-table-web>
        }
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogDocsItem {
  private route = inject(ActivatedRoute);
  item = signal("");
  get label(): string {
    return DOCS_LABELS[this.item()] ?? this.item();
  }

  constructor() {
    this.route.paramMap.subscribe((p) => this.item.set(p.get("item") ?? ""));
  }

  readonly tiposDocumento = [
    {
      tipo: "Procedimiento Operativo",
      codigo: "PROC",
      confidencialidad: "Interno",
      severity: "info" as TagSeverity,
    },
    {
      tipo: "Manual Tecnico",
      codigo: "MANT",
      confidencialidad: "Restringido",
      severity: "danger" as TagSeverity,
    },
  ];

  readonly camposNomenclatura = [
    { campo: "TIPO", valores: "PROC, MANT, INST" },
    { campo: "DEPTO", valores: "ADMI, LEGA, MANT" },
  ];

  readonly matrizAcceso = [
    { documento: "Procedimiento Operativo", superUsuario: "Editar" },
    { documento: "Manual Tecnico", superUsuario: "Editar" },
  ];
}
