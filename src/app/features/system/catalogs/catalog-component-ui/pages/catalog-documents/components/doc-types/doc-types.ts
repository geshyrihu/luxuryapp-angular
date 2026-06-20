import { Component, input } from "@angular/core";
import { CardModule } from "primeng/card";
import { TagModule } from "primeng/tag";

interface TipoDocumento {
  tipo: string;
  codigo: string;
  destinatario: string;
  confidencialidad: string;
  colorToken: string;
  textColorToken: string;
  severity: "success" | "info" | "warn" | "danger" | "secondary" | "contrast";
}

@Component({
  selector: "app-doc-types",
  standalone: true,
  imports: [CardModule, TagModule],
  template: `
    <div class="grid">
      @for (doc of tiposDocumento(); track doc.codigo) {
        <div class="col-12 md:col-6 xl:col-4">
          <p-card styleClass="h-full overflow-hidden shadow-1 transition-all hover:shadow-3">
            <div class="flex align-items-center justify-content-between -mt-4 -mx-4 mb-3 px-4 py-3" [style.background]="doc.colorToken" [style.color]="doc.textColorToken">
              <strong>{{ doc.codigo }}</strong>
              <p-tag [value]="doc.confidencialidad" [severity]="doc.severity"></p-tag>
            </div>
            <div class="flex flex-column gap-2">
              <strong class="text-lg">{{ doc.tipo }}</strong>
              <span class="text-xs text-secondary">Audiencia: {{ doc.destinatario }}</span>
              <code class="block surface-100 border-1 surface-border border-round px-3 py-2 text-primary text-xs mt-2">
                {{ getNomenclaturaEjemplo(doc) }}
              </code>
            </div>
          </p-card>
        </div>
      }
    </div>
  `,
})
export class DocTypes {
  tiposDocumento = input<TipoDocumento[]>([]);

  getNomenclaturaEjemplo(doc: TipoDocumento): string {
    return `${doc.codigo}-DEPTO-001_v1.0_2026-04_VIGENTE.pdf`;
  }
}
