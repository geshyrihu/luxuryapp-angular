import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogModule } from "primeng/dialog";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { TableModule } from "primeng/table";
import { TextareaModule } from "primeng/textarea";
import { CustomButtonViewPdf } from "src/app/core/components/buttons/web/custom-button-view-pdf";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
    globalFilterFields,
    rowsPerPageOptions,
    tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { AiService } from "src/app/core/services/ai.service";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EDocumentType } from "src/app/features/tenant/legal/models/document-type.enum";
import { IonButtonViewPdf } from "src/app/core/components/buttons/mobile";
@Component({
  selector: "app-reglamentos",
  imports: [
    TableModule,
    CustomButton,
    NgbTooltipModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    CustomButtonViewPdf,
    DialogModule,
    TextareaModule,
    ReactiveFormsModule,
    IonItem,
    IonLabel,
    IonButtonViewPdf,
  ],
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

  // AI Consultation
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
      .then((result) => {
        // Opcional: Mostrar una notificación de óxito
      })
      .catch((error) => {
        // Opcional: Manejar el error y revertir el orden si es necesario
      });
  }
}









