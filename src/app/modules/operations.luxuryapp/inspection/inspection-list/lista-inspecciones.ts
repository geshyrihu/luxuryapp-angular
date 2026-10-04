import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { PagedResultDto } from "@core/interfaces/paged-result.dto";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ROUTES } from "src/app/routing/route-paths";
import { InspeccionesForm } from "../inspections-add-edit/inspecciones-form";
import { InspectionListItem } from "../models/inspection.model";
import { ListaInspeccionesDesktop } from "./desktop/lista-inspecciones-desktop";
import { ListaInspeccionesMobile } from "./mobile/lista-inspecciones-mobile";

@Component({
  selector: "app-lista-inspecciones",
  imports: [RouterModule, ListaInspeccionesDesktop, ListaInspeccionesMobile],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./lista-inspecciones.html",
  styleUrls: ["./lista-inspecciones.scss"],
})
export class ListaInspecciones {
  readonly ROUTES = ROUTES;
  private router = inject(Router);
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  platformS = inject(PlatformService);

  areasResponsablesSignal = signal<SelectItemDto[]>([]);
  inspeccionesOriginalesSignal = signal<InspectionListItem[]>([]);

  selectedAreaSignal = signal<string>("");
  selectedRecurrenceSignal = signal<string>("");
  appliedAreaSignal = signal<string>("");
  appliedRecurrenceSignal = signal<string>("");

  inspeccionesFiltradasSignal = computed(() => {
    const original = this.inspeccionesOriginalesSignal();
    const area = this.appliedAreaSignal();
    const recurrence = this.appliedRecurrenceSignal();

    return original
      .map((group) => ({
        ...group,
        inspecciones: group.inspecciones.filter((inspeccion: any) => {
          const matchesArea = area === "" || group.areaResponsable === area;
          const matchesRecurrence =
            recurrence === "" || String(inspeccion.recurrenceUnit) === recurrence;
          return matchesArea && matchesRecurrence;
        }),
      }))
      .filter((group) => group.inspecciones.length > 0);
  });

  groupedData = computed(() => {
    const data = this.inspeccionesFiltradasSignal();
    const grouped: any = {};
    data.forEach((group) => {
      grouped[group.departament] = group.inspecciones;
    });
    return grouped;
  });

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  navigateToReportes() {
    this.router.navigate(ROUTES.INSPECCIONES.LISTA_INFORMES);
  }

  navigateToDetalles(id: string) {
    this.router.navigate(ROUTES.INSPECCIONES.DETALLE(id));
  }

  applyFilters(): void {
    this.appliedAreaSignal.set(this.selectedAreaSignal());
    this.appliedRecurrenceSignal.set(this.selectedRecurrenceSignal());
  }

  clearFilters(): void {
    this.selectedAreaSignal.set("");
    this.selectedRecurrenceSignal.set("");
    this.appliedAreaSignal.set("");
    this.appliedRecurrenceSignal.set("");
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<InspectionListItem[]>(
        Endpoints.Inspections.listByCustomer(
          this.customerIdS.customerId(),
          1,
          200,
        ),
      )
      .then((result) => {
        const data = result ?? [];
        this.inspeccionesOriginalesSignal.set(data);

        // Extraer áreas responsables del arreglo y eliminar duplicados
        const areas = [...new Set(data.map((item) => item.areaResponsable))];
        this.areasResponsablesSignal.set(
          areas.map((area) => ({
            label: area,
            value: area,
          })),
        );
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.Inspections.delete(id))
      .then((result) => {
        if (result) this.onLoadData();
      });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        InspeccionesForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}



