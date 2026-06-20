import { Component, input } from "@angular/core";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";

interface NomenclaturaCampo {
  campo: string;
  valores: string;
}

@Component({
  selector: "app-doc-nomenclature",
  standalone: true,
  imports: [CardModule, TableModule],
  template: `
    <p-card header="Nomenclatura Inteligente">
      <div class="bg-primary text-white border-round-lg p-3 mb-3">
        <small class="text-yellow-500 font-bold block mb-1">FORMATO OBLIGATORIO</small>
        <code class="text-sm md:text-base">[TIPO]-[DEPTO]-[CODIGO]_v[X.Y]_[AAAA-MM]_[ESTADO].pdf</code>
      </div>
      <p-table [value]="camposNomenclatura()" styleClass="p-datatable-sm">
        <ng-template pTemplate="header"><tr><th>Campo</th><th>Valores</th></tr></ng-template>
        <ng-template pTemplate="body" let-row><tr><td><code>{{ row.campo }}</code></td><td class="text-xs">{{ row.valores }}</td></tr></ng-template>
      </p-table>
    </p-card>
  `,
})
export class DocNomenclature {
  camposNomenclatura = input<NomenclaturaCampo[]>([]);
  ejemploNomenclaturas = input<string[]>([]);
}
