import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { ReportHeader } from "@ui/web/report-header/report-header";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SanitizeHtmlPipe } from "src/app/shared/pipes/sanitize-html.pipe";
@Component({
  selector: "app-entrega-recepcion-mantenimientos-pendientes",
  templateUrl: "./entrega-recepcion-mantenimientos-pendientes.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReportHeader, SanitizeHtmlPipe],
})
export class EntregaRecepcionMantenimientosPendientes {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  data: any[] = [];

  globalFilterFields: string[] = [];
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = Endpoints.RefactorOperations.EntregaRecepcionPendientesById(
      this.customerIdS.customerId(),
    );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.data = result;

      this.globalFilterFields = globalFilterFields(this.data);
    });
  }

  calcularEquiposTotal(name) {
    let total = 0;

    if (this.data) {
      for (let customer of this.data) {
        if (customer.clasificacion === name) {
          total++;
        }
      }
    }

    return total;
  }
}
