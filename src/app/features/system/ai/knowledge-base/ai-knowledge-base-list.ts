import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { AiKnowledgeBaseDTO } from "src/app/core/interfaces/ai-knowledge-base.dto";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { AiKnowledgeBaseForm } from "./ai-knowledge-base-form";

@Component({
  selector: "app-ai-knowledge-base-list",
  templateUrl: "./ai-knowledge-base-list.html",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    MobileActionMenu,
    MobileListItem,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [ConfirmationService, DialogService],
})
export class AiKnowledgeBaseList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  confirmationService = inject(ConfirmationService);

  dataSignal = signal<AiKnowledgeBaseDTO[]>([]);

  // PrimeNG Table Options
  loading = signal(true);
  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  readonly globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  ngOnInit(): void {
    this.onLoadData();
  }

  async onLoadData() {
    const result = await this.apiResponseS.onGetList<AiKnowledgeBaseDTO[]>(
      Endpoints.AiKnowledgeBase.base,
    );
    if (result) {
      this.dataSignal.set(result);
      this.loading.set(false);
    }
  }

  async onDelete(id: string) {
    this.confirmationService.confirm({
      message: "ÂóEstÃós seguro de que quieres eliminar este registro?",
      header: "Confirmar",
      icon: "mdi:alert",
      accept: async () => {
        const success = await this.apiResponseS.onDelete(
          Endpoints.AiKnowledgeBase.delete(id),
        );
        if (success) {
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
        }
      },
    });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        AiKnowledgeBaseForm,
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
}
