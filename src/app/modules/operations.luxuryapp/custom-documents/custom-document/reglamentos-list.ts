import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { AiService } from "@core/services/ai.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { EDocumentType } from "@legal.luxuryapp/legal/interfaces/document-type.enum";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LuxModal } from "@ui/adaptive/modal/modal";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputTextAreaSignal } from "@ui/inputs/web/lux-input-textarea-signal";
import { AppMessage } from "@ui/web/message/message";
import { ReglamentosListDesktop } from "./desktop/reglamentos-list-desktop";
import { ReglamentosListMobile } from "./mobile/reglamentos-list-mobile";

@Component({
  selector: "app-reglamentos",
  imports: [
    ButtonWeb,
    ReglamentosListDesktop,
    ReglamentosListMobile,
    LuxModal,
    AppMessage,
    LuxInputTextAreaSignal,
    ReactiveFormsModule,
    LxIcon,
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
  platformS = inject(PlatformService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
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
