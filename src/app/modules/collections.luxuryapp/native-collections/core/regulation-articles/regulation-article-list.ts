import { CurrencyPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonMobile } from "@ui/buttons/mobile";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { ButtonWeb } from "@ui/buttons/web";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { RegulationArticleResponseDTO } from "../../interfaces/property-fine.dto";
import { RegulationArticleForm } from "./regulation-article-form";

@Component({
  selector: "app-regulation-article-list",
  imports: [
    LxIcon,
    LxTag,
    ButtonWeb,
    MobileActionMenu,
    ButtonMobile,
    TableEmptyMessage,
    AppTable,
    LuxTableCaption,
    CurrencyPipe,
    DataViewMobile,
    MobileListItem,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./regulation-article-list.html",
})
export default class RegulationArticleList {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private confirmS = inject(ConfirmService);

  tableRows = tableRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  dataSignal = signal<RegulationArticleResponseDTO[]>([]);

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  async onLoadData() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;
    const result = await this.apiResponseS.onGetItem<
      RegulationArticleResponseDTO[]
    >(Endpoints.CobranzaCore.RegulationArticles.byCustomer(customerId));
    this.dataSignal.set(result ?? []);
  }

  onModalForm(id: string = "") {
    const data = {
      id,
      title: id === "" ? "Nuevo Artículo Reglamentario" : "Editar Artículo",
      customerId: this.customerIdS.customerId(),
    };
    this.dialogHandlerS
      .openDialog(
        RegulationArticleForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((res: boolean) => {
        if (res) this.onLoadData();
      });
  }

  async onDelete(item: RegulationArticleResponseDTO) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este artículo del reglamento?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.CobranzaCore.RegulationArticles.delete(item.id))
      .then((res) => {
        if (res) this.onLoadData();
      });
  }
}
