import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { folderOpenOutline, readerOutline } from "ionicons/icons"; // Importamos el Router para la navegación
import { TableModule } from "primeng/table";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { getIconForFileHelper } from "src/app/core/helpers/extension-file";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
@Component({
  selector: "app-minutas-reuniones-consejo-directivo",
  imports: [
    TableModule,
    RouterModule,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    AppIcon,
  ],
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
    const urlApi = `BoardDirectors/meeting-minutes/${customerId}`;

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
