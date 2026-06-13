import { Component, computed, effect, inject, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { TableModule } from "primeng/table";
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
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EDocumentType } from "src/app/features/tenant/legal/models/document-type.enum";
import { IonButtonViewPdf } from "src/app/core/components/buttons/mobile";
@Component({
  selector: "app-asambleas",
  imports: [
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    CustomButtonViewPdf,
    IonItem,
    IonLabel,
    IonButtonViewPdf,
  ],
  templateUrl: "./asambleas-list.html",
})
export class Asambleas {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);
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
      EDocumentType.Asambleas,
    );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.dataSignal.set(result.sort((a, b) => a.sortOrder - b.sortOrder));
    });
  }

  onRowReorder(event: any) {
    const documentIds = this.dataSignal().map((item) => item.id);
    this.apiResponseS
      .onPut(Endpoints.CustomDocuments.updateOrder, { documentIds })
      .then((result) => {
        // Opcional: Mostrar una notificación de éxito
      })
      .catch((error) => {
        // Opcional: Manejar el error y revertir el orden si es necesario
      });
  }
}









