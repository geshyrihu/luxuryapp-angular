import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { Component, inject, OnInit, signal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { TableModule } from "primeng/table";
import { CustomButtonDelete } from "src/app/core/components/web/buttons/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/web/buttons/custom-button-edit";
import { CustomButtonItem } from "src/app/core/components/web/buttons/custom-button-item";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { DialogSize } from "src/app/core/enums/dialog-size";
import { Endpoints } from "src/app/core/constants/endpoints";
import { tablePrimeNgRows, rowsPerPageOptions, globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AddendumTemplateListDTO } from "../models/addendum-template.dto";
import { AddendumTemplateFormComponent } from "./addendum-template-form";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";

@Component({
  selector: "app-addendum-template-list",
  templateUrl: "./addendum-template-list.html",
  imports: [
    EmptyState,
    DatePipe,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButtonItem,
    DataViewMobile,
    ActionMenu,
    CustomButtonItem,
  ],
})
export class AddendumTemplateList implements OnInit {
  apiS = inject(ApiResponseService);
  dialogS = inject(DialogHandlerService);
  tableScrollH = inject(TableScrollHeightService);

  items = signal<AddendumTemplateListDTO[]>([]);
  globalFilter = signal<string>("");
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  globalFilterFields = globalFilterFields(["name", "addendumType"]);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    this.apiS.onGetList<AddendumTemplateListDTO[]>(Endpoints.HR.AddendumTemplate.getAll).then((resp) => {
      if (resp) this.items.set(resp);
    });
  }

  onModalForm(data: { id: string; title: string }): void {
    this.dialogS.openDialog(AddendumTemplateFormComponent, { data: { item: null } }, data.title, DialogSize.lg).then(() => this.onLoadData());
  }

  onEdit(item: AddendumTemplateListDTO): void {
    this.dialogS.openDialog(AddendumTemplateFormComponent, { data: { item } }, "Editar Machote de Adenda", DialogSize.lg).then(() => this.onLoadData());
  }

  onToggleActive(item: AddendumTemplateListDTO): void {
    this.apiS.onPatch(Endpoints.HR.AddendumTemplate.toggleActive(item.id), {}).then(() => this.onLoadData());
  }

  onDelete(id: string): void {
    this.apiS.onDelete(Endpoints.HR.AddendumTemplate.delete(id)).then(() => this.onLoadData());
  }
}

