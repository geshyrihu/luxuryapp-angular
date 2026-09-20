import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { TableCaption } from "@ui/web/table-caption/table-caption";
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
import { ROUTES } from "src/app/routing/route-paths";
import { NominaEncabezadoDTO } from "../interfaces/nomina-encabezado.interface";
import ModalGenerarNomina from "./generate-payroll-modal/modal-generar-nomina";

import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

@Component({
  selector: "app-nominas",
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIcon,
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
  templateUrl: "./nominas.html",
})
export default class Nominas {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private tableScrollHeightS = inject(TableScrollHeightService);
  private router = inject(Router);

  loading = signal(true);
  data = signal<NominaEncabezadoDTO[]>([]);

  tableRows = tableRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  globalFilterFields = computed(() => {
    if (!this.data().length) return [];
    return ["periodoDescripcion", "estado", "nombreCliente"];
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
      .onGetList<NominaEncabezadoDTO[]>(
        Endpoints.HR.Nomina.Encabezado.getAll(customerId),
      )
      .then((resp: any) => {
        this.data.set(resp ?? []);
        this.loading.set(false);
      });
  }

  openGenerar(): void {
    this.dialogHandlerS
      .openDialog(
        ModalGenerarNomina,
        {},
        "Generar Nueva Nomina",
        this.dialogHandlerS.sizeMd,
      )
      .then((result) => {
        if (result) this.onLoadData(this.customerIdS.customerId());
      });
  }

  verDetalle(item: NominaEncabezadoDTO): void {
    this.router.navigate(
      ROUTES.RECURSOS_HUMANOS.NOMINA.NOMINA_DETALLE(item.id),
    );
  }

  async cambiarEstado(
    item: NominaEncabezadoDTO,
    accion: string,
  ): Promise<void> {
    const result = await this.apiResponseS.onPut(
      Endpoints.HR.Nomina.Encabezado.changeState(item.id, accion),
      {},
    );
    if (result) this.onLoadData(this.customerIdS.customerId());
  }

  getEstadoSeverity(estadoValue: number): string {
    const map: Record<number, string> = {
      0: "secondary", // Borrador
      1: "info", // EnRevision
      2: "success", // Aprobada
      3: "contrast", // Pagada
      4: "secondary", // Cerrada
    };
    return map[estadoValue] ?? "secondary";
  }

  puedeEnviar(estadoValue: number): boolean {
    return estadoValue === 0;
  }
  puedeAprobar(estadoValue: number): boolean {
    return estadoValue === 1;
  }
  puedePagar(estadoValue: number): boolean {
    return estadoValue === 2;
  }
  puedeCerrar(estadoValue: number): boolean {
    return estadoValue === 3;
  }
}

