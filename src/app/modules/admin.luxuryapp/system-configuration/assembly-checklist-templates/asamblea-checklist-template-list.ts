import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { TableFooter } from "@ui/web/table-footer/table-footer";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { AsambleaChecklistTemplateForm } from "./asamblea-checklist-template-form";
import { AsambleaChecklistTemplateDto } from "./interfaces/asamblea-checklist-template.dto";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

@Component({
  selector: "app-asamblea-checklist-template-list",
  templateUrl: "./asamblea-checklist-template-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LxTag,
    TableCaption,
    TableFooter,
    DataViewMobile,
  ],
})
export class AsambleaChecklistTemplateList implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly dialogHandlerS = inject(DialogHandlerService);
  private readonly tableScrollHeightS = inject(TableScrollHeightService);

  readonly dataSignal = signal<AsambleaChecklistTemplateDto[]>([]);
  readonly tableRows = tableRows();
  readonly rowsPerPageOptions = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollHeightS.scrollHeight;
  readonly globalFilterFields = globalFilterFields([
    "code",
    "title",
    "category",
    "defaultResponsibleRole",
  ]);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<AsambleaChecklistTemplateDto[]>(
        Endpoints.AsambleaChecklistTemplate.getAll,
      )
      .then((result) => {
        if (result) {
          this.dataSignal.set(result);
        }
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.AsambleaChecklistTemplate.delete(id))
      .then((response) => {
        if (response) {
          this.onLoadData();
        }
      });
  }

  onModalForm(data: { id: string; title: string }) {
    this.dialogHandlerS
      .openDialog(
        AsambleaChecklistTemplateForm,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  severity(isActive: boolean): "success" | "danger" {
    return isActive ? "success" : "danger";
  }
}

