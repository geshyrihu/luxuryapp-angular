import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  ChangeDetectionStrategy
} from "@angular/core";
import { TableModule } from "primeng/table";
import type {
  IBaseAccountDto,
  IFinancialStatementDto,
} from "../../contabilidad-online/interfaces/aspel-budget.interface";
import { ContabilidadClienteService } from "../contabilidad-cliente.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

const MONTH_NAMES = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
];

const MONTO_KEYS: (keyof IBaseAccountDto)[] = [
  "montoEnero",
  "montoFebrero",
  "montoMarzo",
  "montoAbril",
  "montoMayo",
  "montoJunio",
  "montoJulio",
  "montoAgosto",
  "montoSeptiembre",
  "montoOctubre",
  "montoNoviembre",
  "montoDiciembre",
];

const PRESUP_KEYS: (keyof IBaseAccountDto)[] = [
  "presupEnero",
  "presupFebrero",
  "presupMarzo",
  "presupAbril",
  "presupMayo",
  "presupJunio",
  "presupJulio",
  "presupAgosto",
  "presupSeptiembre",
  "presupOctubre",
  "presupNoviembre",
  "presupDiciembre",
];

const GASTOS_GENERALES = [
  "600-",
  "601-",
  "602-",
  "603-",
  "604-",
  "607-",
  "608-",
  "609-",
];
const GASTOS_EXTRA = ["605-"];

@Component({
  selector: "app-cedula-presupuestal-cliente",
  imports: [
    AppIcon,CommonModule, TableModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./cedula-presupuestal-cliente.html",
})
export class CedulaPresupuestalClienteComponent {
  private readonly svc = inject(ContabilidadClienteService);

  readonly customerId = input.required<string>();
  readonly year = input.required<number>();
  readonly mes = input.required<number>();

  readonly loading = signal(false);
  readonly data = signal<IFinancialStatementDto | null>(null);

  readonly mesIdx = computed(() => this.mes() - 1);

  readonly monthHeaders = computed(() => {
    const idx = this.mesIdx();
    const wr = (i: number) => ((i % 12) + 12) % 12;
    return [
      MONTH_NAMES[wr(idx - 2)],
      MONTH_NAMES[wr(idx - 1)],
      MONTH_NAMES[wr(idx)],
    ];
  });

  readonly rows = computed(() => {
    const d = this.data();
    const idx = this.mesIdx();
    if (!d) return [];

    const wr = (i: number) => ((i % 12) + 12) % 12;
    const getMonto = (c: IBaseAccountDto, i: number) =>
      (c[MONTO_KEYS[i]] as number) ?? 0;
    const getPresup = (c: IBaseAccountDto, i: number) =>
      (c[PRESUP_KEYS[i]] as number) ?? 0;
    const getPresupAnual = (c: IBaseAccountDto) =>
      PRESUP_KEYS.reduce((s, k) => s + ((c[k] as number) ?? 0), 0);

    const result: any[] = [];
    const todas = d.clasificaciones.flatMap((c) => c.cuentasMayor ?? []);
    const generales = todas.filter(
      (c) =>
        GASTOS_GENERALES.some((p) => c.numeroCuenta.startsWith(p)) &&
        c.numeroCuenta !== "600-000-000",
    );
    const extra = todas.filter((c) =>
      GASTOS_EXTRA.some((p) => c.numeroCuenta.startsWith(p)),
    );

    let gran = {
      presupMes: 0,
      oct: 0,
      nov: 0,
      mes: 0,
      acum: 0,
      presupAnual: 0,
    };

    result.push({ tipo: "header", descripcion: "GASTOS GENERALES" });

    for (const cuenta of generales) {
      const presupMes = getPresup(cuenta, idx);
      const oct = getMonto(cuenta, wr(idx - 2));
      const nov = getMonto(cuenta, wr(idx - 1));
      const mes = getMonto(cuenta, idx);
      const acum = cuenta.acumuladoAnual;
      const presupAnual = getPresupAnual(cuenta);

      gran.presupMes += presupMes;
      gran.oct += oct;
      gran.nov += nov;
      gran.mes += mes;
      gran.acum += acum;
      gran.presupAnual += presupAnual;

      result.push({
        tipo: "item",
        descripcion: cuenta.descripcion,
        presupMes,
        oct,
        nov,
        mes,
        acum,
        presupAnual,
        restante: presupAnual - acum,
      });
    }

    result.push({
      tipo: "gran-total",
      descripcion: "GRAN TOTAL GASTOS GENERALES",
      ...gran,
      restante: gran.presupAnual - gran.acum,
    });

    const extraLabels: Record<string, string> = {
      "605-": "EXTRAORDINARIOS",
    };

    for (const prefix of GASTOS_EXTRA) {
      const bloque = extra.filter((c) => c.numeroCuenta.startsWith(prefix));
      if (!bloque.length) continue;

      result.push({
        tipo: "header",
        descripcion: extraLabels[prefix] ?? prefix,
      });
      let tot = {
        presupMes: 0,
        oct: 0,
        nov: 0,
        mes: 0,
        acum: 0,
        presupAnual: 0,
      };

      for (const cuenta of bloque) {
        const presupMes = getPresup(cuenta, idx);
        const oct = getMonto(cuenta, wr(idx - 2));
        const nov = getMonto(cuenta, wr(idx - 1));
        const mes = getMonto(cuenta, idx);
        const acum = cuenta.acumuladoAnual;
        const presupAnual = getPresupAnual(cuenta);

        tot.presupMes += presupMes;
        tot.oct += oct;
        tot.nov += nov;
        tot.mes += mes;
        tot.acum += acum;
        tot.presupAnual += presupAnual;

        result.push({
          tipo: "item",
          descripcion: cuenta.descripcion,
          presupMes,
          oct,
          nov,
          mes,
          acum,
          presupAnual,
          restante: presupAnual - acum,
        });
      }

      result.push({
        tipo: "total-extra",
        descripcion: `TOTAL ${extraLabels[prefix] ?? prefix}`,
        ...tot,
        restante: tot.presupAnual - tot.acum,
      });
    }

    return result;
  });

  constructor() {
    effect(() => {
      const cid = this.customerId();
      const yr = this.year();
      const m = this.mes();
      if (cid && yr && m) void this.loadData(cid, yr, m);
    });
  }

  private async loadData(customerId: string, year: number, mes: number) {
    this.loading.set(true);
    const result = await this.svc.getCedulaPresupuestal(customerId, year, mes);
    this.data.set(result ?? null);
    this.loading.set(false);
  }

  fmt(v: number): string {
    if (v === 0) return "-";
    const f = new Intl.NumberFormat("es-MX", {
      maximumFractionDigits: 0,
    }).format(Math.abs(v));
    return v < 0 ? `(${f})` : f;
  }

  isNeg(v: number): boolean {
    return v < 0;
  }
}
