import {
  ChangeDetectionStrategy,
  Component,
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
import { AddendumTemplateFormComponent } from "./addendum-template-form";
import { AddendumTemplateListDTO } from "./interfaces/addendum-template.dto";

import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-addendum-template-list",
  templateUrl: "./addendum-template-list.html",
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
export class AddendumTemplateList implements OnInit {
  apiS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollH = inject(TableScrollHeightService);

  items = signal<AddendumTemplateListDTO[]>([]);
  globalFilter = signal<string>("");
  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  globalFilterFields = globalFilterFields(["name", "addendumType"]);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    this.apiS
      .onGetList<AddendumTemplateListDTO[]>(
        Endpoints.HR.AddendumTemplate.getAll,
      )
      .then((resp) => {
        if (resp) this.items.set(resp);
      });
  }

  onModalForm(data: { id: string; title: string }): void {
    this.dialogHandlerS
      .openDialog(
        AddendumTemplateFormComponent,
        { data: { item: null } },
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then(() => this.onLoadData());
  }

  onEdit(item: AddendumTemplateListDTO): void {
    this.dialogHandlerS
      .openDialog(
        AddendumTemplateFormComponent,
        { data: { item } },
        "Editar Machote de Adenda",
        this.dialogHandlerS.sizeXl,
      )
      .then(() => this.onLoadData());
  }

  onToggleActive(item: AddendumTemplateListDTO): void {
    this.apiS
      .onPatch(Endpoints.HR.AddendumTemplate.toggleActive(item.id), {})
      .then(() => this.onLoadData());
  }

  onDelete(id: string): void {
    this.apiS
      .onDelete(Endpoints.HR.AddendumTemplate.delete(id))
      .then(() => this.onLoadData());
  }
}
