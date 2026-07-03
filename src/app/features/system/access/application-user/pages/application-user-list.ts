import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { AvatarModule } from "primeng/avatar";
import { CardModule } from "primeng/card";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { firstValueFrom } from "rxjs";
import { WebButtonIconActiveDesactive } from "src/app/core/components/buttons/web-icon/button-active-desactive";
import { WebButtonIconDelete } from "src/app/core/components/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "src/app/core/components/buttons/web-icon/button-edit";

import { WebButtonLabelDelete } from "src/app/core/components/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web-label/button-edit";
import { WebButtonLabelItem } from "src/app/core/components/buttons/web-label/button-item";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CardEmployee } from "src/app/features/hr/expediente-del-empleado/employees/employees/pages/card-employee";
import { IApplicationUserDTO } from "../models/application-user.dto";
import { ApplicationUserForm } from "./application-user-form";
import { MdEditAccount } from "./md-edit-account";
@Component({
  selector: "app-application-user-list",
  templateUrl: "./application-user-list.html",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    ReactiveFormsModule,
    TableModule,
    AvatarModule,
    WebButtonIconEdit,
    WebButtonIconDelete,
    WebButtonLabelItem,
    WebButtonIconActiveDesactive,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    AppIcon,
    CardModule,
    CustomInputSelectSignal,
  ],
})
export class ApplicationUserList implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  enumSelectS = inject(EnumSelectService);
  tableScrollHeightS = inject(TableScrollHeightService);
  // Signals
  dataSignal = signal<IApplicationUserDTO[]>([]);
  filteredDataSignal = signal<IApplicationUserDTO[]>([]);

  searchText: string = ""; // Para almacenar el texto de búsqueda
  selectCustomerSignal = signal<ISelectItem[]>([]);
  cbTypePersonSignal = signal<ISelectItem[]>([]);

  /*
    /PRIME NG TABLE OPTIONS
    */
  scrollHeight = this.tableScrollHeightS.scrollHeight;
  readonly globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  loading = signal(true);
  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  applicationUserId: string = "";
  employeeId: any = 0;
  ref: DynamicDialogRef;
  state: boolean = true;
  title: string = "";
  applicationUserState: boolean = true;
  typePersonControl = new FormControl<number>(0);

  async ngOnInit() {
    this.cbTypePersonSignal.set(
      await firstValueFrom(this.enumSelectS.typePerson(false)),
    );
    this.onLoadData(true, this.typePersonControl.value);
  }

  onSearch() {
    const searchTextLower = this.searchText.toLowerCase();
    const currentData = this.dataSignal();

    this.filteredDataSignal.set(
      currentData.filter((item) =>
        ["fullName", "userName", "customer", "email", "phoneNumber"].some(
          (key) => item[key]?.toLowerCase().includes(searchTextLower),
        ),
      ),
    );
  }

  onLoadData(applicationUserState: boolean, typePerson: any): void {
    this.apiResponseS
      .onGetList<
        IApplicationUserDTO[]
      >(Endpoints.ApplicationUsers.getAll(applicationUserState, typePerson))
      .then((result: IApplicationUserDTO[]) => {
        if (result) {
          this.dataSignal.set(result);
          this.filteredDataSignal.set(result);

          // Agrupar customers únicos para el select
          const uniqueCustomers = [
            ...new Set(result.map((item: any) => item.customer)),
          ];

          // Crear opciones para el select
          this.selectCustomerSignal.set([
            { label: "Mostrar todos", value: "all" }, // Opción para mostrar todos
            ...uniqueCustomers.map(
              (customer): ISelectItem => ({
                label: customer ? String(customer) : "Sin Cliente",
                value: customer ? String(customer) : "sin_cliente",
              }),
            ),
          ]);
        }
      });
  }

  // Método para filtrar por cliente
  onSelectForCustomer(selectedValue: string) {
    if (selectedValue === "all") {
      // Si selecciona "Mostrar todos", mostrar todos los datos
      this.filteredDataSignal.set(this.dataSignal());
    } else {
      // Filtrar datos por el valor seleccionado
      this.filteredDataSignal.set(
        this.dataSignal().filter(
          (item: any) => item.customer === selectedValue,
        ),
      );
    }
  }

  onSelectTypePerson(typePerson: any): any {
    this.onLoadData(this.applicationUserState, typePerson);
  }
  onSelectActive(applicationUserState: boolean): any {
    this.applicationUserState = applicationUserState;
    this.onLoadData(applicationUserState, this.typePersonControl.value);
  }

  // Tarjeta de Usuraio
  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerS.openDialog(
      CardEmployee,
      { applicationUserId },
      "Colaborador",
      this.dialogHandlerS.sizeLg,
    );
  }
  onModalForm(applicationUserId: string, title: string) {
    this.dialogHandlerS
      .openDialog(
        ApplicationUserForm,
        { applicationUserId },
        title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: any) => {
        if (result)
          this.onLoadData(
            this.applicationUserState,
            this.typePersonControl.value,
          );
      });
  }

  onModalEditAccount(applicationUserId: string, email: string) {
    this.dialogHandlerS.openDialog(
      MdEditAccount,
      {
        applicationUserId,
        email,
      },
      "ðŸ” Cuenta de acceso",
      this.dialogHandlerS.sizeFull,
    );
  }

  onToBlockAccount(applicationUserId: string): void {
    this.apiResponseS
      .onGetItem(Endpoints.ApplicationUsers.toBlockAccount(applicationUserId))
      .then((result) => {
        if (result) {
          // Update nested property using update loop or map
          this.dataSignal.update((data) =>
            data.map((item) =>
              item.id === applicationUserId
                ? { ...item, active: !item.active }
                : item,
            ),
          );
          // Sync filtered data
          this.filteredDataSignal.update((data) =>
            data.map((item) =>
              item.id === applicationUserId
                ? { ...item, active: !item.active }
                : item,
            ),
          );
        }
      });
  }

  onToUnlockAccount(applicationUserId: string): void {
    this.apiResponseS
      .onGetItem(Endpoints.ApplicationUsers.toUnlockAccount(applicationUserId))
      .then((result) => {
        if (result) {
          // Update nested property using update loop or map
          this.dataSignal.update((data) =>
            data.map((item) =>
              item.id === applicationUserId
                ? { ...item, active: !item.active }
                : item,
            ),
          );
          // Sync filtered data
          this.filteredDataSignal.update((data) =>
            data.map((item) =>
              item.id === applicationUserId
                ? { ...item, active: !item.active }
                : item,
            ),
          );
        }
      });
  }

  onDelete(applicationUserId: string): void {
    this.apiResponseS
      .onDelete(Endpoints.ApplicationUsers.delete(applicationUserId))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== applicationUserId),
          );
          this.filteredDataSignal.update((data) =>
            data.filter((item) => item.id !== applicationUserId),
          );
        }
      });
  }

  DeleteUserId(applicationUserId: string): void {
    this.apiResponseS
      .onDelete(Endpoints.ApplicationUsers.delete(applicationUserId))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== applicationUserId),
          );
          this.filteredDataSignal.update((data) =>
            data.filter((item) => item.id !== applicationUserId),
          );
        }
      });
  }
}
