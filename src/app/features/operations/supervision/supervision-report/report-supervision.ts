import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { AppSpinner } from "@ui/web/spinner/spinner";
import { CardModule } from "primeng/card";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
@Component({
  selector: "app-report-supervision",
  imports: [CommonModule, CardModule, LxTag, AppSpinner],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./report-supervision.html",
})
export class ReportSupervision {
  private customerIdS = inject(CustomerIdService);
  apiResponseS = inject(ApiResponseService);
  nameCustomer = this.customerIdS.nombreCorto;
  photoPath = this.customerIdS.customerPhotoPath;

  minutas = signal<any>(null);
  tickets = signal<any>(null);
  pendingLegal = signal<any>(null);
  envioFinancieros = signal<any>(null);

  loadingMinutas = signal(false);
  loadingTickets = signal(false);
  loadingPendingLegal = signal(false);
  loadingEnvioFinancieros = signal(false);

  constructor() {
    effect(() => {
      const currentCustomerId = this.customerIdS.customerId();
      if (currentCustomerId) {
        this.onLoadMinutas(currentCustomerId);
        this.onLoadTickets(currentCustomerId);
        this.onLoadPendingLegal(currentCustomerId);
        this.onLoadEnvioFinancieros(currentCustomerId);
      }
    });
  }

  onLoadMinutas(customerId: string) {
    this.loadingMinutas.set(true);
    this.minutas.set(null);
    this.apiResponseS
      .onGetList(`SupervisionReports/PendingMinutes/${customerId}`)
      .then((result: any) => {
        this.minutas.set(result);
      })
      .catch((error) => {
        console.error("Error al cargar minutas:", error);
        this.minutas.set([]);
      })
      .finally(() => {
        this.loadingMinutas.set(false);
      });
  }

  onLoadTickets(customerId: string) {
    this.loadingTickets.set(true);
    this.tickets.set(null);
    this.apiResponseS
      .onGetList(`SupervisionReports/PendingTickets/${customerId}`)
      .then((result: any) => {
        this.tickets.set(result);
      })
      .catch((error) => {
        console.error("Error al cargar tickets:", error);
        this.tickets.set([]);
      })
      .finally(() => {
        this.loadingTickets.set(false);
      });
  }

  onLoadPendingLegal(customerId: string) {
    this.loadingPendingLegal.set(true);
    this.pendingLegal.set(null);
    this.apiResponseS
      .onGetList(`SupervisionReports/PendingLegal/${customerId}`)
      .then((result: any) => {
        this.pendingLegal.set(result);
      })
      .catch((error) => {
        console.error("Error al cargar pendientes legales:", error);
        this.pendingLegal.set([]);
      })
      .finally(() => {
        this.loadingPendingLegal.set(false);
      });
  }

  onLoadEnvioFinancieros(customerId: string) {
    this.loadingEnvioFinancieros.set(true);
    this.envioFinancieros.set(null);
    this.apiResponseS
      .onGetList(`SupervisionReports/EstadosFinancieros/${customerId}`)
      .then((result: any) => {
        this.envioFinancieros.set(result);
      })
      .catch((error) => {
        console.error("Error al cargar estados financieros:", error);
        this.envioFinancieros.set([]);
      })
      .finally(() => {
        this.loadingEnvioFinancieros.set(false);
      });
  }
}
