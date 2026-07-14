import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { DialogSize } from "src/app/core/enums/dialog-size.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ContractTemplateFormComponent } from "./contract-template-form";
import { ContractTemplateListDTO } from "./interfaces/contract-template.dto";

import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

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
    PrimeNgCustomTableEmptyMessage,
    DatePipe,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
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
      .onGetList<ContractTemplateListDTO[]>(
        Endpoints.HR.ContractTemplate.getAll,
      )
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
