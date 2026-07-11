import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { LxTag } from "@ui/adaptive/tag/tag";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { ProgressSpinnerModule } from "primeng/progressspinner";
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
import { ModuleAppRolDto } from "./interfaces/module-app-rol.dto";
import { ModuleAppRolUpdate } from "./module-app-rol-update";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
@Component({
  selector: "app-module-app-rol",
  imports: [
    AppIcon,
    RouterModule,
    TableModule,
    LxTag,
    ProgressSpinnerModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,

    MobileListItem,
  ],
  templateUrl: "./module-app-rol-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host ::ng-deep ion-item-divider {
        --background: var(--blue-50);
        --color: var(--blue-700);
        font-weight: bold;
        border-bottom: 1px solid var(--blue-100);
      }
    `,
  ],
})
export class ModuleAppRol {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);

  dataSignal = signal<ModuleAppRolDto[]>([]);

  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollHeightS.scrollHeight;

  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal()),
  );
  groupedData = computed(() => {
    const data = this.dataSignal();
    return data.reduce((acc: any, item) => {
      const key = item.roleType || "Otros";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  });
  constructor() {}

  ref: DynamicDialogRef; // Referencia a un cuadro de diólogo modal

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<ModuleAppRolDto[]>(Endpoints.ModuleAppRoles.listRole)
      .then((result) => {
        // Actualizamos el valor del signal con los datos recibidos
        this.dataSignal.set(result || []);
      });
  }

  // Función para abrir un cuadro de diólogo modal para agregar o editar o crear
  onModalForm(data: any) {
    this.dialogHandlerS.openDialog(
      ModuleAppRolUpdate,
      data,
      data.title,
      this.dialogHandlerS.sizeFull,
    );
  }
}
