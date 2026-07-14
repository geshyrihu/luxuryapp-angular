import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { SelectModule } from "primeng/select";
import { SelectButtonModule } from "primeng/selectbutton";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { CustomerDataCompanyForm } from "./customer-data-company-form";
import { CustomerDataCompanyDto } from "./customer-data-company.dto";

@Component({
  selector: "app-customer-data-company-list",
  templateUrl: "./customer-data-company-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimeNgCustomTableEmptyMessage,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    SelectButtonModule,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    MobileActionMenu,
    SelectModule,
    CustomInputSelectSignal,
    MobileListItem,
    AppIcon,
  ],
})
export class CustomerDataCompanyList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  // Declaración e inicialización de variables
  data = signal<CustomerDataCompanyDto[]>([]);
  readonly globalFilterFields = signal<string[]>([
    "customer",
    "email",
    "phoneNumber",
    "applicationUser",
    "applicationRoleName",
  ]);
  loading = signal(true);
  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  groupingOptions = [
    { label: "Agrupar por Cliente", value: "numeroCliente" },
    { label: "Agrupar por Rol", value: "applicationRoleSortOrder" },
  ];
  groupingOptionControl = new FormControl<string>("numeroCliente", {
    nonNullable: true,
  });
  groupingOption = signal<string>("numeroCliente");

  sortedData = computed(() => {
    const data = [...(this.data() ?? [])];
    const key = this.groupingOption();

    if (key === "numeroCliente") {
      // Agrupar por cliente: ordenar por numeroCliente y luego por el orden del rol
      data.sort((a, b) => {
        const numeroClienteCompare = a.numeroCliente.localeCompare(
          b.numeroCliente,
          undefined,
          { numeric: true },
        );
        if (numeroClienteCompare !== 0) {
          return numeroClienteCompare;
        }
        return a.applicationRoleSortOrder - b.applicationRoleSortOrder;
      });
    } else if (key === "applicationRoleSortOrder") {
      // Agrupar por rol: ordenar por el orden del rol y luego por el numeroCliente
      data.sort((a, b) => {
        const roleSortOrderCompare =
          a.applicationRoleSortOrder - b.applicationRoleSortOrder;
        if (roleSortOrderCompare !== 0) {
          return roleSortOrderCompare;
        }
        return a.numeroCliente.localeCompare(b.numeroCliente, undefined, {
          numeric: true,
        });
      });
    }
    return data;
  });

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.CustomerDataCompany.getAll)
      .then((result: CustomerDataCompanyDto[]) => {
        this.data.set(result ?? []);
        this.loading.set(false);
      });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.CustomerDataCompany.delete(id))
      .then((result: boolean) => {
        if (result)
          this.data.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
      });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        CustomerDataCompanyForm,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
