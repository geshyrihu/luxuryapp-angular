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
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { EDocumentType } from "src/app/apps/legal.luxuryapp/asuntos-legales-y-seguros/interfaces/document-type.enum";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { AiService } from "src/app/core/services/ai.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";

@Component({
  selector: "app-reglamentos",
  imports: [
    WebButtonIcon,
    LxTooltipDirective,
    WebButtonIconViewPdf,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    WebButtonLabel,
    NgbTooltipModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    WebButtonLabelViewPdf,
    LxModal,
    CustomInputTextAreaSignal,
    ReactiveFormsModule,
    WebButtonLabelViewPdf,
    MobileListItem,
    AppIcon,
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
  tablePrimeNgRows: number = tablePrimeNgRows();
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

  onRowReorder(event: any) {
    const documentIds = this.dataSignal().map((item) => item.id);
    this.apiResponseS
      .onPut(Endpoints.CustomDocuments.updateOrder, { documentIds })
      .then((result) => {})
      .catch((error) => {});
  }
}
