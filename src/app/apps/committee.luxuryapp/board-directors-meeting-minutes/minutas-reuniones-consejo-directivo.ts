import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { addIcons } from "ionicons";
import { folderOpenOutline, readerOutline } from "ionicons/icons";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { getIconForFileHelper } from "src/app/core/helpers/extension-file";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
@Component({
  selector: "app-minutas-reuniones-consejo-directivo",
  imports: [RouterModule, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./minutas-reuniones-consejo-directivo.html",
})
export class MinutasReunionesConsejoDirectivo implements OnInit {
  constructor() {
    addIcons({ folderOpenOutline, readerOutline });
  }
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);

  // Signals para el estado del componente
  dataSignal = signal<any[]>([]);
  loading = signal(true);
  getIconForFile = getIconForFileHelper;
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

    // Usamos el endpoint específico para las minutas que creamos en el backend
    const urlApi =
      Endpoints.Committee.BoardDirectors.meetingMinutesByCustomer(customerId);

    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => {
        this.dataSignal.set(result);
      })

      .finally(() => {
        this.loading.set(false);
      });
  }
}
