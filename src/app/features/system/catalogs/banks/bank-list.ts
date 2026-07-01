import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { businessOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { WebButtonIconDelete } from "src/app/core/components/buttons/web/icon/button-delete";
import { WebButtonIconEdit } from "src/app/core/components/buttons/web/icon/button-edit";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web/label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web/label/button-edit";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { BankForm } from "./bank-form";
import { IBankDTO } from "./bank.dto";

@Component({
  selector: "app-bank-list",
  templateUrl: "./bank-list.html",
  imports: [
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    PrimeNgCustomTableEmptyMessage,
    DataViewMobile,
    ActionMenu,
    WebButtonIconEdit,
    WebButtonIconDelete,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    IonItem,
    IonLabel,
  ],
})
export class BankList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);

  // Declaración e inicialización de variables
  dataSignal = signal<IBankDTO[]>([]);

  /*
  /PRIME NG TABLE OPTIONS
  */
  loading = signal(true);
  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  // Usar el servicio global para scrollHeight
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  // ¡Esta es la magia!
  // Se recalculará automáticamente SOLO si dataSignal cambia.
  readonly globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  constructor() {
    addIcons({ businessOutline });
  }

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<IBankDTO[]>(Endpoints.Banks.getAll)
      .then((result) => {
        if (result) this.dataSignal.set(result);
      });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.Banks.delete(id))
      .then((response: boolean) => {
        if (response) {
          // Actualizamos el signal para eliminar el elemento de la lista
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
        }
      });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(BankForm, data, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }
}
