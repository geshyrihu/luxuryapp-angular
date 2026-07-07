import { Component, computed, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";
import { addIcons } from "ionicons";
import { chevronForwardOutline } from "ionicons/icons";
import { AvatarModule } from "primeng/avatar";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { WebButtonIconActiveDesactive } from "@ui/buttons/web-icon/button-active-desactive";
import { WebButtonLabelActiveDesactive } from "@ui/buttons/web-label/button-active-desactive";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CustomerModulEdit } from "./customer-modul-edit";

import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
@Component({
  selector: "app-customer-modul-list",
  templateUrl: "./customer-modul-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    PrimeNgCustomTableEmptyMessage,
    RouterModule,
    TableModule,
    AvatarModule,
    TagModule,
    DataViewMobile,
    PrimeNgCustomTableFooter,
    CardModule,
    PrimeNgCustomCaption,
    WebButtonIconActiveDesactive,
    WebButtonLabelActiveDesactive,
    AppIcon,
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

  readonly globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  loading = signal(true);
  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  state: boolean = true;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit(): void {
    this.onLoadData(this.state);
  }

  onLoadData(state: boolean): void {
    this.apiResponseS
      .onGetList(Endpoints.ModuleAppCustomers.customers(state))
      .then((result: any) => {
        if (result) {
          this.dataSignal.set(result);
        }
      });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.ModuleAppCustomers.delete(id))
      .then((_) => {
        // Actualizamos el signal para eliminar el elemento de la lista
        this.dataSignal.update((data) => data.filter((item) => item.id !== id));
      });
  }

  // Método para filtrar por estado
  onSelectActive(selectedValue: boolean) {
    this.state = selectedValue;
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
