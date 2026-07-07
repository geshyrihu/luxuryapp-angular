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
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ROUTES } from "src/app/routing/route-paths";
import { NominaEncabezadoDTO } from "../../interfaces/nomina-encabezado.interface";
import ModalGenerarNomina from "./modal-generar-nomina/modal-generar-nomina";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-nominas",
  imports: [
    WebButtonIcon,
    TooltipModule,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    TagModule,
    DataViewMobile,
    PrimeNgCustomCaption,
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

  tablePrimeNgRows = tablePrimeNgRows();
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
      .onGetList<
        NominaEncabezadoDTO[]
      >(Endpoints.HR.Nomina.Encabezado.getAll(customerId))
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
