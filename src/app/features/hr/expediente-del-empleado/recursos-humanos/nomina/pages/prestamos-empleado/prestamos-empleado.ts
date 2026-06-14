import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { PrestamoEmpleadoDTO } from "../../interfaces/prestamo-empleado.interface";
import ModalPrestamoAdd from "./modal-prestamo-add/modal-prestamo-add";
import ModalPrestamoDetalle from "./modal-prestamo-detalle/modal-prestamo-detalle";

@Component({
  selector: "app-prestamos-empleado",
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    CustomButton,
    CustomButtonDelete,
    DataViewMobile,
    PrimeNgCustomCaption,
  ],
  templateUrl: "./prestamos-empleado.html",
})
export default class PrestamosEmpleado {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private tableScrollHeightS = inject(TableScrollHeightService);

  loading = signal(true);
  data = signal<PrestamoEmpleadoDTO[]>([]);

  tablePrimeNgRows = tablePrimeNgRows();
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
      .onGetList<
        PrestamoEmpleadoDTO[]
      >(`hr/nomina/prestamos?customerId=${customerId}`)
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
      .onDelete(`hr/nomina/prestamos/${item.id}`)
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
