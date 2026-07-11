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
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "primeng/table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import {
  IncidenciaNominaDTO,
  SincronizarIncidenciasDTO,
} from "../../interfaces/incidencia-nomina.interface";
import { PeriodoNominaDTO } from "../../interfaces/periodo-nomina.interface";
import ModalIncidenciaAdd from "./modal-incidencia-add/modal-incidencia-add";

import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-incidencias-nomina",
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIconDelete,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    LxTag,
    WebButtonLabel,
    WebButtonLabelDelete,
    DataViewMobile,
    PrimeNgCustomCaption,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./incidencias-nomina.html",
})
export default class IncidenciasNomina {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private tableScrollHeightS = inject(TableScrollHeightService);

  loading = signal(true);
  sincronizando = signal(false);
  data = signal<IncidenciaNominaDTO[]>([]);
  periodos = signal<SelectItemDto[]>([]);
  periodoSeleccionado = signal<string>("");

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  globalFilterFields = computed(() => {
    if (!this.data().length) return [];
    return ["nombreEmpleado", "tipoIncidenciaDisplay", "fecha"];
  });

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.loadPeriodos(customerId);
    });
  }

  async loadPeriodos(customerId: string): Promise<void> {
    const anio = new Date().getFullYear();
    await this.apiResponseS.onPost(
      Endpoints.HR.Nomina.Periodos.autoCrear(customerId),
      {},
    );
    const result = await this.apiResponseS.onGetList<PeriodoNominaDTO[]>(
      Endpoints.HR.Nomina.Periodos.byCustomerAndYear(customerId, anio),
    );
    const options: SelectItemDto[] = ((result as any) ?? []).map((p: any) => ({
      label: p.quincenaDisplay,
      value: p.id,
    }));
    this.periodos.set(options);
    if (options.length) {
      this.periodoSeleccionado.set(options[0].value);
      this.onLoadData(options[0].value);
    } else {
      this.loading.set(false);
    }
  }

  onLoadData(periodoId: string): void {
    this.loading.set(true);
    this.apiResponseS
      .onGetList<IncidenciaNominaDTO[]>(
        Endpoints.HR.Nomina.Incidencias.list(periodoId),
      )
      .then((resp: any) => {
        this.data.set(resp ?? []);
        this.loading.set(false);
      });
  }

  cambiarPeriodo(periodoId: string): void {
    this.periodoSeleccionado.set(periodoId);
    this.onLoadData(periodoId);
  }

  openAdd(): void {
    this.dialogHandlerS
      .openDialog(
        ModalIncidenciaAdd,
        { periodoNominaId: this.periodoSeleccionado() },
        "Nueva Incidencia",
        this.dialogHandlerS.sizeMd,
      )
      .then((result) => {
        if (result) this.onLoadData(this.periodoSeleccionado());
      });
  }

  onDelete(item: IncidenciaNominaDTO): void {
    this.apiResponseS
      .onDelete(Endpoints.HR.Nomina.Incidencias.delete(item.id))
      .then((result) => {
        if (result) this.onLoadData(this.periodoSeleccionado());
      });
  }

  async sincronizarVacaciones(): Promise<void> {
    const customerId = this.customerIdS.customerId();
    const periodoId = this.periodoSeleccionado();
    if (!periodoId) return;
    const dto: SincronizarIncidenciasDTO = {
      periodoNominaId: periodoId,
      customerId,
    };
    this.sincronizando.set(true);
    await this.apiResponseS.onPost(
      Endpoints.HR.Nomina.Incidencias.syncVacaciones,
      dto,
    );
    this.sincronizando.set(false);
    this.onLoadData(periodoId);
  }

  async sincronizarPermisos(): Promise<void> {
    const customerId = this.customerIdS.customerId();
    const periodoId = this.periodoSeleccionado();
    if (!periodoId) return;
    const dto: SincronizarIncidenciasDTO = {
      periodoNominaId: periodoId,
      customerId,
    };
    this.sincronizando.set(true);
    await this.apiResponseS.onPost(
      Endpoints.HR.Nomina.Incidencias.syncPermisos,
      dto,
    );
    this.sincronizando.set(false);
    this.onLoadData(periodoId);
  }

  getTipoSeverity(tipo: number): string {
    const map: Record<number, string> = {
      0: "danger", // Falta
      1: "warn", // Retardo Menor
      2: "warn", // Retardo Mayor
      3: "info", // Incapacidad
      4: "success", // Vacacion
      5: "secondary", // Permiso c/Goce
      6: "contrast", // Permiso s/Goce
      7: "secondary", // Dia Economico
      8: "danger", // Otro Descuento
    };
    return map[tipo] ?? "secondary";
  }
}
