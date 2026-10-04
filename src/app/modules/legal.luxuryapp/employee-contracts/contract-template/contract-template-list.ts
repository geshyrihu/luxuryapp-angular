import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { ContractTemplateFormComponent } from "./contract-template-form";
import { ContractTemplateListDTO } from "./interfaces/contract-template.dto";

import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-contract-template-list",
  templateUrl: "./contract-template-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIconItem,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelItem,
    TableEmptyMessage,
    ApiDatePipe,
    AppTable,
    LuxTableCaption,
    TableFooter,
    DataViewMobile,
  ],
})
export class ContractTemplateList implements OnInit {
  apiS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollH = inject(TableScrollHeightService);

  items = signal<ContractTemplateListDTO[]>([]);
  globalFilter = signal<string>("");
  globalFilterFields = computed(() => globalFilterFields(this.items()));

  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    this.apiS
      .onGetList<ContractTemplateListDTO[]>(
        Endpoints.HR.ContractTemplate.getAll,
      )
      .then((resp) => {
        if (resp) this.items.set(resp);
      });
  }

  onModalForm(data: { id: string; title: string }): void {
    this.dialogHandlerS
      .openDialog(
        ContractTemplateFormComponent,
        { item: null },
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then(() => this.onLoadData());
  }

  onEdit(item: ContractTemplateListDTO): void {
    this.dialogHandlerS
      .openDialog(
        ContractTemplateFormComponent,
        { item },
        "Editar Machote",
        this.dialogHandlerS.sizeXl,
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
