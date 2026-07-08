import { Component, computed, inject, OnInit, signal } from "@angular/core";
import {
  IonListHeader,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { folderOpenOutline, videocamOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PdfViewerModal } from "@ui/web/pdf-viewer-modal/pdf-viewer-modal";
import { getIconForFileHelper } from "src/app/core/helpers/extension-file";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
@Component({
  selector: "app-reuniones-mensuales-consejo-directivo",
  imports: [TableModule, IonListHeader, AppIcon],
  templateUrl: "./reuniones-mensuales-consejo-directivo.html",
})
export class ReunionesMensualesConsejoDirectivo implements OnInit {
  constructor() {
    addIcons({ folderOpenOutline, videocamOutline });
  }
  // Inyectamos los servicios necesarios
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  getIconForFile = getIconForFileHelper;
  // Signals para manejar el estado del componente
  dataSignal = signal<any[]>([]);
  loading = signal(true);

  // Opciones de la tabla PrimeNG
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.loading.set(true);
    const customerId: string = this.customerIdS.customerId();

    if (!customerId) {
      console.error("Customer ID no encontrado.");
      this.loading.set(false);
      return;
    }

    // Usamos el endpoint específico para las juntas mensuales que creamos en el backend
    const urlApi = `BoardDirectors/monthly-meetings/${customerId}`;

    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => {
        this.dataSignal.set(result);
      })
      .finally(() => {
        this.loading.set(false);
      });
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

