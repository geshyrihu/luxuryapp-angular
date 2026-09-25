import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { DynamicDialogRef } from "@core/services/dialog-handler.service";
import { LxAvatar } from "@ui/adaptive/avatar/avatar";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonLabelActiveDesactive } from "@ui/buttons/web-label/button-active-desactive";
import { AppSortableColumn, AppSorticon, AppTable } from "@ui/web/table/table";
import { firstValueFrom } from "rxjs";

import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { EnumSelectService } from "@core/services/enum-select.service";
import { PlatformService } from "@core/services/platform.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { CardEmployee } from "@shared/integration/recursos-humanos";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { TableFooter } from "@ui/web/table-footer/table-footer";
import { UserAccountDto } from "./interfaces/user-account.dto";
import { MdEditAccount } from "./md-edit-account";
import { UserAccountForm } from "./user-account-form";
import { UserAccountListMobile } from "./user-account-list-mobile";

import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
@Component({
  selector: "app-user-account-list",
  templateUrl: "./user-account-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UserAccountListMobile,
    WebButtonIconItem,
    TableEmptyMessage,
    ReactiveFormsModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LxAvatar,
    WebButtonIconEdit,
    WebButtonIconDelete,
    WebButtonLabelActiveDesactive,
    TableCaption,
    TableFooter,
    CustomInputSelectSignal,
  ],
})
export class UserAccountList implements OnInit {
  readonly platform = inject(PlatformService);
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  enumSelectS = inject(EnumSelectService);
  tableScrollHeightS = inject(TableScrollHeightService);
  // Signals
  dataSignal = signal<UserAccountDto[]>([]);
  filteredDataSignal = signal<UserAccountDto[]>([]);

  searchText: string = ""; // Para almacenar el texto de bósqueda
  selectCustomerSignal = signal<SelectItemDto[]>([]);
  cbTypePersonSignal = signal<SelectItemDto[]>([]);

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
  readonly tableRows: number = tableRows();
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
      .onGetList<UserAccountDto[]>(
        Endpoints.UserAccounts.getAll(applicationUserState, typePerson),
      )
      .then((result: UserAccountDto[]) => {
        if (result) {
          this.dataSignal.set(result);
          this.filteredDataSignal.set(result);

          // Agrupar customers ónicos para el select
          const uniqueCustomers = [
            ...new Set(result.map((item: any) => item.customer)),
          ];

          // Crear opciones para el select
          this.selectCustomerSignal.set([
            { label: "Mostrar todos", value: "all" }, // Opción para mostrar todos
            ...uniqueCustomers.map((customer): SelectItemDto => ({
              label: customer ? String(customer) : "Sin Cliente",
              value: customer ? String(customer) : "sin_cliente",
            })),
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
        UserAccountForm,
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
      "🔐 Cuenta de acceso",
      this.dialogHandlerS.sizeFull,
    );
  }

  onToBlockAccount(applicationUserId: string): void {
    this.apiResponseS
      .onGetItem(Endpoints.UserAccounts.toBlockAccount(applicationUserId))
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
      .onGetItem(Endpoints.UserAccounts.toUnlockAccount(applicationUserId))
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
      .onDelete(
        Endpoints.UserAccounts.deleteAccountAndRelations(applicationUserId),
      )
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
      .onDelete(
        Endpoints.UserAccounts.deleteAccountAndRelations(applicationUserId),
      )
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
