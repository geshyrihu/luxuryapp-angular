import { CommonModule } from "@angular/common";
import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { CardModule } from "primeng/card";
import { DataViewModule } from "primeng/dataview";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { ROUTES } from "src/app/routing/route-paths";
import { IDiagramDraw } from "../interfaces/diagram-draw";

@Component({
  selector: "app-diagram-gallery",
  imports: [
    CommonModule,
    DataViewModule,
    CardModule,
    WebButtonLabel,
    AppIcon,
    CustomInputTextSignal,
  ],
  template: `
    <div class="card p-4">
      <div class="flex justify-content-between align-items-center mb-4">
        <div class="flex align-items-center ">
          <h2 class="m-0">Galeróa de Diagramas</h2>
          <il-button
            label="Gestión"
            iconClass="mdi:format-list-bulleted"
            (clicked)="onOpenList()"
            severity="secondary"
            variant="text"
          />
        </div>
        <custom-input-text-signal
          placeholder="Buscar diagrama..."
          (input)="onFilter($event)"
          [horizontal]="false"
          noMargin
          onlyInput
        />
      </div>

      <p-dataView
        #dv
        [value]="diagrams()"
        [rows]="9"
        [paginator]="true"
        layout="grid"
      >
        <ng-template #grid let-items>
          <div class="grid grid-nogutter">
            <div class="col-12 md:col-4 p-2" *ngFor="let diagram of items">
              <p-card
                [header]="diagram.name"
                [subheader]="
                  'Actualizado: ' + (diagram.updateAt | date: 'dd/MM/yyyy')
                "
                styleClass="h-full shadow-2 hover:shadow-4 transition-duration-150"
              >
                <div
                  class="flex flex-column align-items-center justify-content-center py-4 bg-gray-50 border-round mb-3"
                  style="min-height: 150px"
                >
                  <app-icon
                    [icon]="'mdi:image-multiple'"
                    class="text-6xl text-primary-400"
                  />
                </div>
                <ng-template #footer>
                  <div class="flex ">
                    <il-button
                      label="Visualizar"
                      iconClass="mdi:eye-outline"
                      severity="success"
                      customClass="w-full"
                      (clicked)="onView(diagram.id)"
                    />
                  </div>
                </ng-template>
              </p-card>
            </div>
          </div>
        </ng-template>
      </p-dataView>
    </div>
  `,
})
export class DiagramGallery implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private customerIdService = inject(CustomerIdService);
  private router = inject(Router);

  diagrams = signal<IDiagramDraw[]>([]);
  allDiagrams: IDiagramDraw[] = [];
  loading = signal(true);

  constructor() {
    effect(() => {
      if (this.customerIdService.customerId()) {
        this.onLoadData();
      }
    });
  }

  ngOnInit(): void {}

  onLoadData() {
    const customerId = this.customerIdService.customerId();
    if (!customerId) return;

    this.loading.set(true);
    this.apiResponseS
      .onGetList<IDiagramDraw>(`DiagramDraw?customerId=${customerId}`)
      .then((result: any) => {
        this.diagrams.set(result);
        this.allDiagrams = result;
        this.loading.set(false);
      });
  }

  onView(id: string) {
    this.router.navigate(ROUTES.DIAGRAMAS.VER(id));
  }

  onOpenList() {
    this.router.navigate(ROUTES.DIAGRAMAS.LISTA);
  }

  onFilter(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    if (!query) {
      this.diagrams.set(this.allDiagrams);
      return;
    }
    const filtered = this.allDiagrams.filter((d) =>
      d.name.toLowerCase().includes(query),
    );
    this.diagrams.set(filtered);
  }
}
