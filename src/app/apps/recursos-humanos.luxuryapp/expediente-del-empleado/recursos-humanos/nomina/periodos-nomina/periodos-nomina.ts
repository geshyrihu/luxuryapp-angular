import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { PeriodoNominaDTO } from "../interfaces/periodo-nomina.interface";
import ModalDiasNoHabiles from "./modal-dias-no-habiles/modal-dias-no-habiles";
import ModalPeriodoAdd from "./modal-periodo-add/modal-periodo-add";

import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";

import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-periodos-nomina",
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIcon,
    WebButtonIconEdit,
    WebButtonIconDelete,
    LxTooltipDirective,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    LxTag,
    WebButtonLabel,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    DataViewMobile,
    PrimeNgCustomCaption,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./periodos-nomina.html",
})
export default class PeriodosNomina {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private tableScrollHeightS = inject(TableScrollHeightService);

  loading = signal(true);
  data = signal<PeriodoNominaDTO[]>([]);
  anioFiltro = signal<number>(new Date().getFullYear());

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  globalFilterFields = computed(() => {
    if (!this.data().length) return [];
    return ["quincenaDisplay", "mes", "anio", "estado"];
  });

  readonly aniosDisponibles = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 1 + i,
  );

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      const anio = this.anioFiltro();
      if (customerId) this.onLoadData(customerId, anio);
    });
  }

  async onLoadData(customerId: string, anio: number): Promise<void> {
    this.loading.set(true);
    await this.apiResponseS.onPost(
      Endpoints.HR.Nomina.Periodos.autoCrear(customerId),
      {},
    );
    const resp = await this.apiResponseS.onGetList<PeriodoNominaDTO[]>(
      Endpoints.HR.Nomina.Periodos.byCustomerAndYear(customerId, anio),
    );
    this.data.set((resp as any) ?? []);
    this.loading.set(false);
  }

  cambiarAnio(anio: number): void {
    this.anioFiltro.set(anio);
  }

  openAdd(): void {
    this.dialogHandlerS
      .openDialog(
        ModalPeriodoAdd,
        {},
        "Nuevo Periodo de Nomina",
        this.dialogHandlerS.sizeMd,
      )
      .then((result) => {
        if (result)
          this.onLoadData(this.customerIdS.customerId(), this.anioFiltro());
      });
  }

  openEdit(item: PeriodoNominaDTO): void {
    this.dialogHandlerS
      .openDialog(
        ModalPeriodoAdd,
        { item },
        "Editar Periodo",
        this.dialogHandlerS.sizeMd,
      )
      .then((result) => {
        if (result)
          this.onLoadData(this.customerIdS.customerId(), this.anioFiltro());
      });
  }

  openDiasNoHabiles(item: PeriodoNominaDTO): void {
    this.dialogHandlerS
      .openDialog(
        ModalDiasNoHabiles,
        { periodoId: item.id },
        `Dias No Habiles - ${item.quincenaDisplay}`,
        this.dialogHandlerS.sizeLg,
      )
      .then(() => {});
  }

  onDelete(item: PeriodoNominaDTO): void {
    this.apiResponseS
      .onDelete(Endpoints.HR.Nomina.Periodos.delete(item.id))
      .then((result) => {
        if (result)
          this.onLoadData(this.customerIdS.customerId(), this.anioFiltro());
      });
  }

  getEstadoSeverity(estado: string): string {
    const map: Record<string, string> = {
      Abierto: "success",
      EnProceso: "info",
      Cerrado: "secondary",
    };
    return map[estado] ?? "secondary";
  }
}
