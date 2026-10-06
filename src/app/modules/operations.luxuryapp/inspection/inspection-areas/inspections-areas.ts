import { Component, ChangeDetectionStrategy } from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";

@Component({
  selector: "app-inspections-areas",
  imports: [LxIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card p-4 m-3">
      <div class="d-flex align-items-center gap-3">
        <lux-icon icon="material-symbols-light:construction" class="text-primary-600 text-2xl" />
        <div>
          <h1 class="text-xl fw-bold text-body m-0">Áreas de Inspección</h1>
          <p class="text-body-secondary m-0 mt-2">
            Próximamente — catálogo de áreas de inspección en desarrollo.
          </p>
        </div>
      </div>
    </div>
  `,
})
export class InspectionsAreas {}








