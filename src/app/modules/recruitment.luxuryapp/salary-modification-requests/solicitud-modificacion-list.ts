import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { EndpointsReclutamiento } from "@core/constants/endpoints/reclutamiento.endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { FilterRequestsService } from "@core/http/services/filter-requests.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { StatusSolicitudVacanteService } from "@recruitment.luxuryapp/vacancy-requests/services/status-solicitud-vacante.service";
import { addIcons } from "ionicons";
import { trendingUpOutline } from "ionicons/icons";
import { SolicitudModificacionListDesktop } from "./desktop/solicitud-modificacion-list-desktop";
import { SolicitudModificacionListMobile } from "./mobile/solicitud-modificacion-list-mobile";
import { ModificacionSalarioForm } from "./modificacion-salario-form";

interface SolicitudModificacionListItem {
  id: string;
  folio: string;
  requestDate: string;
  customer: string;
  employee: string;
  applicationRoleCurrent: string;
  currentSalary: number | string;
  applicationRoleNew: string;
  finalSalary: number | string;
  status: string;
}

@Component({
  selector: "app-solicitud-modificacion-list",
  templateUrl: "./solicitud-modificacion-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SolicitudModificacionListDesktop, SolicitudModificacionListMobile],
})
export class SolicitudModificacionList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  filterRequestsService = inject(FilterRequestsService);
  statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  platformS = inject(PlatformService);

  dataSignal = signal<SolicitudModificacionListItem[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  ref: DynamicDialogRef;

  paramsEmit$ = toSignal(this.filterRequestsService.getParams$());

  constructor() {
    addIcons({ trendingUpOutline });
    effect(() => {
      this.paramsEmit$();
      this.onLoadData();
    });
  }

  ngOnInit(): void {
    // Logic moved to effect
  }
  onLoadData() {
    const urlApi = EndpointsReclutamiento.RequestSalaryModification.list;
    this.apiResponseS
      .onGetList<SolicitudModificacionListItem[]>(
        urlApi,
        this.filterRequestsService.getParams(),
      )
      .then((result) => {
        this.dataSignal.set(result);
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(EndpointsReclutamiento.RequestSalaryModification.delete(id))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
        }
      });
  }

  onModalForm(data: Pick<SolicitudModificacionListItem, "id">) {
    this.dialogHandlerS
      .openDialog(
        ModificacionSalarioForm,
        {
          id: data.id,
        },
        "Editar",
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
