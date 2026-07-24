import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { AppSpinner } from "@ui/web/spinner/spinner";
// Definimos una interfaz para la respuesta de la API.
// Esto es opcional pero MUY RECOMENDADO para tener un código mós seguro y autocompletado.
interface PendingMinutesResponse {
  pendings: any[];
  customer: any;
  administrador: any[];
}

@Component({
  selector: "app-pending-minutes",
  imports: [
    AppSpinner,
    AppIcon,TableModule, ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./pending-minutes.html",
})
export class PendingMinutes {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  tableScrollHeightS = inject(TableScrollHeightService);
  // 1. (MEJORA) Un solo signal para el estado de carga.
  loading = signal(true);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  // 2. (MEJORA CLAVE) Un solo signal para contener TODA la respuesta de la API.
  //    En lugar de tener 3 propiedades separadas (data, customerData, administrador),
  //    las mantenemos juntas como llegaron. Esto simplifica el código y asegura
  //    que los datos nunca estén parcialmente actualizados.
  reportData = signal<PendingMinutesResponse | null>(null);

  constructor() {
    // 3. Usamos `effect` para reaccionar a los cambios del cliente.
    //    Este bloque se ejecutaré autométicamente cuando el customerId cambie.
    effect(() => {
      const currentCustomerId = this.customerIdS.customerId();
      if (currentCustomerId) {
        this.onLoadData(currentCustomerId);
      }
    });
  }

  // 4. Modernizamos el método de carga con `async/await` para mayor legibilidad.
  async onLoadData(customerId: string) {
    this.reportData.set(null); // Limpiamos datos antiguos para evitar mostrar info incorrecta.

    const urlApi = `reports/PendingMinutes/${customerId}`;

    try {
      // 5. Hacemos la llamada a la API y esperamos el resultado.
      const result =
        await this.apiResponseS.onGetList<PendingMinutesResponse>(urlApi);
      // 6. Actualizamos nuestro signal con la respuesta completa.
      this.reportData.set(result);
    } catch (error) {
      console.error("Error al cargar las minutas pendientes:", error);
      this.reportData.set(null); // Aseguramos que no queden datos en caso de error.
    } finally {
      // 7. Pase lo que pase, detenemos el indicador de carga.
    }
  }
}
