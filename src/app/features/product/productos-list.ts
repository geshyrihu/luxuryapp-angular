import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { AvatarModule } from "primeng/avatar";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { Endpoints } from "src/app/core/constants/endpoints";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ProductosForm } from "./productos-form";
@Component({
  selector: "app-productos-list",
  templateUrl: "./productos-list.html",
  imports: [
    TableModule,
    CustomButtonEdit,
    CustomButtonDelete,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    AvatarModule,


  ],
})
export class ProductosList implements OnInit {
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  tableScrollHeightS = inject(TableScrollHeightService);
  // Signals
  dataSignal = signal<any[]>([]);
  filteredDataSignal = signal<any[]>([]);
  public AspRole = EApplicationRole;

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  ref: DynamicDialogRef;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  account_id: string = this.authS.userToken.infoUserAuthDTO.applicationUserId;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS.onGetList(Endpoints.Products.getAll).then((result: any) => {
      if (result) {
        this.dataSignal.set(result);
        this.filteredDataSignal.set(result);
      }
    });
  }

  // ... Eliminar registro
  onDelete(id: any) {
    this.apiResponseS.onDelete(Endpoints.Products.delete(id)).then((result: boolean) => {
      if (result) {
        this.dataSignal.update((data) => data.filter((item) => item.id !== id));
        this.filteredDataSignal.update((data) =>
          data.filter((item) => item.id !== id),
        );
      }
    });
  }

  // ... Llamada al Modal agregar o editar
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(ProductosForm, data, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}








