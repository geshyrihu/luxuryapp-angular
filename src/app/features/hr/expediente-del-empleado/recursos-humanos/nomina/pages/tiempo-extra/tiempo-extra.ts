import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { PeriodoNominaDTO } from "../../interfaces/periodo-nomina.interface";
import { TiempoExtraDTO } from "../../interfaces/tiempo-extra.interface";
import ModalTiempoExtraAdd from "./modal-tiempo-extra-add/modal-tiempo-extra-add";

@Component({
  selector: "app-tiempo-extra",
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
  templateUrl: "./tiempo-extra.html",
})
export default class TiempoExtra {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private tableScrollHeightS = inject(TableScrollHeightService);

  loading = signal(true);
  data = signal<TiempoExtraDTO[]>([]);
  periodos = signal<ISelectItem[]>([]);
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
    await this.apiResponseS.onPost(Endpoints.HR.Nomina.Periodos.autoCrear(customerId), {});
    const result = await this.apiResponseS.onGetList<PeriodoNominaDTO[]>(
      Endpoints.HR.Nomina.Periodos.byCustomerAndYear(customerId, anio),
    );
    const options: ISelectItem[] = ((result as any) ?? []).map((p: any) => ({
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
      .onGetList<
        TiempoExtraDTO[]
      >(Endpoints.HR.Nomina.TiempoExtra.list(periodoId))
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
