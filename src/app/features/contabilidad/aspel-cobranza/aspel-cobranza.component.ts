import { Component, inject, signal, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { TabsModule } from "primeng/tabs";
import { SelectModule } from "primeng/select";
import { InputTextModule } from "primeng/inputtext";
import { DatePickerModule } from "primeng/datepicker";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { CardModule } from "primeng/card";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { MessageModule } from "primeng/message";
import { DatePipe } from "@angular/common";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { AspelCobranzaService } from "./aspel-cobranza.service";
import type {
  AspelCustomer,
  AspelAccount,
  AspelEstadoCuentaResponse,
} from "./aspel-cobranza.service";

interface EstadoCuentaRequest {
  customerId: string;
  numCta: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
}

@Component({
  selector: "app-aspel-cobranza",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TabsModule,
    SelectModule,
    InputTextModule,
    DatePickerModule,
    ButtonModule,
    TagModule,
    CardModule,
    ProgressSpinnerModule,
    MessageModule,
  ],
  templateUrl: "./aspel-cobranza.component.html",
  styleUrls: ["./aspel-cobranza.component.scss"],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AspelCobranzaComponent {
  private service = inject(AspelCobranzaService);

  activeTab = signal(0);

  customers = signal<AspelCustomer[]>([]);
  customersLoading = signal(false);

  selectedCustomerId = signal<string>("");
  selectedYear = signal<number>(new Date().getFullYear());
  accounts = signal<AspelAccount[]>([]);
  accountsLoading = signal(false);
  customerOptions = signal<{ label: string; value: string }[]>([]);

  estadoCuentaRequest = signal<EstadoCuentaRequest>({
    customerId: "",
    numCta: "",
    fechaInicio: null,
    fechaFin: null,
  });
  estadoCuentaResult = signal<AspelEstadoCuentaResponse | null>(null);
  estadoCuentaLoading = signal(false);

  yearOptions = signal<{ label: string; value: number }[]>(
    this.generateYearOptions(),
  );

  private generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear -5; y <= currentYear +1; y++) {
      years.push({ label: y.toString(), value: y });
    }
    return years;
  }

  loadCustomers() {
    this.customersLoading.set(true);
    this.service.getCustomers().subscribe({
      next: (resp) => {
        if (resp.success && resp.data) {
          this.customers.set(resp.data);
          this.customerOptions.set(
            resp.data.map((c) => ({ label: c.name, value: c.customerId })),
          );
        }
        this.customersLoading.set(false);
      },
      error: () => this.customersLoading.set(false),
    });
  }

  loadAccounts() {
    if (!this.selectedCustomerId() || !this.selectedYear()) return;

    this.accountsLoading.set(true);
    this.service
      .getAccountsByCustomer(this.selectedCustomerId(), this.selectedYear())
      .subscribe({
        next: (resp) => {
          if (resp.success && resp.data) {
            this.accounts.set(resp.data.cuentas);
          } else {
            this.accounts.set([]);
          }
          this.accountsLoading.set(false);
        },
        error: () => {
          this.accounts.set([]);
          this.accountsLoading.set(false);
        },
      });
  }

  loadEstadoCuentaRango() {
    const req = this.estadoCuentaRequest();
    if (!req.customerId || !req.numCta || !req.fechaInicio || !req.fechaFin) {
      return;
    }

    const fechaInicio = this.formatDate(req.fechaInicio);
    const fechaFin = this.formatDate(req.fechaFin);

    this.estadoCuentaLoading.set(true);
    this.service
      .getEstadoCuentaRango(req.customerId, req.numCta, fechaInicio, fechaFin)
      .subscribe({
        next: (resp) => {
          if (resp.success && resp.data) {
            this.estadoCuentaResult.set(resp.data);
          } else {
            this.estadoCuentaResult.set(null);
          }
          this.estadoCuentaLoading.set(false);
        },
        error: () => {
          this.estadoCuentaResult.set(null);
          this.estadoCuentaLoading.set(false);
        },
      });
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() +1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  onCustomerSelectForAccounts(customerId: string) {
    this.selectedCustomerId.set(customerId);
  }

  onCustomerSelectForEstadoCuenta(customerId: string) {
    this.estadoCuentaRequest.update((v) => ({
      ...v,
      customerId,
    }));
  }

  onYearSelect(year: number) {
    this.selectedYear.set(year);
  }

  onNumCtaChange(numCta: string) {
    this.estadoCuentaRequest.update((v) => ({
      ...v,
      numCta,
    }));
  }

  onFechaInicioChange(date: Date | null) {
    this.estadoCuentaRequest.update((v) => ({
      ...v,
      fechaInicio: date,
    }));
  }

  onFechaFinChange(date: Date | null) {
    this.estadoCuentaRequest.update((v) => ({
      ...v,
      fechaFin: date,
    }));
  }

  getSaldosConcepto(): { concepto: string; monto: number }[] {
    const result = this.estadoCuentaResult();
    if (!result?.saldos_finales_por_concepto) return [];
    return result.saldos_finales_por_concepto.map((item) => {
      const key = Object.keys(item)[0];
      return { concepto: key, monto: item[key] };
    });
  }
}
