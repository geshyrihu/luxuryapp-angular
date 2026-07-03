import { DatePipe } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { TableModule } from "primeng/table";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web-label/button-edit";
import { WebButtonLabelItem } from "src/app/core/components/buttons/web-label/button-item";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import { DialogSize } from "src/app/core/enums/dialog-size";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ContractTemplateListDTO } from "../models/contract-template.dto";
import { ContractTemplateFormComponent } from "./contract-template-form";

@Component({
  selector: "app-contract-template-list",
  templateUrl: "./contract-template-list.html",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    DatePipe,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    WebButtonLabelItem,
    DataViewMobile,
    ActionMenu,
    WebButtonLabelItem,
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
    this.apiS
      .onGetList<
        ContractTemplateListDTO[]
      >(Endpoints.HR.ContractTemplate.getAll)
      .then((resp) => {
        if (resp) this.items.set(resp);
      });
  }

  onModalForm(data: { id: string; title: string }): void {
    this.dialogS
      .openDialog(
        ContractTemplateFormComponent,
        { item: null },
        data.title,
        DialogSize.lg,
      )
      .then(() => this.onLoadData());
  }

  onEdit(item: ContractTemplateListDTO): void {
    this.dialogS
      .openDialog(
        ContractTemplateFormComponent,
        { item },
        "Editar Machote",
        DialogSize.lg,
      )
      .then(() => this.onLoadData());
  }

  onToggleActive(item: ContractTemplateListDTO): void {
    this.apiS
      .onPatch(Endpoints.HR.ContractTemplate.toggleActive(item.id), {})
      .then(() => this.onLoadData());
  }

  onDelete(id: string): void {
    this.apiS
      .onDelete(Endpoints.HR.ContractTemplate.delete(id))
      .then(() => this.onLoadData());
  }
}
