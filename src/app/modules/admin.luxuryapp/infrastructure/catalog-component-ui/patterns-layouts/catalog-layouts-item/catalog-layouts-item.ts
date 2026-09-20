import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { AppDivider } from "@ui/web/divider/divider";

const LAYOUTS_LABELS: Record<string, string> = {
  fullwidth: "Full Width",
  sidebarcontent: "Sidebar + Content",
  masterdetail: "MasteróDetail",
  wizard: "Wizard (Stepper)",
  splitpanels: "Split Panels",
};

@Component({
  selector: "app-catalog-layouts-item",
  imports: [WebButtonLabel, AppDivider],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">{{ label }}</h2>
      </div>
      <div class="card">
        <p class="text-color-secondary">
          Layout <strong>{{ label }}</strong> é consulta la sección completa de
          Layouts para ver todas las variantes con ejemplos visuales.
        </p>
        <app-divider />
        <div class="d-flex gap-2">
          <il-button
            label="Ver todos los Layouts"
            iconClass="icon.grid"
            (clicked)="
              router.navigate(['/', 'settings', 'ui-catalog', 'layouts'])
            "
          />
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogLayoutsItem {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  item = signal("");
  get label(): string {
    return LAYOUTS_LABELS[this.item()] ?? this.item();
  }

  constructor() {
    this.route.paramMap.subscribe((p) => this.item.set(p.get("item") ?? ""));
  }
}
