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
import { DynamicDialogRef } from "@core/services/dialog-handler.service";
import { addIcons } from "ionicons";
import { personRemoveOutline } from "ionicons/icons";

import { AuthService } from "@core/auth/services/auth.service";
import { EndpointsReclutamiento } from "@core/constants/endpoints/reclutamiento.endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { FilterRequestsService } from "@core/http/services/filter-requests.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { SolicitudBajaListDesktop } from "./desktop/solicitud-baja-list-desktop";
import { SolicitudBajaListMobile } from "./mobile/solicitud-baja-list-mobile";
import { SolicitudBajaUpdateStatus } from "./solicitud-baja-update-status";

export interface SolicitudBajaListItem {
  id: string;
  title?: string;
  folio: string;
  requestDate: string;
  nameCustomer: string;
  nameEmployee: string;
  applicationRole: string;
  executionDate: string;
  tipoBaja: string;
  status: string;
}

@Component({
  selector: "app-solicitud-baja-list",
  templateUrl: "./solicitud-baja-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SolicitudBajaListDesktop, SolicitudBajaListMobile],
})
export class SolicitudBajaList implements OnInit {
  platformS = inject(PlatformService);
  authS = inject(AuthService);
  apiResponseS = inject(ApiResponseService);
  filterRequestsService = inject(FilterRequestsService);
  dialogHandlerS = inject(DialogHandlerService);

  dataSignal = signal<SolicitudBajaListItem[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  ref: DynamicDialogRef;

  paramsEmit$ = toSignal(this.filterRequestsService.getParams$());

  constructor() {
    addIcons({ personRemoveOutline });
    effect(() => {
      this.paramsEmit$();
      this.onLoadData();
    });
  }

  ngOnInit(): void {
    // Logic moved to effect
  }

  onLoadData() {
    const urlApi = EndpointsReclutamiento.RequestDismissal.list;
    const params = this.filterRequestsService.getParams();
    this.apiResponseS
      .onGetList<SolicitudBajaListItem[]>(urlApi, params)
      .then((result) => {
        this.dataSignal.set(result);
      });
  }
  onModalForm(data: SolicitudBajaListItem) {
    this.dialogHandlerS
      .openDialog(
        SolicitudBajaUpdateStatus,
        {
          id: data.id,
          status: data.status,
        },
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(EndpointsReclutamiento.RequestDismissal.delete(id))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
        }
      });
  }
}
