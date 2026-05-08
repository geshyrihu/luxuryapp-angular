import { CommonModule } from "@angular/common";
import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from "primeng/dataview";
import { InputTextModule } from "primeng/inputtext";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { IDiagramDraw } from "../interfaces/diagram-draw";

@Component({
  selector: "app-diagram-gallery",
  imports: [
    CommonModule,
    DataViewModule,
    CardModule,
    InputTextModule,
    ButtonModule,
  ],
  template: `
    <div class="card p-4">
      <div class="flex justify-content-between align-items-center mb-4">
        <div class="flex align-items-center ">
          <h2 class="m-0">Galería de Diagramas</h2>
          <p-button
            label="Gestión"
            icon="pi pi-list"
            (click)="onOpenList()"
            severity="secondary"
            [text]="true"
          />
        </div>
        <span class="p-input-icon-left">
          <i class="pi pi-search"></i>
          <input
            type="text"
            pInputText
            placeholder="Buscar diagrama..."
            (input)="onFilter($event)"
          />
        </span>
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
                  <i class="pi pi-images text-6xl text-primary-400"></i>
                </div>
                <ng-template #footer>
                  <div class="flex ">
                    <button
                      pButton
                      label="Visualizar"
                      icon="pi pi-eye"
                      class="p-button-success w-full"
                      (click)="onView(diagram.id)"
                    ></button>
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
    this.router.navigate(["/diagram/view", id]);
  }

  onOpenList() {
    this.router.navigate(["/diagram"]);
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
