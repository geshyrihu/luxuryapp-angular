import { Component, effect, inject, signal } from "@angular/core";
import { TableModule } from "primeng/table";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
interface FinancialReportResponse {
  estadosFinancieros: any[];
  customer: any;
}

@Component({
  selector: "app-estados-financieros",
  imports: [TableModule],
  templateUrl: "./estados-financieros.html",
})
// óCAMBIO! Ya no es necesario implementar OnInit.
export class EstadosFinancieros {
  // --- INYECCIóN DE DEPENDENCIAS (sin cambios) ---
  apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  tableScrollHeightS = inject(TableScrollHeightService);
  // --- ESTADO DEL COMPONENTE CON SIGNALS ---

  // 1. Un signal para gestionar el estado de carga de forma centralizada.
  loading = signal(true);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  // 2. Un ónico signal para almacenar la respuesta completa de la API.
  //    Esto evita tener propiedades separadas (`data`, `customerData`) que podrían
  //    desincronizarse y simplifica la lígica del template.
  reportData = signal<FinancialReportResponse | null>(null);

  constructor() {
    // 3. El `effect` es el motor reactivo. Se ejecuta cuando el componente
    //    se inicia y cada vez que `customerIdS.customerId()` cambia.
    effect(() => {
      const currentCustomerId = this.customerIdS.customerId();
      if (currentCustomerId) {
        this.onLoadData(currentCustomerId);
      }
    });
  }

  // 4. El método de carga de datos, ahora mós limpio con `async/await`.
  async onLoadData(customerId: string) {
    this.reportData.set(null); // Reseteamos el estado para una nueva carga.

    const urlApi = `Reports/EstadosFinancieros/${customerId}`;

    try {
      // 5. Hacemos la llamada a la API y esperamos el resultado.
      const result =
        await this.apiResponseS.onGetList<FinancialReportResponse>(urlApi);
      // 6. Actualizamos el signal con la respuesta completa.
      this.reportData.set(result);
    } catch (error) {
      console.error("Error al cargar los estados financieros:", error);
      this.reportData.set(null); // En caso de error, nos aseguramos de que no haya datos.
    } finally {
      // 7. El bloque `finally` asegura que el indicador de carga siempre se desactive.
    }
  }

  // óOBSOLETO! El hook ngOnInit y las propiedades locales (`data`, `customerData`)
  // ya no son necesarios gracias a la arquitectura reactiva con signals.
}









