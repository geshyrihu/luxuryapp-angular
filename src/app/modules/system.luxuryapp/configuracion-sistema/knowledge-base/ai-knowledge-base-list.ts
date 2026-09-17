import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "@core/helpers/table-primeng-option";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { AiKnowledgeBaseDto } from "@core/interfaces/ai-knowledge-base.dto";
import {
  DialogHandlerService,
  DialogService,
} from "@core/services/dialog-handler.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { AiKnowledgeBaseForm } from "./ai-knowledge-base-form";

@Component({
  selector: "app-ai-knowledge-base-list",
  templateUrl: "./ai-knowledge-base-list.html",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class AiKnowledgeBaseList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  confirmS = inject(ConfirmService);

  dataSignal = signal<AiKnowledgeBaseDto[]>([]);

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
    const result = await this.apiResponseS.onGetList<AiKnowledgeBaseDto[]>(
      Endpoints.AiKnowledgeBase.base,
    );
    if (result) {
      this.dataSignal.set(result);
      this.loading.set(false);
    }
  }

  async onDelete(id: string) {
    const ok = await this.confirmS.confirm(
      "¿Estás seguro de que quieres eliminar este registro?",
      "Confirmar",
    );
    if (!ok) return;
    const success = await this.apiResponseS.onDelete(
      Endpoints.AiKnowledgeBase.delete(id),
    );
    if (success) {
      this.dataSignal.update((currentData) =>
        currentData.filter((item) => item.id !== id),
      );
    }
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
