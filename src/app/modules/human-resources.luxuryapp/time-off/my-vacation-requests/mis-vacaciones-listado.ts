import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { VacationRequestMyDTO } from "@human-resources.luxuryapp/interfaces/vacation-request.interface";
import { ROUTES } from "src/app/routing/route-paths";
import { MisVacacionesListadoDesktop } from "./desktop/mis-vacaciones-listado-desktop";
import { MisVacacionesListadoMobile } from "./mobile/mis-vacaciones-listado-mobile";
import { VacacionesForm } from "./vacaciones-form";

@Component({
  selector: "app-mis-vacaciones-listado",
  templateUrl: "./mis-vacaciones-listado.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MisVacacionesListadoDesktop, MisVacacionesListadoMobile],
})
export class MisVacacionesListado implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  router = inject(Router);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);

  dataSignal = signal<VacationRequestMyDTO[]>([]);
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
      .onGetList<VacationRequestMyDTO[]>(Endpoints.HR.VacationRequest.getAll)
      .then((result) => {
        this.dataSignal.set(result);
        this.loading.set(false);
      });
  }

  async onDelete(id: string) {
    const ok = await this.confirmS.confirm(
      "¿Está seguro de eliminar esta solicitud de vacaciones?",
    );
    if (!ok) return;
    this.apiResponseS
      .onDelete(Endpoints.HR.VacationRequest.delete(id))
      .then(() => {
        this.dataSignal.update((currentData) =>
          currentData.filter((item) => item.id !== id),
        );
      });
  }

  onModalForm(data: { id: string; title: string }) {
    this.dialogHandlerS
      .openDialog(VacacionesForm, data, data.title, this.dialogHandlerS.sizeXl)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }
  onNavSaldo() {
    this.router.navigate(ROUTES.RECURSOS_HUMANOS.SALDO_VACACIONES);
  }
  onDetail(id: string) {
    this.router.navigate(ROUTES.RECURSOS_HUMANOS.VACACIONES_DETALLE(id));
  }
}
