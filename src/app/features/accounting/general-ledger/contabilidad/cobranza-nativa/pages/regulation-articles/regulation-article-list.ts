import { CurrencyPipe } from "@angular/common";
import { Component, effect, inject, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { documentTextOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web/label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web/label/button-edit";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { RegulationArticleResponseDTO } from "../../models/property-fine.dto";
import { RegulationArticleForm } from "./regulation-article-form";

@Component({
  selector: "app-regulation-article-list",
  imports: [
    EmptyState,
    TableModule,
    TagModule,
    PrimeNgCustomCaption,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    CurrencyPipe,
    DataViewMobile,
    ActionMenu,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    IonItem,
    IonLabel,
  ],
  templateUrl: "./regulation-article-list.html",
})
export default class RegulationArticleList {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  dataSignal = signal<RegulationArticleResponseDTO[]>([]);

  constructor() {
    addIcons({ documentTextOutline });
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
    >(
      Endpoints.AccountingCoi.NativeCollection.RegulationArticles.byCustomer(
        customerId,
      ),
    );
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
        this.dialogHandlerS.sizeLg,
      )
      .then((res: boolean) => {
        if (res) this.onLoadData();
      });
  }

  async onDelete(item: RegulationArticleResponseDTO) {
    this.apiResponseS
      .onDelete(
        Endpoints.AccountingCoi.NativeCollection.RegulationArticles.delete(
          item.id,
        ),
      )
      .then((res) => {
        if (res) this.onLoadData();
      });
  }
}
