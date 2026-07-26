import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { WebButtonLabelViewPdf } from "@ui/buttons/web-label/button-view-pdf";
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
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";

@Component({
  selector: "app-asambleas",
  imports: [
    WebButtonIconViewPdf,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    WebButtonLabelViewPdf,
    WebButtonLabelViewPdf,
    MobileListItem,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
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
