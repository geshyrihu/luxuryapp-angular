import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CommonModule } from "@angular/common";
import { AppCard } from "@ui/web/card/card";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { InspeccionesForm } from "../inspecciones-agregar-editar/inspecciones-form";
import { InspectionEdit } from "../models/inspection.model";

@Component({
  selector: "app-inspection-detalle",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AppCard,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    WebButtonIcon,
    AppIcon,
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
          <div class="flex justify-between items-start mb-6">
            <div>
              <h1 class="text-3xl font-bold mb-2">{{ inspection().name }}</h1>
              <div class="flex gap-4 text-sm text-gray-600">
                <span>
                  <strong>Departamento:</strong> {{ inspection().departament }}
                </span>
                <span>
                  <strong>Frecuencia:</strong> {{ formatFrequency(inspection().frequency) }}
                </span>
                <span>
                  <strong>Estado:</strong>
                  {{ inspection().isActive ? "Activa" : "Inactiva" }}
                </span>
              </div>
            </div>
            <div class="flex gap-2">
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

          <div class="grid grid-cols-2 gap-6 mt-6">
            <div>
              <h3 class="font-semibold text-gray-700 mb-2">Detalles</h3>
              <div class="space-y-2 text-sm">
                <div>
                  <span class="text-gray-600">ID:</span>
                  <span class="ml-2 font-mono">{{ inspection().id }}</span>
                </div>
                <div>
                  <span class="text-gray-600">Cliente ID:</span>
                  <span class="ml-2 font-mono">{{ inspection().customerId }}</span>
                </div>
                <div>
                  <span class="text-gray-600">Fecha de Creación:</span>
                  <span class="ml-2">{{ formatDate(inspection().createdAt) }}</span>
                </div>
              </div>
            </div>

            @if (inspection().frequency === "weekly" && inspection().weeklyDays) {
              <div>
                <h3 class="font-semibold text-gray-700 mb-2">Días Semanales</h3>
                <div class="flex flex-wrap gap-2">
                  @for (day of getWeekdayLabels(inspection().weeklyDays); track day) {
                    <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {{ day }}
                    </span>
                  }
                </div>
              </div>
            } @else if (
              inspection().frequency === "monthly" &&
              inspection().dayOfMonth
            ) {
              <div>
                <h3 class="font-semibold text-gray-700 mb-2">Día del Mes</h3>
                <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Día {{ inspection().dayOfMonth }}
                </span>
              </div>
            }
          </div>
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

  onEdit(): void {
    if (!this.inspection()) return;

    this.dialogHandlerS
      .openDialog(
        InspeccionesForm,
        { id: this.inspection()?.id, title: "Editar Inspección" },
        "Editar Inspección",
        this.dialogHandlerS.sizeLg
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
