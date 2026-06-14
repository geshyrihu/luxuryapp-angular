import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CheckboxModule } from "primeng/checkbox";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { IApplicationRoleDTO } from "../models/application-role.dto";
import { RoleForm } from "./role-form";

@Component({
  selector: "app-roles",
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CheckboxModule,
    PrimeNgCustomCaption,
    DataViewMobile,
    ActionMenu,
    CustomButtonEdit,
    CustomButtonDelete,
  ],
  templateUrl: "./roles-list.html",
})
export class RolesList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);

  dataSignal = signal<IApplicationRoleDTO[]>([]);
  scrollHeight = this.tableScrollHeightS.scrollHeight;
  readonly globalFilterFields = signal([
    "name",
    "displayName",
    "roleType",
    "departament",
  ]);
  loading = signal(true);
  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<IApplicationRoleDTO[]>(Endpoints.ApplicationRoles.getAll)
      .then((result) => {
        this.dataSignal.set(result || []);
        this.loading.set(false);
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(RoleForm, data, data.title, this.dialogHandlerS.sizeMd)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.ApplicationRoles.delete(id))
      .then((result) => {
        if (result) this.onLoadData();
      });
  }
}
