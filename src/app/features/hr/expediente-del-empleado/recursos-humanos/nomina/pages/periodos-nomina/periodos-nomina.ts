import { EmptyState } from "src/app/core/components/empty-state/empty-state";
import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { TagModule } from "primeng/tag";
import { TableModule } from "primeng/table";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { PeriodoNominaDTO } from "../../interfaces/periodo-nomina.interface";
import ModalPeriodoAdd from "./modal-periodo-add/modal-periodo-add";
import ModalDiasNoHabiles from "./modal-dias-no-habiles/modal-dias-no-habiles";

@Component({
  selector: "app-periodos-nomina",
  imports: [
    EmptyState,
    CommonModule,
    TableModule,
    TagModule,
    CustomButton,
    CustomButtonEdit,
    CustomButtonDelete,
    DataViewMobile,
    PrimeNgCustomCaption,
  ],
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
    await this.apiResponseS.onPost(Endpoints.HR.Nomina.Periodos.autoCrear(customerId), {});
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
      .openDialog(ModalPeriodoAdd, {}, "Nuevo Periodo de Nomina", this.dialogHandlerS.sizeMd)
      .then((result) => {
        if (result) this.onLoadData(this.customerIdS.customerId(), this.anioFiltro());
      });
  }

  openEdit(item: PeriodoNominaDTO): void {
    this.dialogHandlerS
      .openDialog(ModalPeriodoAdd, { item }, "Editar Periodo", this.dialogHandlerS.sizeMd)
      .then((result) => {
        if (result) this.onLoadData(this.customerIdS.customerId(), this.anioFiltro());
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
        if (result) this.onLoadData(this.customerIdS.customerId(), this.anioFiltro());
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
