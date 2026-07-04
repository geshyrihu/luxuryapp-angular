import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { Popover } from "primeng/popover";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import {
  CeldaGuardarDTO,
  CeldaHojaDTO,
  EmpleadoHojaDTO,
  GuardarHojaIncidenciasDTO,
  HojaIncidenciasDTO,
  STATUS_CONFIG,
  STATUS_ORDEN_CICLO,
  StatusHoja,
} from "../../interfaces/hoja-incidencias.interface";
import { PeriodoNominaDTO } from "../../interfaces/periodo-nomina.interface";

@Component({
  selector: "app-hoja-incidencias",
  imports: [CommonModule, TagModule, TooltipModule, Popover, WebButtonLabel],
  templateUrl: "./hoja-incidencias.html",
})
export default class HojaIncidencias {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  readonly statusConfig = STATUS_CONFIG;
  readonly statusOrden = STATUS_ORDEN_CICLO;

  loading = signal(false);
  guardando = signal(false);
  hoja = signal<HojaIncidenciasDTO | null>(null);
  periodos = signal<ISelectItem[]>([]);
  periodoSeleccionado = signal<string>("");
  anioFiltro = signal<number>(new Date().getFullYear());

  readonly aniosDisponibles = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 1 + i,
  );

  // Local mutable copy of cells: employeeId+fecha ? status
  celdas = signal<Map<string, CeldaHojaDTO>>(new Map());

  // Track which cells changed (employeeId+fecha key)
  cambios = signal<Set<string>>(new Set());

  hayCambios = computed(() => this.cambios().size > 0);

  totalFaltas = computed(() => {
    let n = 0;
    this.celdas().forEach((c) => {
      if (c.status === "F") n++;
    });
    return n;
  });

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      const anio = this.anioFiltro();
      if (customerId) this.loadPeriodos(customerId, anio);
    });
  }

  cambiarAnio(anio: number): void {
    this.hoja.set(null);
    this.periodos.set([]);
    this.anioFiltro.set(anio);
  }

  async loadPeriodos(customerId: string, anio: number): Promise<void> {
    this.loading.set(true);
    await this.apiResponseS.onPost(
      Endpoints.HR.Nomina.Periodos.autoCrear(customerId),
      {},
    );
    const result = await this.apiResponseS.onGetList<PeriodoNominaDTO[]>(
      Endpoints.HR.Nomina.Periodos.byCustomerAndYear(customerId, anio),
    );
    const options: ISelectItem[] = ((result as any) ?? []).map((p: any) => ({
      label: p.quincenaDisplay,
      value: p.id,
    }));
    this.periodos.set(options);
    if (options.length) {
      this.periodoSeleccionado.set(options[0].value);
      this.loadHoja(options[0].value);
    } else {
      this.loading.set(false);
    }
  }

  async loadHoja(periodoId: string): Promise<void> {
    this.loading.set(true);
    this.cambios.set(new Set());
    const result = await this.apiResponseS.onGetItem<HojaIncidenciasDTO>(
      Endpoints.HR.Nomina.Incidencias.hojaByPeriodo(periodoId),
    );
    if (result) {
      this.hoja.set(result);
      const map = new Map<string, CeldaHojaDTO>();
      for (const emp of result.empleados) {
        for (const celda of emp.celdas) {
          map.set(this.key(emp.employeeId, celda.fecha), { ...celda });
        }
      }
      this.celdas.set(map);
    }
    this.loading.set(false);
  }

  cambiarPeriodo(periodoId: string): void {
    this.periodoSeleccionado.set(periodoId);
    this.loadHoja(periodoId);
  }

  getStatus(employeeId: string, fecha: string): StatusHoja {
    return this.celdas().get(this.key(employeeId, fecha))?.status ?? "A";
  }

  isSyncronizada(employeeId: string, fecha: string): boolean {
    return (
      this.celdas().get(this.key(employeeId, fecha))?.esSincronizada ?? false
    );
  }

  ciclarStatus(employeeId: string, fecha: string): void {
    const k = this.key(employeeId, fecha);
    const celda = this.celdas().get(k);
    if (!celda || celda.esSincronizada) return;

    const current = celda.status;
    const idx = this.statusOrden.indexOf(current);
    const next = this.statusOrden[(idx + 1) % this.statusOrden.length];

    const newMap = new Map(this.celdas());
    newMap.set(k, { ...celda, status: next });
    this.celdas.set(newMap);

    const newCambios = new Set(this.cambios());
    newCambios.add(k);
    this.cambios.set(newCambios);
  }

  setStatus(employeeId: string, fecha: string, status: StatusHoja): void {
    const k = this.key(employeeId, fecha);
    const celda = this.celdas().get(k);
    if (!celda || celda.esSincronizada) return;

    const newMap = new Map(this.celdas());
    newMap.set(k, { ...celda, status });
    this.celdas.set(newMap);

    const newCambios = new Set(this.cambios());
    newCambios.add(k);
    this.cambios.set(newCambios);
  }

  getDiasAPagar(emp: EmpleadoHojaDTO): number {
    let n = 0;
    for (const celda of emp.celdas) {
      const s = this.getStatus(emp.employeeId, celda.fecha);
      if (s === "A" || s === "PD" || s === "DF") n++;
    }
    return n;
  }

  getCountOf(emp: EmpleadoHojaDTO, status: StatusHoja): number {
    let n = 0;
    for (const celda of emp.celdas) {
      if (this.getStatus(emp.employeeId, celda.fecha) === status) n++;
    }
    return n;
  }

  async guardar(): Promise<void> {
    const hoja = this.hoja();
    if (!hoja) return;
    this.guardando.set(true);

    const celdas: CeldaGuardarDTO[] = [];
    for (const emp of hoja.empleados) {
      for (const celda of emp.celdas) {
        const status = this.getStatus(emp.employeeId, celda.fecha);
        celdas.push({
          employeeId: emp.employeeId,
          fecha: celda.fecha,
          status,
          minutosRetardo: celda.minutosRetardo,
        });
      }
    }

    const dto: GuardarHojaIncidenciasDTO = {
      periodoNominaId: hoja.periodoNominaId,
      celdas,
    };

    const result = await this.apiResponseS.onPut(
      Endpoints.HR.Nomina.Incidencias.hoja,
      dto,
    );
    this.guardando.set(false);
    if (result) {
      this.cambios.set(new Set());
      await this.loadHoja(this.periodoSeleccionado());
    }
  }

  private key(employeeId: string, fecha: string): string {
    return `${employeeId}|${fecha.substring(0, 10)}`;
  }
}
