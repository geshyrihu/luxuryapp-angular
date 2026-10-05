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
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { LxCard } from "@ui/adaptive/card/card";
import { LxSkeleton } from "@ui/adaptive/skeleton/skeleton";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { ButtonWeb } from "@ui/buttons/web";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { AppTag } from "@ui/web/tag/tag";
import { InspeccionActivoCondominio } from "../inspection-asset-add/inspeccion-activo-condominio";
import { InspeccionActivoCondominioEditar } from "../inspection-asset-edit/inspeccion-activo-condominio-editar";
import { InspeccionesForm } from "../inspections-add-edit/inspecciones-form";
import { InspectionEdit } from "../models/inspection.model";

@Component({
  selector: "app-inspection-detalle",

  imports: [
    ButtonWeb,
    CommonModule,
    RouterModule,
    LxCard,
    LxSkeleton,
    AppTag,
    AppIcon,
    WebButtonLabel,
    WebButtonLabelDelete,
    ActionMenu,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4">
      @if (loading()) {
        <div class="d-none d-md-flex flex-column gap-3">
          <lux-skeleton height="2rem" styleClass="mb-2" />
          <lux-skeleton height="1.5rem" />
          <lux-skeleton height="10rem" />
          <lux-skeleton height="10rem" />
        </div>
        <div class="d-flex d-md-none flex-column gap-3">
          <lux-skeleton height="2rem" styleClass="mb-2" />
          <lux-skeleton height="1.5rem" />
          <lux-skeleton height="10rem" />
          <lux-skeleton height="10rem" />
        </div>
      } @else if (error()) {
        <div class="p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p class="text-red-700">{{ error() }}</p>
        </div>
      } @else if (inspection()) {
        <div class="d-none d-md-block">
          <lux-card>
            <div class="d-flex justify-content-between align-items-start gap-3 mb-6">
              <div>
                <h1 class="text-3xl fw-bold mb-1">{{ inspection().name }}</h1>
                <p class="text-sm text-body-secondary m-0 mb-3">
                  Creado el {{ formatDate(inspection().createdAt) }}
                </p>
                <div class="d-flex flex-wrap gap-2">
                  <app-tag
                    [value]="formatFrequency(inspection().frequency)"
                    severity="info"
                    icon="material-symbols-light:calendar-month"
                  />
                  <app-tag
                    [value]="inspection().isActive ? 'Activa' : 'Inactiva'"
                    [severity]="inspection().isActive ? 'success' : 'secondary'"
                    icon="material-symbols-light:check-circle"
                  />
                  <app-tag
                    [value]="inspection().departament"
                    severity="secondary"
                    icon="material-symbols-light:apartment"
                  />
                  @if (
                    inspection().frequency === "weekly" &&
                    inspection().weeklyDays
                  ) {
                    @for (
                      day of getWeekdayLabels(inspection().weeklyDays);
                      track day
                    ) {
                      <app-tag
                        [value]="day"
                        severity="secondary"
                        icon="material-symbols-light:event-available"
                      />
                    }
                  } @else if (
                    inspection().frequency === "monthly" &&
                    inspection().dayOfMonth
                  ) {
                    <app-tag
                      [value]="'Día ' + inspection().dayOfMonth"
                      severity="secondary"
                      icon="material-symbols-light:event-available"
                    />
                  }
                </div>
              </div>
              <div class="d-flex gap-2">
                <lux-button-web
                  kind="edit"
                  displayMode="icon"
                  severity="info"
                  variant="soft"
                  size="sm"
                  (clicked)="onEdit()"
                />
                <il-button-delete
                  (confirmed)="onDelete()"
                  label="Eliminar"
                  displayMode="icon"
                  size="sm"
                />
              </div>
            </div>
          </lux-card>

          <lux-card class="mt-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h2 class="text-xl fw-bold m-0">
                Equipos y criterios de revisión
              </h2>
              @if (equipmentItems().length > 0) {
                <il-button
                  iconClass="material-symbols-light:add-circle"
                  label="Agregar Equipo"
                  size="sm"
                  (clicked)="onAddEquipment()"
                />
              }
            </div>

            @if (equipmentItems().length > 0) {
              @for (
                item of equipmentItems();
                track item.inspectionCondominiumAssetId
              ) {
                <lux-card class="mb-4">
                  <div
                    class="d-flex justify-content-between align-items-center mb-4 gap-3"
                  >
                    <div class="d-flex align-items-center gap-3 min-w-0">
                      <div
                        class="d-flex align-items-center justify-content-center rounded-circle bg-primary-100 text-primary-700 p-2 flex-shrink-0"
                      >
                        <app-icon icon="material-symbols-light:settings" />
                      </div>
                      <h3 class="text-lg fw-bold m-0 text-truncate">
                        {{ item.name | uppercase }}
                      </h3>
                    </div>
                    <div class="d-flex align-items-center gap-2 flex-shrink-0">
                      <app-tag
                        [value]="(item.reviews?.length ?? 0) + ' criterios'"
                        severity="secondary"
                      />
                      <app-action-menu>
                        <ng-container actions>
                          <lux-button-web
                            kind="edit"
                            severity="info"
                            variant="soft"
                            size="sm"
                            (clicked)="onEditEquipment(item)"
                          />
                          <il-button-delete
                            label="Eliminar"
                            size="sm"
                            (confirmed)="
                              onDeleteArea(item.inspectionCondominiumAssetId)
                            "
                          />
                        </ng-container>
                      </app-action-menu>
                    </div>
                  </div>

                  @if (item.reviews && item.reviews.length > 0) {
                    <div class="d-flex flex-column gap-3">
                      @for (review of item.reviews; track review.id) {
                        <div
                          class="d-flex justify-content-between align-items-start gap-3"
                        >
                          <div class="d-flex align-items-start gap-2">
                            <app-icon
                              icon="material-symbols-light:check-circle-outline"
                              class="text-success-600 flex-shrink-0"
                            />
                            <p class="text-body-sm m-0">
                              {{ review.description }}
                            </p>
                          </div>
                          <il-button-delete
                            label="Eliminar"
                            displayMode="icon"
                            size="sm"
                            (confirmed)="
                              onDeleteReview(
                                review.id,
                                item.inspectionCondominiumAssetId
                              )
                            "
                          />
                        </div>
                      }
                    </div>
                  } @else {
                    <p class="text-body-sm text-body-secondary m-0">
                      Sin criterios de revisión registrados
                    </p>
                  }
                </lux-card>
              }
            } @else {
              <div
                class="d-flex flex-column align-items-center text-center gap-3 py-5"
              >
                <app-icon
                  icon="material-symbols-light:construction"
                  class="text-5xl text-body-secondary"
                />
                <p class="text-body-secondary m-0">
                  No hay equipos configurados en este recorrido.
                </p>
                <il-button
                  label="Agregar el primer equipo"
                  iconClass="material-symbols-light:add-circle"
                  size="sm"
                  (clicked)="onAddEquipment()"
                />
              </div>
            }
          </lux-card>
        </div>
        <div class="d-block d-md-none">
          <lux-card>
            <div class="d-flex flex-column gap-3">
              <div>
                <h1 class="text-2xl fw-bold mb-1">{{ inspection().name }}</h1>
                <p class="text-sm text-body-secondary m-0 mb-3">
                  Creado el {{ formatDate(inspection().createdAt) }}
                </p>
                <div class="d-flex flex-wrap gap-2">
                  <app-tag
                    [value]="formatFrequency(inspection().frequency)"
                    severity="info"
                    icon="material-symbols-light:calendar-month"
                  />
                  <app-tag
                    [value]="inspection().isActive ? 'Activa' : 'Inactiva'"
                    [severity]="inspection().isActive ? 'success' : 'secondary'"
                    icon="material-symbols-light:check-circle"
                  />
                  <app-tag
                    [value]="inspection().departament"
                    severity="secondary"
                    icon="material-symbols-light:apartment"
                  />
                  @if (
                    inspection().frequency === "weekly" &&
                    inspection().weeklyDays
                  ) {
                    @for (
                      day of getWeekdayLabels(inspection().weeklyDays);
                      track day
                    ) {
                      <app-tag
                        [value]="day"
                        severity="secondary"
                        icon="material-symbols-light:event-available"
                      />
                    }
                  } @else if (
                    inspection().frequency === "monthly" &&
                    inspection().dayOfMonth
                  ) {
                    <app-tag
                      [value]="'Día ' + inspection().dayOfMonth"
                      severity="secondary"
                      icon="material-symbols-light:event-available"
                    />
                  }
                </div>
              </div>
              <div class="d-flex gap-2 flex-wrap">
                <lux-button-web
                  kind="edit"
                  displayMode="icon"
                  severity="info"
                  variant="soft"
                  size="sm"
                  (clicked)="onEdit()"
                />
                <il-button-delete
                  (confirmed)="onDelete()"
                  label="Eliminar"
                  displayMode="icon"
                  size="sm"
                />
              </div>
            </div>
          </lux-card>
          <lux-card class="mt-4">
            <div class="d-flex flex-column gap-3">
              <div class="d-flex flex-column gap-2">
                <h2 class="text-xl fw-bold m-0">
                  Equipos y criterios de revisión
                </h2>
                @if (equipmentItems().length > 0) {
                  <il-button
                    iconClass="material-symbols-light:add-circle"
                    label="Agregar Equipo"
                    size="sm"
                    (clicked)="onAddEquipment()"
                  />
                }
              </div>
              @if (equipmentItems().length > 0) {
                @for (
                  item of equipmentItems();
                  track item.inspectionCondominiumAssetId
                ) {
                  <lux-card class="mb-3">
                    <div
                      class="d-flex justify-content-between align-items-start gap-2 mb-3"
                    >
                      <div class="d-flex align-items-center gap-2 min-w-0">
                        <div
                          class="d-flex align-items-center justify-content-center rounded-circle bg-primary-100 text-primary-700 p-2 flex-shrink-0"
                        >
                          <app-icon icon="material-symbols-light:settings" />
                        </div>
                        <h3 class="text-lg fw-bold m-0 text-break">
                          {{ item.name | uppercase }}
                        </h3>
                      </div>
                      <div
                        class="d-flex align-items-center gap-2 flex-shrink-0"
                      >
                        <app-tag
                          [value]="(item.reviews?.length ?? 0) + ' criterios'"
                          severity="secondary"
                        />
                        <app-action-menu>
                          <ng-container actions>
                            <lux-button-web
                              kind="edit"
                              severity="info"
                              variant="soft"
                              (clicked)="onEditEquipment(item)"
                            />
                            <il-button-delete
                              label="Eliminar"
                              (confirmed)="
                                onDeleteArea(item.inspectionCondominiumAssetId)
                              "
                            />
                          </ng-container>
                        </app-action-menu>
                      </div>
                    </div>
                    @if (item.reviews && item.reviews.length > 0) {
                      <div class="d-flex flex-column gap-2">
                        @for (review of item.reviews; track review.id) {
                          <div
                            class="d-flex justify-content-between align-items-start gap-2"
                          >
                            <div class="d-flex align-items-start gap-2">
                              <app-icon
                                icon="material-symbols-light:check-circle-outline"
                                class="text-success-600 flex-shrink-0"
                              />
                              <p
                                class="text-body-sm m-0 flex-grow-1 text-break"
                              >
                                {{ review.description }}
                              </p>
                            </div>
                            <il-button-delete
                              label="Eliminar"
                              displayMode="icon"
                              size="sm"
                              (confirmed)="
                                onDeleteReview(
                                  review.id,
                                  item.inspectionCondominiumAssetId
                                )
                              "
                            />
                          </div>
                        }
                      </div>
                    } @else {
                      <p class="text-body-sm text-body-secondary m-0">
                        Sin criterios de revisión registrados
                      </p>
                    }
                  </lux-card>
                }
              } @else {
                <div
                  class="d-flex flex-column align-items-center text-center gap-3 py-5"
                >
                  <app-icon
                    icon="material-symbols-light:construction"
                    class="text-5xl text-body-secondary"
                  />
                  <p class="text-body-secondary m-0">
                    No hay equipos configurados en este recorrido.
                  </p>
                  <il-button
                    label="Agregar el primer equipo"
                    iconClass="material-symbols-light:add-circle"
                    size="sm"
                    (clicked)="onAddEquipment()"
                  />
                </div>
              }
            </div>
          </lux-card>
        </div>
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
        this.dialogHandlerS.sizeXl,
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
        this.dialogHandlerS.sizeXl,
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
        this.dialogHandlerS.sizeXl,
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
      .onDelete(Endpoints.InspectionCondominiumAssets.deleteReview(reviewId))
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
