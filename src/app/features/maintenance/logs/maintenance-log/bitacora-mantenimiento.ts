import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";

import { CardModule } from "primeng/card";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { CustomButtonDelete } from "src/app/core/components/web/buttons/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/web/buttons/custom-button-edit";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { FiltroCalendarService } from "src/app/core/services/filtro-calendar.service";
import { CardEmployee } from "src/app/features/hr/expediente-del-empleado/employees/employees/pages/card-employee";
import { BitacoraMantenimientoForm } from "./bitacora-mantenimiento-form";
@Component({
  selector: "app-bitacora-mantenimiento",
  templateUrl: "./bitacora-mantenimiento.html",
  imports: [
    CommonModule,
    TableModule,
    CustomButtonDelete,
    CustomButtonEdit,
    PrimeNgCustomCaption,
    CardModule,
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
  public AspRole = EApplicationRole;

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
      fechaInicio: this.dateS.getDateFormat(this.rangoCalendarioService.fechaInicioDateFull),
      fechaFinal: this.dateS.getDateFormat(this.rangoCalendarioService.fechaFinalDateFull)
    }
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
    const urlApi = `BitacoraMantenimiento/list/${this.customerIdS.customerId()}/${
      this.fechaInicial
    }/${this.fechaFinal}`;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onFilter() {
    this.onLoadData();
  }

  onDelete(item: any) {
    this.apiResponseS.onDelete(Endpoints.BitacoraMantenimiento.delete(item.id)).then(() => {
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











