import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { DocumentoPersonalizadoForm } from "@legal.luxuryapp/legal-matters/custom-documents/documento-personalizado-form";
import { EDocumentType } from "@legal.luxuryapp/legal-matters/interfaces/document-type.enum";
import { WebButtonLabelViewPdf } from "@ui/buttons/web-label/button-view-pdf";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { TableFooter } from "@ui/web/table-footer/table-footer";
import {
  AppReorderableRow,
  AppReorderableRowHandle,
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "@ui/web/table/table";
@Component({
  selector: "app-special-document-list",
  imports: [
    TableEmptyMessage,
    AppTable,

    AppSortableColumn,

    AppSorticon,
    AppReorderableRow,
    AppReorderableRowHandle,
    TableCaption,
    TableFooter,
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
  tableRows: number = tableRows();
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

  onRowReorder(event: { dragIndex: number; dropIndex: number }) {
    const reordered = [...this.dataSignal()];
    const [moved] = reordered.splice(event.dragIndex, 1);
    if (!moved) return;
    reordered.splice(event.dropIndex, 0, moved);
    this.dataSignal.set(reordered);
    const documentIds = reordered.map((item) => item.id);
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
