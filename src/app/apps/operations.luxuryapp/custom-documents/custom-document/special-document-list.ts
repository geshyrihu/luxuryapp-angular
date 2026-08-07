import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { WebButtonLabelViewPdf } from "@ui/buttons/web-label/button-view-pdf";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { DocumentoPersonalizadoForm } from "src/app/apps/legal.luxuryapp/asuntos-legales-y-seguros/documento-personalizado/documento-personalizado-form";
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
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
@Component({
  selector: "app-special-document-list",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    WebButtonLabelViewPdf,
    MobileListItem,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./special-document-list.html",
})
export class SpecialDocumentList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);
  dataSignal = signal<any[]>([]);
  documentType: EDocumentType;
  title: string = "";

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
    this.documentType = this.activatedRoute.snapshot.data.documentType;
    this.title = this.activatedRoute.snapshot.data.title;
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const customerId: string = this.customerIdS.customerId();
    const urlApi = Endpoints.CustomDocuments.list(
      customerId,
      this.documentType,
    );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.dataSignal.set(result.sort((a, b) => a.sortOrder - b.sortOrder));
    });
  }
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        DocumentoPersonalizadoForm,
        { id: data.id, documentType: this.documentType },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onRowReorder(event: any) {
    const documentIds = this.dataSignal().map((item) => item.id);
    this.apiResponseS
      .onPut(Endpoints.SpecialDocuments.updateOrder, { documentIds })
      .then((result) => {
        // Opcional: Mostrar una notificación de éxito
      })
      .catch((error) => {
        // Opcional: Manejar el error y revertir el orden si es necesario
      });
  }
}
