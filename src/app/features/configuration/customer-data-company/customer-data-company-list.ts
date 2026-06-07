import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { SelectModule } from "primeng/select";
import { SelectButtonModule } from "primeng/selectbutton";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { IonButtonDelete, IonButtonEdit } from "src/app/core/components/buttons/mobile";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "../../../core/constants/endpoints";
import { CustomerDataCompanyDTO } from "./customer-data-company-dto";
import { CustomerDataCompanyForm } from "./customer-data-company-form";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";

@Component({
  selector: "app-customer-data-company-list",
  templateUrl: "./customer-data-company-list.html",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    SelectButtonModule,
    CustomButtonEdit,
    CustomButtonDelete,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    SelectModule,
    CustomInputSelectSignal,
    IonItem,
    IonLabel,
    IonButtonEdit,
    IonButtonDelete,
    AppIcon,
  ],
})
export class CustomerDataCompanyList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  // Declaración e inicialización de variables
  data = signal<CustomerDataCompanyDTO[]>([]);
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
  groupingOptionControl = new FormControl<string>("numeroCliente", { nonNullable: true });
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
      .then((result: CustomerDataCompanyDTO[]) => {
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
