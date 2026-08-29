import { ApiDatePipe } from "../../../../shared/pipes/api-date.pipe";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { WebButtonIconConfirm } from "@ui/buttons/web-icon/button-confirm";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { RangoCalendarioyyyymmdd } from "@ui/web/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd";
import { DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CardEmployee } from "src/app/shared/integration/recursos-humanos";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { FiltroCalendarService } from "src/app/core/services/filtro-calendar.service";
import { BitacoraMantenimientoForm } from "./bitacora-mantenimiento-form";

@Component({
  selector: "app-bitacora-mantenimiento",
  templateUrl: "./bitacora-mantenimiento.html",
  imports: [
    RangoCalendarioyyyymmdd,
    WebButtonIconConfirm,
    PrimeNgCustomTableEmptyMessage,
    ApiDatePipe,
    TableModule,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    PrimeNgCustomCaption,
    DataViewMobile,
    MobileListItem,
    MobileActionMenu,
    MobileButtonLabelDelete,
  ],
})
export class BitacoraMantenimiento {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  dateS = inject(DateService);
  authService = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  customerIdS = inject(CustomerIdService);
  rangoCalendarioService = inject(FiltroCalendarService);
  customerList: any[] = [];
  public AspRole = ApplicationRole;

  fechaInicial: string = this.dateS.getDateFormat(
    this.rangoCalendarioService.fechaInicioDateFull,
  );
  fechaFinal: string = this.dateS.getDateFormat(
    this.rangoCalendarioService.fechaFinalDateFull,
  );
  es: any; // LocaleSettings;
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  ref: DynamicDialogRef;

  fechasSignal = toSignal(this.rangoCalendarioService.fechas$, {
    initialValue: {
      fechaInicio: this.dateS.getDateFormat(
        this.rangoCalendarioService.fechaInicioDateFull,
      ),
      fechaFinal: this.dateS.getDateFormat(
        this.rangoCalendarioService.fechaFinalDateFull,
      ),
    },
  });

  constructor() {
    effect(() => {
      const dates = this.fechasSignal();
      if (dates) {
        this.fechaInicial = dates.fechaInicio;
        this.fechaFinal = dates.fechaFinal;
        this.onLoadData();
      }
    });

    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi =
      Endpoints.BitacoraMantenimientoConsultas.listByCustomerAndRange(
        this.customerIdS.customerId(),
        this.fechaInicial,
        this.fechaFinal,
      );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onFilter() {
    this.onLoadData();
  }

  onDelete(item: any) {
    this.apiResponseS
      .onDelete(Endpoints.BitacoraMantenimiento.delete(item.id))
      .then(() => {
        this.dataSignal.update((data) => data.filter((d) => d.id !== item.id));
      });
  }

  onModalFormBiacora(data: any) {
    this.dialogHandlerS
      .openDialog(
        BitacoraMantenimientoForm,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerS.openDialog(
      CardEmployee,
      { applicationUserId },
      "Colaborador",
      this.dialogHandlerS.sizeLg,
    );
  }
}
