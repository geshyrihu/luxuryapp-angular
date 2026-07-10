import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelViewPdf } from "@ui/buttons/mobile-label/button-view-pdf";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PolicyContractForm } from "./policy-contract-form";

import { WebButtonIconActiveDesactive } from "@ui/buttons/web-icon/button-active-desactive";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-policy-contract-list",
  templateUrl: "./policy-contract-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconActiveDesactive,
    WebButtonIconViewPdf,
    WebButtonIconEdit,
    WebButtonIconDelete,
    TooltipModule,
    MobileActionMenu,
    MobileButtonLabelViewPdf,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    LxTag,
    PrimeNgCustomCaption,
    DataViewMobile,
  ],
})
export class PolicyContractList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  dataSignal = signal<any[]>([]);
  groupedData: any = {};

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  isCurrent: boolean = true;
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  ref: DynamicDialogRef;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData(this.isCurrent);
      }
    });
  }

  groupData(data: any[]): any {
    const grouped: any = {};
    for (const item of data) {
      const groupName = item.typeOfContract;
      if (!grouped[groupName]) {
        grouped[groupName] = [];
      }
      grouped[groupName].push(item);
    }
    return grouped;
  }

  onLoadData(isCurrent: boolean = true) {
    const urlApi = Endpoints.PolicyContracts.list(
      this.customerIdS.customerId(),
      isCurrent,
    );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      const mappedData = result.map((item) => ({ ...item, visible: true }));
      this.dataSignal.set(mappedData);
      this.groupedData = this.groupData(mappedData);
    });
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.PolicyContracts.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        PolicyContractForm,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.isCurrent);
      });
  }
  onDeleteDocument(id: any) {
    const urlApi = Endpoints.PolicyContracts.deleteDocument(id);
    this.apiResponseS.onGetItem(urlApi).then(() => {
      this.onLoadData();
    });
  }

  onSelectActive(isCurrent: boolean): any {
    this.isCurrent = isCurrent;
    this.onLoadData(isCurrent);
  }
  getTagSeverity(tagLabel: string | null): "success" | "warn" | "danger" {
    if (tagLabel === "Vigente") {
      return "success"; // Si no hay etiqueta, consideramos que está vigente
    }
    if (tagLabel === "Próximo a vencer") {
      return "warn"; // Si no hay etiqueta, consideramos que está vigente
    }
    if (tagLabel === "Vencido") {
      return "danger"; // Si no hay etiqueta, consideramos que está vigente
    }
  }
}
