import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { CustomButtonDelete } from "src/app/core/components/web/buttons/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/web/buttons/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
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
    EmptyState,
    CommonModule,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    CustomButtonEdit,
    CustomButtonDelete,
    AppIcon,
  ],
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
      message: "Ã‚¿EstÃƒ¡s seguro de que quieres eliminar este registro?",
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

