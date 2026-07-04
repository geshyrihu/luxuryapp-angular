import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { documentOutline } from "ionicons/icons";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web-label/button-edit";
import { WebButtonLabelViewPdf } from "src/app/core/components/buttons/web-label/button-view-pdf";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { EDocumentType } from "src/app/features/legal/asuntos-legales-y-seguros/models/document-type.enum";
import { DocumentoPersonalizadoForm } from "./documento-personalizado-form";
import { MobileActionMenu } from "src/app/core/components/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelEdit } from "src/app/core/components/buttons/mobile-label/button-edit";
import { MobileButtonLabelDelete } from "src/app/core/components/buttons/mobile-label/button-delete";

import { WebButtonIconViewPdf } from "src/app/core/components/buttons/web-icon/button-view-pdf";
import { WebButtonIconEdit } from "src/app/core/components/buttons/web-icon/button-edit";
import { WebButtonIconDelete } from "src/app/core/components/buttons/web-icon/button-delete";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-documento-personalizado-lista",
  imports: [
    WebButtonIconViewPdf,
    WebButtonIconEdit,
    WebButtonIconDelete,
    TooltipModule,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    InputTextModule,
    ReactiveFormsModule,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    WebButtonLabelViewPdf,
    ActionMenu,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    IonItem,
    IonLabel,
  ],
  templateUrl: "./documento-personalizado-lista.html",
})
export class DocumentoPersonalizadoLista implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  route = inject(ActivatedRoute);
  tableScrollHeightS = inject(TableScrollHeightService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  scrollHeight = this.tableScrollHeightS.scrollHeight;
  documentType: EDocumentType | undefined;
  pageTitle: string = "";

  private routeDataSignal = toSignal(this.route.data);

  constructor() {
    addIcons({ documentOutline });
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId && this.documentType !== undefined) this.onLoadData();
    });

    effect(() => {
      const data = this.routeDataSignal();
      if (data) {
        this.pageTitle = data["title"];
        this.documentType = data["documentType"];
      }
    });
  }

  ngOnInit(): void {
    // Logic moved to effects
  }

  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  filterTextControl = new FormControl<string>("");

  onLoadData() {
    const customerId: string = this.customerIdS.customerId();
    this.apiResponseS
      .onGetList(
        Endpoints.CustomDocuments.list(customerId, this.documentType as number),
      )
      .then((result: any) => this.dataSignal.set(result));
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
        if (result) this.onLoadData();
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.CustomDocuments.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((current) =>
            current.filter((item) => item.id !== id),
          );
      });
  }
}
