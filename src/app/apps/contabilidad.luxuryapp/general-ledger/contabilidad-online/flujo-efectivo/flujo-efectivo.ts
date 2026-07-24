import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TableModule } from "@ui/web/primeng-table/primeng-table";

import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { IFlujoCajaDto } from "../interfaces/aspel-budget.interface";
import { AccountingNumberPipe } from "../pipes/accounting-number.pipe";
import { reportFilterState } from "../state/financial-report-filter.state";

@Component({
  selector: "app-flujo-efectivo",
  imports: [AppIcon, FormsModule, TableModule, AccountingNumberPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./flujo-efectivo.html",
})
export class FlujoEfectivo {
  private apiS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  public filterS = reportFilterState;

  loading = signal<boolean>(false);
  data = signal<IFlujoCajaDto | null>(null);

  columnas = computed(() => {
    try {
      const cols = this.data()?.columnas ?? [];
      if (cols.length === 0) return [];
      const maxIdx = Math.min(cols.length - 1, this.filterS.mesIdx() || 0);
      return cols.slice(0, maxIdx + 1);
    } catch (e) {
      console.error("Error en columnas computed:", e);
      return [];
    }
  });

  grupos = computed(() => {
    try {
      const grps = this.data()?.grupos ?? [];
      if (grps.length === 0) return [];
      const maxIdx = Math.min(11, this.filterS.mesIdx() || 0);
      return grps.map((g) => ({
        ...g,
        filas: (g.filas || []).map((f) => ({
          ...f,
          montos: f.montos?.length ? f.montos.slice(0, maxIdx + 1) : [],
          montosMtto: f.montosMtto?.length
            ? f.montosMtto.slice(0, maxIdx + 1)
            : [],
          montosObrasMejoras: f.montosObrasMejoras?.length
            ? f.montosObrasMejoras.slice(0, maxIdx + 1)
            : [],
          montosFondoReserva: f.montosFondoReserva?.length
            ? f.montosFondoReserva.slice(0, maxIdx + 1)
            : [],
        })),
      }));
    } catch (e) {
      console.error("Error en grupos computed:", e);
      return [];
    }
  });

  constructor() {
    effect(() => {
      const custId = this.customerIdS.customerId();
      const yr = this.filterS.year();
      this.filterS.refreshTick();
      if (custId && yr) {
        this.loadData(custId, yr);
      }
    });
  }

  async loadData(customerId: string, year: number) {
    this.loading.set(true);
    this.data.set(null);
    const result = await this.apiS.onGetItem<IFlujoCajaDto>(
      Endpoints.ContabilidadOnline.FinancialStatements.cashFlow(
        customerId,
        year,
      ),
    );
    if (result) {
      this.data.set(result);
      this.filterS.currentReportName.set("Flujo de Efectivo");
      this.filterS.currentReportContext.set(JSON.stringify(result));
    }
    this.loading.set(false);
  }

  onManualInput(val: number, concepto: string, colIdx: number) {
    const currentData = this.data();
    if (!currentData) return;

    const newData = JSON.parse(JSON.stringify(currentData)) as IFlujoCajaDto;

    for (const grupo of newData.grupos) {
      for (const fila of grupo.filas) {
        if (fila.concepto === concepto) {
          fila.montos[colIdx] = val || 0;
        }
      }
    }

    this.recalcular(newData);
    this.data.set(newData);
  }

  private recalcular(data: IFlujoCajaDto) {
    const gContable = data.grupos.find((g: any) => g.nombre === "CONTABLE");
    const gAdmin = data.grupos.find((g: any) => g.nombre === "ADMINISTRACION");

    if (!gContable || !gAdmin) return;

    const getRow = (grupo: any, concepto: string) =>
      grupo.filas.find((f: any) => f.concepto === concepto);

    const rSaldoBancos = getRow(gContable, "SALDO INICIAL BANCOS");
    const rSaldoInversiones = getRow(gContable, "SALDO INICIAL INVERSIONES");
    const rSaldoFondoReserva = getRow(
      gContable,
      "SALDO INICIAL FONDO DE RESERVA",
    );
    const rCuotasMtto = getRow(gContable, "CUOTAS COBRADAS MANTTO");
    const rCuotasExtra = getRow(gContable, "CUOTAS COBRADAS EXTRA");
    const rOtrosIngresos = getRow(gContable, "OTROS INGRESOS");
    const rVentaFondos = getRow(gContable, "VENTA FONDOS INVERSION");
    const rInteresesMtto = getRow(gContable, "INTERESES MANTTO");
    const rInteresesExtra = getRow(gContable, "INTERESES EXTRA");
    const rTotalIngresos = getRow(gContable, "INGRESOS");

    const rPagoProveedores = getRow(gContable, "PAGOS A PROVEEDORES");
    const rPagoAcreedores = getRow(gContable, "PAGOS A ACREEDORES");
    const rPagoTarjeta = getRow(gContable, "PAGOS TARJETA CORPORATIVA");
    const rPagoSueldos = getRow(gContable, "PAGOS DE SUELDOS");
    const rPagoImpuestos = getRow(gContable, "PAGOS DE IMPUESTOS (MES ANT)");
    const rCompraFondos = getRow(gContable, "COMPRA FONDOS INVERSION");
    const rPagoComisiones = getRow(gContable, "PAGOS DE COMISIONES BANCARIAS");
    const rIsrInversiones = getRow(gContable, "ISR POR INVERSIONES");
    const rTotalGastos = getRow(gContable, "GASTOS");
    const rSaldoFinal = getRow(gContable, "SALDO BANCARIO FINAL");

    const rTotalCxp = getRow(gAdmin, "CUENTAS POR PAGAR");
    const rCxpProveedores = getRow(gAdmin, "CXP A PROVEEDORES");
    const rCxpSueldos = getRow(gAdmin, "CXP DE SUELDOS");
    const rCxpImpuestos = getRow(gAdmin, "CXP DE IMPUESTOS");
    const rDispCxp = getRow(gAdmin, "EFECTIVO DISPONIBLE DESPUES DE CXP");
    const rCxcCierre = getRow(gAdmin, "CUENTA POR COBRAR AL CIERRE");
    const rCobranzaJudicial = getRow(gAdmin, "COBRANZA JUDICIAL");
    const rCxcCortoPlazo = getRow(gAdmin, "CUENTA POR COBRAR A CORTO PLAZO");
    const rDispCxc = getRow(gAdmin, "EFECTIVO DISPONIBLE DESPUES DE CXC");

    for (let i = 0; i < 12; i++) {
      const totalIngresos =
        rSaldoBancos.montos[i] +
        rSaldoInversiones.montos[i] +
        rSaldoFondoReserva.montos[i] +
        rCuotasMtto.montos[i] +
        rCuotasExtra.montos[i] +
        rOtrosIngresos.montos[i] +
        rVentaFondos.montos[i] +
        rInteresesMtto.montos[i] +
        rInteresesExtra.montos[i];
      rTotalIngresos.montos[i] = totalIngresos;

      const totalGastos =
        rPagoProveedores.montos[i] +
        rPagoAcreedores.montos[i] +
        rPagoTarjeta.montos[i] +
        rPagoSueldos.montos[i] +
        rPagoImpuestos.montos[i] +
        rCompraFondos.montos[i] +
        rPagoComisiones.montos[i] +
        rIsrInversiones.montos[i];
      rTotalGastos.montos[i] = totalGastos;

      rSaldoFinal.montos[i] = totalIngresos - totalGastos;

      const totalCxp =
        rCxpProveedores.montos[i] +
        rCxpSueldos.montos[i] +
        rCxpImpuestos.montos[i];
      rTotalCxp.montos[i] = totalCxp;

      rDispCxp.montos[i] = rSaldoFinal.montos[i] - totalCxp;
      rCxcCortoPlazo.montos[i] =
        rCxcCierre.montos[i] - rCobranzaJudicial.montos[i];
      rDispCxc.montos[i] = rDispCxp.montos[i] + rCxcCortoPlazo.montos[i];
    }
  }
}
