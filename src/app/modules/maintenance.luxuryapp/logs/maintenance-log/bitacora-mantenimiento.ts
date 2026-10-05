import { Component, computed, effect, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";

import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DateService } from "@core/services/date.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { FiltroCalendarService } from "@core/services/filtro-calendar.service";
import { PlatformService } from "@core/services/platform.service";
import { CardEmployee } from "@shared/integration/recursos-humanos";
import { BitacoraMantenimientoForm } from "./bitacora-mantenimiento-form";
import { BitacoraMantenimientoDesktop } from "./desktop/bitacora-mantenimiento-desktop";
import { BitacoraMantenimientoMobile } from "./mobile/bitacora-mantenimiento-mobile";

@Component({
  selector: "app-bitacora-mantenimiento",
  templateUrl: "./bitacora-mantenimiento.html",
  imports: [BitacoraMantenimientoDesktop, BitacoraMantenimientoMobile],
})
export class BitacoraMantenimiento {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  dateS = inject(DateService);
  authService = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  customerIdS = inject(CustomerIdService);
  rangoCalendarioService = inject(FiltroCalendarService);
  platformS = inject(PlatformService);
  customerList: any[] = [];
  public AspRole = ApplicationRole;

  isJefeMantenimiento = this.aspRoleS.roleSignal(
    ApplicationRole.JefeMantenimiento,
  );

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
        this.dialogHandlerS.sizeXl,
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
      this.dialogHandlerS.sizeXl,
    );
  }
}
