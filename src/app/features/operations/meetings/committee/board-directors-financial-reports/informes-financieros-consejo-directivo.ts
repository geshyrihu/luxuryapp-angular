import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {} from "@ionic/angular/standalone";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PdfViewerModal } from "@ui/web/pdf-viewer-modal/pdf-viewer-modal";
import { addIcons } from "ionicons";
import { documentTextOutline, folderOpenOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { getIconForFileHelper } from "src/app/core/helpers/extension-file";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
@Component({
  selector: "app-informes-financieros-consejo-directivo",
  imports: [TableModule, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./informes-financieros-consejo-directivo.html",
})
export class InformesFinancierosConsejoDirectivo implements OnInit {
  constructor() {
    addIcons({ documentTextOutline, folderOpenOutline });
  }
  // Inyectamos los servicios necesarios
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService); // Necesario para obtener el ID del cliente
  private dialogHandlerS = inject(DialogHandlerService);
  // Declaración de signals para manejar el estado, igual que en Bancos
  dataSignal = signal<any[]>([]);
  loading = signal(true);

  // Opciones de la tabla PrimeNG, replicando la estructura de Bancos
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  getIconForFile = getIconForFileHelper;
  // Computed signal para los campos de bósqueda global, se actualiza automóticamente
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    // Solo calcula los campos si hay datos, para evitar errores
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.loading.set(true);
    const customerId: string = this.customerIdS.customerId(); // Obtenemos el customerId del servicio

    // Validamos que tengamos un customerId antes de llamar a la API
    if (!customerId) {
      console.error("Customer ID no encontrado.");
      this.loading.set(false);
      return;
    }

    // Construimos la URL del endpoint que creamos en el backend
    const urlApi = `BoardDirectors/financial-reports/${customerId}`;

    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => {
        // Asignamos el resultado al signal, lo que refrescaré la vista
        this.dataSignal.set(result);
      })
      .finally(() => {
        // Nos aseguramos de detener el indicador de carga, incluso si hay un error
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
