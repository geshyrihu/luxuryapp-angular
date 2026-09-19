import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { PrestamoEmpleadoDTO } from "../interfaces/prestamo-empleado.interface";
import ModalPrestamoAdd from "./modal-prestamo-add/modal-prestamo-add";
import ModalPrestamoDetalle from "./modal-prestamo-detalle/modal-prestamo-detalle";

import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";

import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

@Component({
  selector: "app-prestamos-empleado",
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIcon,
    WebButtonIconDelete,
    LxTooltipDirective,
    TableEmptyMessage,
    CommonModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LxTag,

    DataViewMobile,
    TableCaption,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./prestamos-empleado.html",
})
export default class PrestamosEmpleado {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private tableScrollHeightS = inject(TableScrollHeightService);

  loading = signal(true);
  data = signal<PrestamoEmpleadoDTO[]>([]);

  tableRows = tableRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  globalFilterFields = computed(() => {
    if (!this.data().length) return [];
    return ["nombreEmpleado", "estado", "motivo"];
  });

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.onLoadData(customerId);
    });
  }

  onLoadData(customerId: string): void {
    this.loading.set(true);
    this.apiResponseS
      .onGetList<PrestamoEmpleadoDTO[]>(
        Endpoints.HR.Nomina.Prestamos.list(customerId),
      )
      .then((resp: any) => {
        this.data.set(resp ?? []);
        this.loading.set(false);
      });
  }

  openAdd(): void {
    this.dialogHandlerS
      .openDialog(
        ModalPrestamoAdd,
        {},
        "Nuevo Prestamo a Empleado",
        this.dialogHandlerS.sizeMd,
      )
      .then((result) => {
        if (result) this.onLoadData(this.customerIdS.customerId());
      });
  }

  openDetalle(item: PrestamoEmpleadoDTO): void {
    this.dialogHandlerS
      .openDialog(
        ModalPrestamoDetalle,
        { item },
        `Prestamo - ${item.nombreEmpleado}`,
        this.dialogHandlerS.sizeLg,
      )
      .then((result) => {
        if (result) this.onLoadData(this.customerIdS.customerId());
      });
  }

  onDelete(item: PrestamoEmpleadoDTO): void {
    this.apiResponseS
      .onDelete(Endpoints.HR.Nomina.Prestamos.delete(item.id))
      .then((result) => {
        if (result) this.onLoadData(this.customerIdS.customerId());
      });
  }

  getEstadoSeverity(estado: string): string {
    const map: Record<string, string> = {
      Pendiente: "warn",
      Autorizado: "success",
      Cancelado: "danger",
      Liquidado: "secondary",
    };
    return map[estado] ?? "secondary";
  }

  getProgreso(item: PrestamoEmpleadoDTO): number {
    if (item.numeroPagos === 0) return 0;
    return Math.round((item.pagosRealizados / item.numeroPagos) * 100);
  }
}

