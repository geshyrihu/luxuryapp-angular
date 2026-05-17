import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { TableModule } from "primeng/table";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { DialogSize } from "src/app/core/enums/dialog-size";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { tablePrimeNgRows, rowsPerPageOptions, globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ContractTemplateListDTO } from "../models/contract-template.dto";
import { ContractTemplateFormComponent } from "./contract-template-form";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { IonButtonItem } from "src/app/core/components/buttons/mobile/ion-button-item";

@Component({
  selector: "app-contract-template-list",
  templateUrl: "./contract-template-list.html",
  imports: [
    DatePipe,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButtonItem,
    DataViewMobile,
    ActionMenu,
    IonButtonItem,
  ],
})
export class ContractTemplateList implements OnInit {
  apiS = inject(ApiResponseService);
  dialogS = inject(DialogHandlerService);
  tableScrollH = inject(TableScrollHeightService);

  items = signal<ContractTemplateListDTO[]>([]);
  globalFilter = signal<string>("");
  globalFilterFields = computed(() => globalFilterFields(this.items()));

  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    this.apiS.onGetList<ContractTemplateListDTO[]>(Endpoints.HR.ContractTemplate.getAll).then((resp) => {
      if (resp) this.items.set(resp);
    });
  }

  onModalForm(data: { id: string; title: string }): void {
    this.dialogS.openDialog(ContractTemplateFormComponent, { item: null }, data.title, DialogSize.lg).then(() => this.onLoadData());
  }

  onEdit(item: ContractTemplateListDTO): void {
    this.dialogS.openDialog(ContractTemplateFormComponent, { item }, "Editar Machote", DialogSize.lg).then(() => this.onLoadData());
  }

  onToggleActive(item: ContractTemplateListDTO): void {
    this.apiS.onPatch(Endpoints.HR.ContractTemplate.toggleActive(item.id), {}).then(() => this.onLoadData());
  }

  onDelete(id: string): void {
    this.apiS.onDelete(Endpoints.HR.ContractTemplate.delete(id)).then(() => this.onLoadData());
  }
}
