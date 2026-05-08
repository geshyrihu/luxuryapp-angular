import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { NominaDetalleDTO } from "../../interfaces/nomina-detalle.interface";
import { NominaEncabezadoDTO, NominaResumenDTO } from "../../interfaces/nomina-encabezado.interface";
import ModalEditarEmpleadoNomina from "./modal-editar-empleado-nomina/modal-editar-empleado-nomina";

@Component({
  selector: "app-nomina-detalle",
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    CustomButton,
    CustomButtonEdit,
    DataViewMobile,
    PrimeNgCustomCaption,
  ],
  templateUrl: "./nomina-detalle.html",
})
export default class NominaDetalle {
  private apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);
  private tableScrollHeightS = inject(TableScrollHeightService);
  private route = inject(ActivatedRoute);

  nominaId = signal<string>("");
  encabezado = signal<NominaEncabezadoDTO | null>(null);
  resumen = signal<NominaResumenDTO | null>(null);
  loading = signal(true);
  data = signal<NominaDetalleDTO[]>([]);

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  globalFilterFields = computed(() => {
    if (!this.data().length) return [];
    return ["nombreCompleto", "puesto", "departamento", "numeroEmpleado"];
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get("id") ?? "";
    this.nominaId.set(id);
    this.onLoadData(id);
  }

  async onLoadData(nominaId: string): Promise<void> {
    this.loading.set(true);
    const [enc, det, res] = await Promise.all([
      this.apiResponseS.onGetItem<NominaEncabezadoDTO>(`hr/nomina/${nominaId}`),
      this.apiResponseS.onGetList<NominaDetalleDTO[]>(`hr/nomina/${nominaId}/detalles`),
      this.apiResponseS.onGetItem<NominaResumenDTO>(`hr/nomina/${nominaId}/resumen-ejecutivo`),
    ]);
    this.encabezado.set(enc ?? null);
    this.data.set(det ?? []);
    this.resumen.set(res ?? null);
    this.loading.set(false);
  }

  openEditar(item: NominaDetalleDTO): void {
    this.dialogHandlerS
      .openDialog(
        ModalEditarEmpleadoNomina,
        { item, nominaId: this.nominaId() },
        `Editar - ${item.nombreCompleto}`,
        this.dialogHandlerS.sizeLg,
      )
      .then((result) => {
        if (result) this.onLoadData(this.nominaId());
      });
  }

  descargarRecibo(item: NominaDetalleDTO): void {
    const url = `hr/nomina/${this.nominaId()}/detalles/${item.id}/recibo`;
    window.open(`/api/${url}`, "_blank");
  }

  descargarExcel(): void {
    window.open(`/api/hr/nomina/${this.nominaId()}/exportar-excel`, "_blank");
  }
}
