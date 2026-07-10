import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { resolveToIconify } from "src/app/shared/utils/icon-mapping";

const AUDIT_LABELS: Record<string, string> = {
  contentblocks: "Content Blocks",
  quickchecklist: "Quick Checklist",
};

@Component({
  selector: "app-catalog-audit-item",
  imports: [CommonModule, FormsModule, CardModule, CheckboxModule, AppIcon],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">{{ label }}</h2>
      </div>
      @switch (item()) {
        @case ("contentblocks") {
          <div class="grid">
            @for (b of bloques; track b.titulo) {
              <div class="col-12 lg:col-4">
                <div class="border-round-xl border-1 p-4 h-full">
                  <div class="flex align-items-center gap-2 mb-3">
                    <app-icon [icon]="iconifyIcon(b.icono)" class="text-xl" />
                    <strong>{{ b.titulo }}</strong>
                  </div>
                  <p class="m-0 text-color-secondary text-sm">
                    {{ b.descripcion }}
                  </p>
                </div>
              </div>
            }
          </div>
        }
        @case ("quickchecklist") {
          <div class="grid">
            @for (item of checklist(); track item.numero) {
              <div class="col-12 md:col-6">
                <div
                  class="flex align-items-start gap-3 border-round-lg border-1 p-3"
                  [class.bg-green-50]="item.aprobado"
                  (click)="toggleChecklistItem(item.numero)"
                >
                  <p-checkbox
                    [ngModel]="item.aprobado"
                    (ngModelChange)="toggleChecklistItem(item.numero)"
                    [binary]="true"
                  />
                  <p class="m-0 text-sm">
                    <strong>{{ item.numero }}.</strong> {{ item.descripcion }}
                  </p>
                </div>
              </div>
            }
          </div>
        }
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogAuditItem {
  private route = inject(ActivatedRoute);
  item = signal("");
  get label(): string {
    return AUDIT_LABELS[this.item()] ?? this.item();
  }

  constructor() {
    this.route.paramMap.subscribe((p) => this.item.set(p.get("item") ?? ""));
  }

  readonly bloques = [
    {
      titulo: "Advertencia",
      icono: "icon.alert",
      descripcion: "Riesgo fósico, legal o económico.",
    },
    {
      titulo: "Nota",
      icono: "icon.information",
      descripcion: "Información complementaria.",
    },
  ];

  checklist = signal([
    { numero: 1, descripcion: "Código sigue nomenclatura.", aprobado: true },
    { numero: 2, descripcion: "Portada completa.", aprobado: false },
  ]);

  toggleChecklistItem(numero: number): void {
    this.checklist.update((items) =>
      items.map((i) =>
        i.numero === numero ? { ...i, aprobado: !i.aprobado } : i,
      ),
    );
  }

  iconifyIcon(cls: string): string {
    return resolveToIconify(cls, "icon.cog");
  }
}
