import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { provideFlatpickrDefaults } from "angularx-flatpickr";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-primeng-option";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { CardEmployee } from "@recruitment.luxuryapp/expediente-del-empleado/employees/employees/card-employee";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { EmployeeExternalAppUser } from "./employee-external-app-user";
import { EmployeeExternalForm } from "./employee-external-form";

import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";

@Component({
  selector: "app-employee-external-list",
  templateUrl: "./employee-external-list.html",
  imports: [
    WebButtonIconEdit,
    WebButtonIconItem,
    WebButtonIconDelete,
    LxTooltipDirective,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelItem,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    AppTable,

    AppSortableColumn,

    AppSorticon,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    AppAvatar,
    MobileListItem,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [provideFlatpickrDefaults()],
})
export class EmployeeExternalList {
  // employeeAddOrEditService = inject(EmployeeAddOrEditService);
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

  // óCAMBIO CLAVE! Reemplazamos ngOnInit con el constructor y un effect.
  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        // El effect se encarga de la carga inicial de datos
        // tan pronto como el customerId esté disponible.
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
        this.dialogHandlerS.sizeLg,
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
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onRemoveFromCustomer(applicationUserId: string) {
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
      this.dialogHandlerS.sizeSm,
    );
  }
}


