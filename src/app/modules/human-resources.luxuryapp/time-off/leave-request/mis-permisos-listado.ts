import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { LeaveRequestMyDTO } from "@human-resources.luxuryapp/interfaces/leave-request.interface";
import { MisPermisosListadoDesktop } from "./desktop/mis-permisos-listado-desktop";
import { MisPermisosListadoMobile } from "./mobile/mis-permisos-listado-mobile";
import { MiPermisoDetalle } from "./mi-permiso-detalle";
import { PermisoForm } from "./permiso-form";

@Component({
  selector: "app-leave-request-list-my",
  templateUrl: "./mis-permisos-listado.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MisPermisosListadoDesktop, MisPermisosListadoMobile],
})
export class MisPermisosListado implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);

  dataSignal = signal<LeaveRequestMyDTO[]>([]);
  loading = signal(true);
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    return Array.isArray(data) && data.length > 0
      ? globalFilterFields(data)
      : [];
  });

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.loading.set(true);
    this.apiResponseS
      .onGetList<LeaveRequestMyDTO[]>(Endpoints.HR.LeaveRequest.getAll)
      .then((result) => {
        this.dataSignal.set(result);
        this.loading.set(false);
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.HR.LeaveRequest.delete(id))
      .then(() => {
        this.dataSignal.update((currentData) =>
          currentData.filter((item) => item.id !== id),
        );
      });
  }

  onModalForm(data: { id: string; title: string }) {
    this.dialogHandlerS
      .openDialog(PermisoForm, data, data.title, this.dialogHandlerS.sizeXl)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onModalDetail(data: { id: string; title: string }) {
    this.dialogHandlerS.openDialog(
      MiPermisoDetalle,
      data,
      data.title,
      this.dialogHandlerS.sizeXl,
    );
  }
}
