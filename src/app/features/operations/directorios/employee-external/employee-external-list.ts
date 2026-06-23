import { Component, computed, effect, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IonAvatar, IonItem, IonLabel } from "@ionic/angular/standalone";
import { provideFlatpickrDefaults } from "angularx-flatpickr";
import { AvatarModule } from "primeng/avatar";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import {
  CustomButtonDelete,
  CustomButtonEdit,
  CustomButtonItem,
} from "src/app/core/components/buttons/web";
import { CustomBtnActiveDesactive } from "src/app/core/components/buttons/web/custom-button-active-desactive";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { CardEmployee } from "src/app/features/hr/expediente-del-empleado/employees/employees/pages/card-employee";
import { EmployeeExternalAppUser } from "./employee-external-app-user";
import { EmployeeExternalForm } from "./employee-external-form";
@Component({
  selector: "app-employee-external-list",
  templateUrl: "./employee-external-list.html",
  imports: [
    TableModule,
    CustomButtonEdit,
    CustomButtonItem,
    CustomButtonDelete,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    CustomBtnActiveDesactive,
    IonItem,
    IonLabel,
    IonAvatar,
    CustomButtonDelete,
    CustomButtonEdit,
    CustomButtonItem,
    AvatarModule,
  ],
  providers: [provideFlatpickrDefaults()],
})
export class EmployeeExternalList {
  // employeeAddOrEditService = inject(EmployeeAddOrEditService);
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  rutaActiva = inject(ActivatedRoute);
  router = inject(Router);
  activo: boolean = true;
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
        // tan pronto como el customerId estó disponible.
        this.onLoadData();
      }
    });
  }

  onSelectActive(active: boolean): any {
    this.activo = active;
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        Endpoints.EmployeeExternal.list(
          this.customerIdS.customerId(),
          this.activo,
        ),
      )
      .then((result: any) => {
        console.log("🚀 ~ EmployeeExternalList ~ onLoadData ~ result:", result);
        return this.dataSignal.set(result);
      });
  }

  onModalForm(data: any) {
    console.log("🚀 ~ EmployeeExternalList ~ onModalForm ~ data:", data);
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

  deleteAccessCustomer(applicationUserId: string) {
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

