import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { AppCard } from "@ui/web/card/card";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { InspeccionActivoCondominio } from "../inspection-asset-add/inspeccion-activo-condominio";
import { InspeccionActivoCondominioEditar } from "../inspection-asset-edit/inspeccion-activo-condominio-editar";
import { InspeccionesForm } from "../inspections-add-edit/inspecciones-form";
import { InspectionEdit } from "../models/inspection.model";

@Component({
  selector: "app-inspection-detalle",

  imports: [
    CommonModule,
    RouterModule,
    AppCard,
    WebButtonIcon,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    ActionMenu,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4">
      @if (loading()) {
        <div class="text-center py-8">
          <p class="text-gray-500">Cargando...</p>
        </div>
      } @else if (error()) {
        <div class="p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p class="text-red-700">{{ error() }}</p>
        </div>
      } @else if (inspection()) {
        <app-card>
          <div class="d-flex justify-between items-start mb-6">
            <div>
              <h1 class="text-3xl font-bold mb-2">{{ inspection().name }}</h1>
              <div class="d-flex gap-4 text-sm text-gray-600">
                <span>
                  <strong>Departamento:</strong> {{ inspection().departament }}
                </span>
                <span>
                  <strong>Frecuencia:</strong>
                  {{ formatFrequency(inspection().frequency) }}
                </span>
                <span>
                  <strong>Estado:</strong>
                  {{ inspection().isActive ? "Activa" : "Inactiva" }}
                </span>
              </div>
            </div>
            <div class="d-flex gap-2">
              <button
                (click)="onEdit()"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Editar
              </button>
              <button
                (click)="onDelete()"
                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>

          <div class="row grid-cols-2 gap-6 mt-6">
            <div>
              <h3 class="font-semibold text-gray-700 mb-2">Detalles</h3>
              <div class="space-y-2 text-sm">
                <div>
                  <span class="text-gray-600">ID:</span>
                  <span class="ms-2 font-mono">{{ inspection().id }}</span>
                </div>
                <div>
                  <span class="text-gray-600">Cliente ID:</span>
                  <span class="ms-2 font-mono">{{
                    inspection().customerId
                  }}</span>
                </div>
                <div>
                  <span class="text-gray-600">Fecha de Creación:</span>
                  <span class="ms-2">{{
                    formatDate(inspection().createdAt)
                  }}</span>
                </div>
              </div>
            </div>

            @if (
              inspection().frequency === "weekly" && inspection().weeklyDays
            ) {
              <div>
                <h3 class="font-semibold text-gray-700 mb-2">Días Semanales</h3>
                <div class="d-flex flex-wrap gap-2">
                  @for (
                    day of getWeekdayLabels(inspection().weeklyDays);
                    track day
                  ) {
                    <span
                      class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {{ day }}
                    </span>
                  }
                </div>
              </div>
            } @else if (
              inspection().frequency === "monthly" && inspection().dayOfMonth
            ) {
              <div>
                <h3 class="font-semibold text-gray-700 mb-2">Día del Mes</h3>
                <span
                  class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  Día {{ inspection().dayOfMonth }}
                </span>
              </div>
            }
          </div>
         </app-card>

        <app-card class="mt-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-xl fw-bold m-0">Equipos y criterios de revisión</h2>
            <iw-button
              iconClass="material-symbols-light:add-circle"
              label="Agregar Equipo"
              lxTooltip="Agregar equipo al recorrido"
              (clicked)="onAddEquipment()"
            />
          </div>

          @if (equipmentItems().length > 0) {
            @for (item of equipmentItems(); track item.inspectionCondominiumAssetId) {
              <div class="card mb-4 p-4 border-outline">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h3 class="text-lg fw-bold m-0">{{ item.name | uppercase }}</h3>
                  <app-action-menu>
                    <ng-container actions>
                      <il-button-edit
                        label="Editar"
                        (clicked)="onEditEquipment(item)"
                      />
                      <il-button-delete
                        label="Eliminar"
                        (confirmed)="onDeleteArea(item.inspectionCondominiumAssetId)"
                      />
                    </ng-container>
                  </app-action-menu>
                </div>

                @if (item.reviews && item.reviews.length > 0) {
                  <div class="d-flex flex-column gap-3">
                    @for (review of item.reviews; track review.id) {
                      <div class="d-flex justify-content-between align-items-start gap-3 p-3 bg-surface rounded-md border-1 border-outline">
                        <p class="text-body-sm m-0 flex-grow-1">{{ review.description }}</p>
                        <il-button-delete
                          label="Eliminar"
                          (confirmed)="onDeleteReview(review.id, item.inspectionCondominiumAssetId)"
                        />
                      </div>
                    }
                  </div>
                } @else {
                  <p class="text-body-sm text-body-secondary m-0">
                    Sin criterios de revisión registrados
                  </p>
                }
              </div>
            }
          } @else {
            <p class="text-body-secondary m-0">
              No hay equipos configurados en este recorrido.
            </p>
          }
        </app-card>
      }
    </div>
  `,
})
export class InspectionDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly dialogHandlerS = inject(DialogHandlerService);
  private readonly destroyRef = inject(DestroyRef);

  inspection = signal<InspectionEdit | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  equipmentItems = signal<any[]>([]);

  weekdayNames = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.loadInspection(params["id"]);
        this.loadEquipment(params["id"]);
      });
  }

  private loadInspection(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.apiResponseS
      .onGetItem<InspectionEdit>(Endpoints.Inspections.getById(id))
      .then((result) => {
        if (result) {
          this.inspection.set(result);
        } else {
          this.error.set("No se encontró la inspección");
        }
      })
      .catch((err) => {
        console.error("Error loading inspection:", err);
        this.error.set("Error al cargar la inspección");
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  private loadEquipment(inspectionId: string): void {
    this.apiResponseS
      .onGetItem<any>(
        Endpoints.InspectionCondominiumAssets.listByInspection(inspectionId),
      )
      .then((result) => {
        this.equipmentItems.set(result?.amenities ?? result ?? []);
      })
      .catch((err) => {
        console.error("Error loading inspection equipment:", err);
        this.equipmentItems.set([]);
      });
  }

  onEdit(): void {
    if (!this.inspection()) return;

    this.dialogHandlerS
      .openDialog(
        InspeccionesForm,
        { id: this.inspection()?.id, title: "Editar Inspección" },
        "Editar Inspección",
        this.dialogHandlerS.sizeLg,
      )
      .then((result) => {
        if (result) {
          this.loadInspection(this.inspection()!.id);
        }
      });
  }

  onDelete(): void {
    if (!this.inspection()) return;

    if (confirm("¿Está seguro de que desea eliminar esta inspección?")) {
      this.apiResponseS
        .onDelete(Endpoints.Inspections.delete(this.inspection()!.id))
        .then(() => {
          window.history.back();
        });
    }
  }

  onAddEquipment(): void {
    const inspectionId = this.inspection()?.id;
    if (!inspectionId) return;

    this.dialogHandlerS
      .openDialog(
        InspeccionActivoCondominio,
        { inspectionId },
        "Agregar Equipo",
        this.dialogHandlerS.sizeLg,
      )
      .then((result) => {
        if (result) this.loadEquipment(inspectionId);
      });
  }

  onEditEquipment(item: any): void {
    const inspectionId = this.inspection()?.id;
    if (!inspectionId) return;

    this.dialogHandlerS
      .openDialog(
        InspeccionActivoCondominioEditar,
        {
          inspectionId,
          inspectionCondominiumAssetId: item.inspectionCondominiumAssetId,
        },
        "Editar equipo",
        this.dialogHandlerS.sizeLg,
      )
      .then((result) => {
        if (result) this.loadEquipment(inspectionId);
      });
  }

  onDeleteArea(assetId: string): void {
    this.apiResponseS
      .onDelete(Endpoints.InspectionCondominiumAssets.deleteArea(assetId))
      .then((result) => {
        if (result) {
          this.equipmentItems.update((items) =>
            items.filter(
              (item) => item.inspectionCondominiumAssetId !== assetId,
            ),
          );
        }
      });
  }

  onDeleteReview(reviewId: string, assetId: string): void {
    this.apiResponseS
      .onDelete(
        Endpoints.InspectionCondominiumAssets.deleteReview(reviewId),
      )
      .then((result) => {
        if (result) {
          this.equipmentItems.update((items) =>
            items.map((item) =>
              item.inspectionCondominiumAssetId === assetId
                ? {
                    ...item,
                    reviews: item.reviews.filter(
                      (review: any) => review.id !== reviewId,
                    ),
                  }
                : item,
            ),
          );
        }
      });
  }

  formatFrequency(frequency: string): string {
    const frequencies: { [key: string]: string } = {
      daily: "Diaria",
      weekly: "Semanal",
      monthly: "Mensual",
    };
    return frequencies[frequency] || frequency;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("es-MX");
  }

  getWeekdayLabels(days: number[]): string[] {
    return days.map((day) => this.weekdayNames[day % 7]);
  }
}
