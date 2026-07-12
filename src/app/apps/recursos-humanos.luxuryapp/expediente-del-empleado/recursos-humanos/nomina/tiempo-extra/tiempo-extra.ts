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
import { PeriodoNominaDTO } from '../interfaces/periodo-nomina.interface';
import { TiempoExtraDTO } from '../interfaces/tiempo-extra.interface';
import ModalTiempoExtraAdd from "./modal-tiempo-extra-add/modal-tiempo-extra-add";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";

import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-tiempo-extra",
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
  templateUrl: "./tiempo-extra.html",
})
export default class TiempoExtra {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private tableScrollHeightS = inject(TableScrollHeightService);

  loading = signal(true);
  data = signal<TiempoExtraDTO[]>([]);
  periodos = signal<SelectItemDto[]>([]);
  periodoSeleccionado = signal<string>("");

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  globalFilterFields = computed(() => {
    if (!this.data().length) return [];
    return ["nombreEmpleado", "fecha"];
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
      .onGetList<TiempoExtraDTO[]>(
        Endpoints.HR.Nomina.TiempoExtra.list(periodoId),
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
        ModalTiempoExtraAdd,
        { periodoNominaId: this.periodoSeleccionado() },
        "Registrar Tiempo Extra",
        this.dialogHandlerS.sizeMd,
      )
      .then((result) => {
        if (result) this.onLoadData(this.periodoSeleccionado());
      });
  }

  openEdit(item: TiempoExtraDTO): void {
    this.dialogHandlerS
      .openDialog(
        ModalTiempoExtraAdd,
        { item },
        "Editar Tiempo Extra",
        this.dialogHandlerS.sizeMd,
      )
      .then((result) => {
        if (result) this.onLoadData(this.periodoSeleccionado());
      });
  }

  async aprobar(item: TiempoExtraDTO): Promise<void> {
    const result = await this.apiResponseS.onPut(
      Endpoints.HR.Nomina.TiempoExtra.approve(item.id),
      {},
    );
    if (result) this.onLoadData(this.periodoSeleccionado());
  }

  onDelete(item: TiempoExtraDTO): void {
    this.apiResponseS
      .onDelete(Endpoints.HR.Nomina.TiempoExtra.delete(item.id))
      .then((result) => {
        if (result) this.onLoadData(this.periodoSeleccionado());
      });
  }
}
