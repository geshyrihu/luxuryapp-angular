import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { CardEmployee } from "@recruitment.luxuryapp/employee-file/employees/employee-registry/card-employee";
import { provideFlatpickrDefaults } from "angularx-flatpickr";
import { EmployeeExternalListDesktop } from "./desktop/employee-external-list-desktop";
import { EmployeeExternalAppUser } from "./employee-external-app-user";
import { EmployeeExternalForm } from "./employee-external-form";
import { EmployeeExternalListMobile } from "./mobile/employee-external-list-mobile";

import { ConfirmService } from "@ui/buttons/shared/confirm.service";

@Component({
  selector: "app-employee-external-list",
  templateUrl: "./employee-external-list.html",
  imports: [EmployeeExternalListDesktop, EmployeeExternalListMobile],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [provideFlatpickrDefaults()],
})
export class EmployeeExternalList {
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  rutaActiva = inject(ActivatedRoute);
  router = inject(Router);
  dataSignal = signal<any[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  getAllEmployeeActive: any = [];
  ref: DynamicDialogRef;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData();
      }
    });
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        Endpoints.EmployeeExternal.list(this.customerIdS.customerId(), true),
      )
      .then((result: any) => {
        console.log("?? ~ EmployeeExternalList ~ onLoadData ~ result:", result);
        return this.dataSignal.set(result);
      });
  }

  onModalForm(data: any) {
    console.log("?? ~ EmployeeExternalList ~ onModalForm ~ data:", data);
    this.dialogHandlerS
      .openDialog(
        EmployeeExternalForm,
        { userId: data.userId },
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalUserApp(applicationUserId: string) {
    this.dialogHandlerS
      .openDialog(
        EmployeeExternalAppUser,
        { applicationUserId },
        "Usuario de Aplicación",
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  async onRemoveFromCustomer(applicationUserId: string) {

    const confirmed = await this.confirmS.confirm(

      "¿Está seguro de quitar a este colaborador externo del cliente actual?",

    );

    if (!confirmed) return;
    this.apiResponseS
      .onDelete(
        Endpoints.EmployeeExternal.deleteAccessCustomer(
          applicationUserId,
          this.customerIdS.customerId(),
        ),
      )
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((prev) =>
            prev.filter((item) => item.applicationUserId !== applicationUserId),
          );
      });
  }

  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerS.openDialog(
      CardEmployee,
      {
        applicationUserId,
      },
      "Colaborador",
      this.dialogHandlerS.sizeXl,
    );
  }
}
