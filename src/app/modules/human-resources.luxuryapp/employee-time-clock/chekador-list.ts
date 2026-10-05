import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { globalFilterFields } from "@core/helpers/table-options";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ChekadorListDesktop } from "./desktop/chekador-list-desktop";
import { ChekadorListMobile } from "./mobile/chekador-list-mobile";
import { IRegistroChecador } from "./interfaces/chekador-empleados.models";
import { ChekadorEmpleadosService } from "./chekador-empleados.service";

@Component({
  selector: "app-chekador-list",
  templateUrl: "./chekador-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChekadorListDesktop, ChekadorListMobile],
})
export class ChekadorList {
  private readonly chekadorS = inject(ChekadorEmpleadosService);
  private readonly customerIdS = inject(CustomerIdService);
  readonly dialogS = inject(DialogHandlerService);
  readonly platformS = inject(PlatformService);

  dataSignal = signal<IRegistroChecador[]>([]);
  loading = signal(true);

  // Filtros
  filtroDesde = signal<string>("");
  filtroHasta = signal<string>("");
  filtroSoloAnomalias = signal<boolean>(false);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    this.loading.set(true);
    this.chekadorS
      .porTenant({
        desde: this.filtroDesde() || undefined,
        hasta: this.filtroHasta() || undefined,
        soloAnomalias: this.filtroSoloAnomalias() || undefined,
      })
      .then((result) => {
        if (result) this.dataSignal.set(result);
      })
      .finally(() => this.loading.set(false));
  }

  onAplicarFiltros() {
    this.onLoadData();
  }

  onLimpiarFiltros() {
    this.filtroDesde.set("");
    this.filtroHasta.set("");
    this.filtroSoloAnomalias.set(false);
    this.onLoadData();
  }

  onAprobar(registro: IRegistroChecador) {
    this.chekadorS
      .aprobarAnomalia(registro.id, { nota: null })
      .then((result) => {
        if (result) this.onLoadData();
      });
  }

  onRechazar(registro: IRegistroChecador) {
    this.chekadorS
      .rechazarAnomalia(registro.id, { nota: null })
      .then((result) => {
        if (result) this.onLoadData();
      });
  }
}
