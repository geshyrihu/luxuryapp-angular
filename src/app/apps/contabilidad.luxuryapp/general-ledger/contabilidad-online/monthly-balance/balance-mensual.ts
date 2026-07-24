import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { TableModule } from "@ui/web/primeng-table/primeng-table";

import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { IFinancialStatementDto } from "../interfaces/aspel-budget.interface";
import { AccountingNumberPipe } from "../pipes/accounting-number.pipe";

@Component({
  selector: "app-balance-mensual",
  imports: [
    AppIcon,
    FormsModule,
    TableModule,
    WebButtonLabel,
    CustomInputTextSignal,
    AccountingNumberPipe,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./balance-mensual.html",
})
export class BalanceMensual {
  private apiS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  // State
  loading = signal<boolean>(false);
  data = signal<IFinancialStatementDto | null>(null);
  year = signal<number>(new Date().getFullYear());

  // Constants para el HTML
  MONTHS = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  // Computed properties para el HTML
  nombreEmpresa = computed(() => this.data()?.nombreEmpresa || "");
  periodo = computed(() => this.data()?.periodoPresupuesto || "");

  rows = computed(() => {
    const d = this.data();
    if (!d) return [];

    const result: any[] = [];
    d.clasificaciones.forEach((clas) => {
      // Header: Usando 'nombre' y 'codigo' de IClasificacionCuentasDto
      result.push({
        tipo: "header",
        descripcion: clas.nombre,
        clasificacionCodigo: clas.codigo,
      });

      // Cuentas
      clas.cuentasMayor.forEach((cta) => {
        result.push({
          tipo: "cuenta",
          numeroCuenta: cta.numeroCuenta,
          descripcion: cta.descripcion,
          montos: [
            cta.montoEnero,
            cta.montoFebrero,
            cta.montoMarzo,
            cta.montoAbril,
            cta.montoMayo,
            cta.montoJunio,
            cta.montoJulio,
            cta.montoAgosto,
            cta.montoSeptiembre,
            cta.montoOctubre,
            cta.montoNoviembre,
            cta.montoDiciembre,
          ],
        });
      });

      // Subtotal (Placeholder de ceros ya que la interfaz no trae totales por mes en la clasificacion)
      result.push({
        tipo: "subtotal",
        descripcion: `Total ${clas.nombre}`,
        montos: new Array(12).fill(0),
      });
    });

    return result;
  });

  constructor() {
    effect(() => {
      const custId = this.customerIdS.customerId();
      const yr = this.year();
      if (custId && yr) {
        this.loadData(custId, yr);
      }
    });
  }

  onLoad() {
    const custId = this.customerIdS.customerId();
    if (custId) {
      this.loadData(custId, this.year());
    }
  }

  async loadData(customerId: string, year: number) {
    this.loading.set(true);
    this.data.set(null);
    const result = await this.apiS.onGetItem<IFinancialStatementDto>(
      Endpoints.ContabilidadOnline.FinancialStatements.balanceSheet(
        customerId,
        year,
      ),
    );
    if (result) this.data.set(result);
    this.loading.set(false);
  }

  getHeaderStyle(codigo: string): string {
    switch (codigo) {
      case "1":
        return "background-color: #e3f2fd; color: #0d47a1;";
      case "2":
        return "background-color: #fbe9e7; color: #b71c1c;";
      case "3":
        return "background-color: #f1f8e9; color: #1b5e20;";
      default:
        return "background-color: #f5f5f5;";
    }
  }
}
