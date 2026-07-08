import {
  Component,
  computed,
  effect,
  inject,
  signal,
  ChangeDetectionStrategy
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { LxImage } from "@ui/adaptive/image/image";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { IonInputCheckbox } from "@ui/inputs/mobile/ion-input-checkbox";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  tablePrimeNgRows,
  rowsPerPageOptions,
} from "src/app/core/helpers/table-primeng-option";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { IRegistroChecador } from "../models/chekador-empleados.models";
import { ChekadorEmpleadosService } from "../services/chekador-empleados.service";

import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { LxTag } from "@ui/adaptive/tag/tag";
@Component({
  selector: "app-chekador-list",
  templateUrl: "./chekador-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    LxTag,
    WebButtonLabel,
    WebButtonIcon,
    LxImage,
    TooltipModule,
    CustomInputCheckSignal,
    IonInputCheckbox,
    FormsModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
  ],
})
export class ChekadorList {
  private readonly chekadorS = inject(ChekadorEmpleadosService);
  private readonly customerIdS = inject(CustomerIdService);
  readonly dialogS = inject(DialogHandlerService);

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

  readonly rows = tablePrimeNgRows();
  readonly rowsPerPage = rowsPerPageOptions();

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

  getBadgeSeverity(estadoAnomalia: string | null): "success" | "danger" | "warn" | "secondary" {
    if (!estadoAnomalia) return "secondary";
    if (estadoAnomalia === "Aprobada") return "success";
    if (estadoAnomalia === "Rechazada") return "danger";
    return "warn";
  }
}
