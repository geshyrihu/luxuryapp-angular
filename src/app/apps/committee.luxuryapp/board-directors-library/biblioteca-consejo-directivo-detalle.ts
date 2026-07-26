import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PdfViewerModal } from "@ui/web/pdf-viewer-modal/pdf-viewer-modal";
import { EDocumentType } from "src/app/apps/legal.luxuryapp/asuntos-legales-y-seguros/interfaces/document-type.enum";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";

@Component({
  selector: "app-biblioteca-consejo-directivo-detalle",
  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
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
  loading = signal(true);

  routeData = toSignal(this.route.data);

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId && this.documentType !== undefined) this.onLoadData();
    });

    effect(() => {
      const data = this.routeData();
      if (data) {
        this.pageTitle = data["title"];
        this.documentType = data["documentType"];
        this.onLoadData();
      }
    });
  }

  ngOnInit(): void {
    // Carga disparada por los effects del constructor.
  }

  onLoadData() {
    const customerId: string = this.customerIdS.customerId();
    if (this.documentType == EDocumentType.MaintenancePolicy) {
      const urlApi = Endpoints.Committee.Library.policyContracts(
        customerId,
        true,
      );
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
      const urlApi = Endpoints.Committee.Library.customDocumentsByType(
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
