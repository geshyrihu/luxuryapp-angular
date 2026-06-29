import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { documentTextOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { CustomSearchInput } from "src/app/core/components/inputs/web/custom-search-input-signal";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { PdfViewerModal } from "src/app/core/components/shared/pdf-viewer-modal/pdf-viewer-modal";
import { CustomButtonViewPdf } from "src/app/core/components/web/buttons/custom-button-view-pdf";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EDocumentType } from "src/app/features/legal/asuntos-legales-y-seguros/models/document-type.enum";
@Component({
  selector: "app-biblioteca-consejo-directivo-detalle",
  imports: [
    TableModule,
    CustomButtonViewPdf,
    DataViewMobile,
    CustomSearchInput,
    IonItem,
    IonLabel,
    AppIcon,
  ],

  templateUrl: "./biblioteca-consejo-directivo-detalle.html",
})
export class BibliotecaConsejoDirectivoDetalle implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  route = inject(ActivatedRoute);
  dataSignal = signal<any[]>([]);

  documentType: EDocumentType | undefined;
  pageTitle: string = "";

  routeData = toSignal(this.route.data);

  constructor() {
    addIcons({ documentTextOutline });
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId && this.documentType !== undefined) this.onLoadData();
    });

    effect(() => {
      const data = this.routeData();
      if (data) {
        this.pageTitle = data["title"];
        this.documentType = data["documentType"];
        console.log("Tipo de documento:", this.documentType);
        console.log("Título de la pógina:", this.pageTitle);
        this.onLoadData();
      }
    });
  }

  ngOnInit(): void {
    // Subscription moved to effect
  }

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  filterText: string = "";
  window: any = window; // Make window object available in template

  onLoadData() {
    const customerId: string = this.customerIdS.customerId();
    if (this.documentType == EDocumentType.MaintenancePolicy) {
      const urlApi = Endpoints.PolicyContracts.list(customerId, true);
      this.apiResponseS.onGetList(urlApi).then((result: any[] | null) => {
        if (result) {
          const mappedData = result.map((x: any) => ({
            id: x.id,
            name: x.description,
            path: x.pathDocument,
            date: x.startDateFormatted,
            primaryDetail: x.provider,
            secondaryDetail: `Vigencia: ${x.validity}`,
            policyDescription: x.description,
            policyProvider: x.provider,
            policyValidity: x.validity,
            policyDocumentName: x.document,
          }));
          this.dataSignal.set(mappedData);
        }
        this.loading.set(false);
      });
    } else {
      const urlApi = Endpoints.CustomDocuments.list(
        customerId,
        this.documentType!,
      );
      this.apiResponseS.onGetList(urlApi).then((result: any[] | null) => {
        if (result) {
          let mappedData = result.map((x: any) => ({
            id: x.id,
            name: x.name,
            path: x.path,
            date: x.createAt,
            primaryDetail: x.folio,
            secondaryDetail: x.createdById,
            customFolio: x.folio,
            customCreatedBy: x.createdById,
          }));

          if (this.documentType === EDocumentType.Asambleas) {
            mappedData.sort((a, b) => {
              const dateA = new Date(a.date).getTime();
              const dateB = new Date(b.date).getTime();
              return dateB - dateA;
            });
          }

          this.dataSignal.set(mappedData);
        }
        this.loading.set(false);
      });
    }
  }
  viewPdf(url: string, fileName: string): void {
    this.dialogHandlerS.openDialog(
      PdfViewerModal,
      { pdfSrc: url, fileName: fileName },
      fileName,
      this.dialogHandlerS.sizeFull,
      true, // ? autoMaximize = true
    );
  }
}
