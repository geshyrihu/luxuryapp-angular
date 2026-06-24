import { CommonModule } from "@angular/common";
import { Component, inject, signal, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { TagModule } from "primeng/tag";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";

const LAYOUTS_LABELS: Record<string, string> = {
  fullwidth: "Full Width",
  sidebarcontent: "Sidebar + Content",
  masterdetail: "Master–Detail",
  wizard: "Wizard (Stepper)",
  splitpanels: "Split Panels",
};

@Component({
  selector: "app-catalog-layouts-item",
  imports: [CommonModule, ButtonModule, CardModule, DividerModule, TagModule, AppIcon],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">{{ label }}</h2>
      </div>
      <p-card>
        <p class="text-color-secondary">Layout <strong>{{ label }}</strong> — consulta la sección completa de Layouts para ver todas las variantes con ejemplos visuales.</p>
        <p-divider />
        <div class="flex gap-2">
          <p-button label="Ver todos los Layouts" icon="mdi:grid" (click)="router.navigate(['/', 'settings', 'ui-catalog', 'layouts'])" />
        </div>
      </p-card>
    </section>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogLayoutsItem {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  item = signal(this.route.snapshot.paramMap.get('item') ?? '');
  label = LAYOUTS_LABELS[this.item()] ?? this.item();
}
