import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { LxAvatar } from "@ui/adaptive/avatar/avatar";
import { MobileButtonLabelActiveDesactive } from "@ui/buttons/mobile-label/button-active-desactive";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonLabelActiveDesactive } from "@ui/buttons/web-label/button-active-desactive";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { firstValueFrom } from "rxjs";
import { DynamicDialogRef } from "src/app/core/services/dialog-handler.service";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { CardEmployee } from "src/app/shared/integration/recursos-humanos";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { UserAccountDto } from "./interfaces/user-account.dto";
import { MdEditAccount } from "./md-edit-account";
import { UserAccountForm } from "./user-account-form";

import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
@Component({
  selector: "app-user-account-list",
  templateUrl: "./user-account-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MobileListItem,
    WebButtonIconItem,
    LxTooltipDirective,
    MobileActionMenu,
    MobileButtonLabelItem,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    ReactiveFormsModule,
    TableModule,
    LxAvatar,
    WebButtonIconEdit,
    WebButtonIconDelete,
    WebButtonLabelActiveDesactive,
    MobileButtonLabelActiveDesactive,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    AppIcon,
    CustomInputSelectSignal,
  ],
})
export class UserAccountList implements OnInit {
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
