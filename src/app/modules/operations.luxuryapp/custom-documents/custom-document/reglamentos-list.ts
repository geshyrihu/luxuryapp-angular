import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { LxModal } from "@ui/adaptive/modal/modal";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelViewPdf } from "@ui/buttons/web-label/button-view-pdf";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { TableFooter } from "@ui/web/table-footer/table-footer";
import { AppTable, AppSortableColumn, AppSorticon, AppReorderableRow, AppReorderableRowHandle } from "@ui/web/table/table";
import { EDocumentType } from "@legal.luxuryapp/asuntos-legales-y-seguros/interfaces/document-type.enum";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { AiService } from "@core/services/ai.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { AppMessage } from "@ui/web/message/message";

@Component({
  selector: "app-reglamentos",
  imports: [
    WebButtonIcon,
    LxTooltipDirective,
    WebButtonIconViewPdf,
    TableEmptyMessage,
    AppTable,

    AppSortableColumn,

    AppSorticon,
    AppReorderableRow,
    AppReorderableRowHandle,
    WebButtonLabel,
    NgbTooltipModule,
    TableCaption,
    TableFooter,
    DataViewMobile,
    WebButtonLabelViewPdf,
    LxModal,
    CustomInputTextAreaSignal,
    ReactiveFormsModule,
    WebButtonLabelViewPdf,
    MobileListItem,
    AppIcon,
    AppMessage,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./reglamentos-list.html",
})
export class Reglamentos {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);
  aiService = inject(AiService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  filterText: string = "";

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const customerId: string = this.customerIdS.customerId();
    const urlApi = Endpoints.CustomDocuments.list(
      customerId,
      EDocumentType.Reglamentos,
    );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.dataSignal.set(result.sort((a, b) => a.sortOrder - b.sortOrder));
    });
  }

  showConsultationDialog = signal(false);
  consultationQueryControl = new FormControl<string>("");
  consultingDoc = signal(false);
  aiResponse = signal("");
  selectedDocId: string = "";

  openConsultation(docId: string) {
    this.selectedDocId = docId;
    this.consultationQueryControl.setValue("");
    this.aiResponse.set("");
    this.showConsultationDialog.set(true);
  }

  async consultAi() {
    if (!this.consultationQueryControl.value?.trim()) return;

    this.consultingDoc.set(true);
    this.aiResponse.set("");

    try {
      const response = await this.aiService.consultDocument(
        this.selectedDocId,
        this.consultationQueryControl.value || "",
      );
      this.aiResponse.set(response);
    } catch (error) {
      console.error(error);
      this.aiResponse.set(
        "Ocurrió un error al consultar el documento. Por favor intenta de nuevo.",
      );
    } finally {
      this.consultingDoc.set(false);
    }
  }

  onRowReorder(event: { dragIndex: number; dropIndex: number }) {
    const reordered = [...this.dataSignal()];
    const [moved] = reordered.splice(event.dragIndex, 1);
    if (!moved) return;
    reordered.splice(event.dropIndex, 0, moved);
    this.dataSignal.set(reordered);
    const documentIds = reordered.map((item) => item.id);
    this.apiResponseS
      .onPut(Endpoints.CustomDocuments.updateOrder, { documentIds })
      .then((result) => {})
      .catch((error) => {});
  }
}
