import { Component, computed, effect, inject, signal, ChangeDetectionStrategy } from "@angular/core";
import { AppSpinner } from "@ui/web/spinner/spinner";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { SanitizeHtmlPipe } from "src/app/core/pipes/sanitize-html.pipe";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
// DETALLE IMPORTANTE: Una interfaz para la estructura de los datos.
// Esto es opcional pero hace el código mucho mós robusto y fócil de leer.
interface ActivoItem {
  photoPath: string;
  ubication: string;
  nameMachinery: string;
  brand: string;
  model: string;
  technicalSpecifications: string;
  Observaciones: string;
}

interface ActivoGroup {
  ubication: string;
  items: ActivoItem[];
}

@Component({
  selector: "app-reporte-completo-activos",
  templateUrl: "./reporte-completo-activos.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SanitizeHtmlPipe, AppSpinner],
})
// óCAMBIO! Ya no implementamos OnInit.
export class ReporteCompletoActivos {
  // --- INYECCIóN DE DEPENDENCIAS (sin cambios) ---
  private customerIdS = inject(CustomerIdService);
  apiResponseS = inject(ApiResponseService);
  // --- ESTADO DEL COMPONENTE CON SIGNALS ---

  // óCAMBIO CLAVE! `data` ahora es un signal. Mantenemos el nombre por convención.
  data = signal<ActivoGroup[]>([]);
  loading = signal(true);

  // --- PROPIEDADES DE CONFIGURACIóN (sin cambios) ---
  globalFilterFields = computed(() => globalFilterFields(this.data()));
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  titulo: string = ""; // Esta propiedad no se usa en el template, pero la mantenemos.

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData(customerId);
      }
    });
  }

  // --- CARGA DE DATOS (Refactorizado) ---
  async onLoadData(customerId: string) {
    const urlApi = `Machineries/InventarioCompleto/${customerId}`;

    try {
      const result = await this.apiResponseS.onGetList<ActivoGroup[]>(urlApi);
      // Actualizamos el signal `data` con los datos recibidos.
      this.data.set(result);
    } catch (error) {
      console.error("Error al cargar el inventario completo:", error);
      this.data.set([]); // En caso de error, aseguramos que `data` sea un array vacío.
    } finally {
    }
  }
}









