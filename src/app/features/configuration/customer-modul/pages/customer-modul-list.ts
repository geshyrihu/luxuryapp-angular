import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonAvatar } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { chevronForwardOutline } from "ionicons/icons";
import { AvatarModule } from "primeng/avatar";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { Endpoints } from "src/app/core/constants/endpoints";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { PrimeNgCustomGlobalFilter } from "src/app/core/components/primeng-custom-global-filter/primeng-custom-global-filter";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CustomerModulEdit } from "./customer-modul-edit";
@Component({
  selector: "app-customer-modul-list",
  templateUrl: "./customer-modul-list.html",
  imports: [
    RouterModule,
    TableModule,
    CustomInputSelectSignal,
    AvatarModule,
    TagModule,
    DataViewMobile,
    PrimeNgCustomGlobalFilter,
    CardModule,

    IonAvatar,
  ],
})
export class CustomerModulList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  tableScrollHeightS = inject(TableScrollHeightService);
  dialogHandlerS = inject(DialogHandlerService);

  constructor() {
    addIcons({ chevronForwardOutline });
  }

  // Declaración e inicialización de variables
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  state: boolean = true;
  selectCustomer: ISelectItem[] = [
    { value: true, label: "Activo" },
    { value: false, label: "Inactivo" },
  ];
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit(): void {
    this.onLoadData(this.state);
  }

  onLoadData(state: boolean): void {
    const urlApi = Endpoints.ModuleAppCustomers.customers(state);
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      if (result) {
        this.dataSignal.set(result);
      }
    });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: any) {
    this.apiResponseS.onDelete(`module-app-customers/${id}`).then((_) => {
      // Actualizamos el signal para eliminar el elemento de la lista
      this.dataSignal.update((data) => data.filter((item) => item.id !== id));
    });
  }

  // Método para filtrar por cliente
  onSelectForCustomer(selectedValue: boolean) {
    this.onLoadData(selectedValue);
  }
  // Función para abrir un cuadro de diólogo modal para agregar o editar o crear
  onModalForm(data: any) {
    this.dialogHandlerS.openDialog(
      CustomerModulEdit,
      data,
      "Asignar Módulos",
      this.dialogHandlerS.sizeFull,
    );
  }
}
