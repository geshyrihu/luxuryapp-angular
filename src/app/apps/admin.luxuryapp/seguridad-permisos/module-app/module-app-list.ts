import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { LxTag } from "@ui/adaptive/tag/tag";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ModuleAppDto } from "./interfaces/module-app.dto";
import { ModuleAppForm } from "./module-app-form";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
@Component({
  selector: "app-module-app-list",
  imports: [
    AppIcon,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    LxTag,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    MobileActionMenu,
    RouterModule,
    MobileListItem,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./module-app-list.html",
})
export class ModuleAppList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);

  constructor() {}

  // Declaración e inicialización de variables
  dataSignal = signal<ModuleAppDto[]>([]);

  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  readonly globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  loading = signal(true);
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<ModuleAppDto[]>(Endpoints.ModuleApps.getAll)
      .then((result) => {
        // Ordenar datos para agrupar por pathParent
        const sortedData = (result || []).sort((a, b) => {
          const pathParentA = a.pathParent || "";
          const pathParentB = b.pathParent || "";

          if (pathParentA < pathParentB) return -1;
          if (pathParentA > pathParentB) return 1;

          // If pathParent is the same, sort by nameModule
          if (a.nameModule < b.nameModule) return -1;
          if (a.nameModule > b.nameModule) return 1;

          return 0;
        });

        this.dataSignal.set(sortedData);
      });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: string) {
    this.apiResponseS.onDelete(Endpoints.ModuleApps.delete(id)).then((_) => {
      // Actualizamos el signal para eliminar el elemento de la lista
      this.dataSignal.update((data) => data.filter((item) => item.id !== id));
    });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(ModuleAppForm, data, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
