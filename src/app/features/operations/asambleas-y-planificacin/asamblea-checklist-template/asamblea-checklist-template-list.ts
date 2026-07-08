import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AsambleaChecklistTemplateForm } from "./asamblea-checklist-template-form";
import { IAsambleaChecklistTemplateDTO } from "./asamblea-checklist-template.dto";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";

@Component({
  selector: "app-asamblea-checklist-template-list",
  templateUrl: "./asamblea-checklist-template-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    TagModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,  ],
})
export class AsambleaChecklistTemplateList implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly dialogHandlerS = inject(DialogHandlerService);
  private readonly tableScrollHeightS = inject(TableScrollHeightService);

  readonly dataSignal = signal<IAsambleaChecklistTemplateDTO[]>([]);
  readonly tablePrimeNgRows = tablePrimeNgRows();
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
      .onGetList<
        IAsambleaChecklistTemplateDTO[]
      >(Endpoints.AsambleaChecklistTemplate.getAll)
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
