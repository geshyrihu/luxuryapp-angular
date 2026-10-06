import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { LxIcon } from '@ui/adaptive/icon/icon';
import { NominaDetalleDTO } from "../interfaces/nomina-detalle.interface";
import {
  NominaEncabezadoDTO,
  NominaResumenDTO,
} from "../interfaces/nomina-encabezado.interface";
import { NominaDetalleDesktop } from "./desktop/nomina-detalle-desktop";
import ModalEditarEmpleadoNomina from "./edit-payroll-employee-modal/modal-editar-empleado-nomina";
import { NominaDetalleMobile } from "./mobile/nomina-detalle-mobile";

@Component({
  selector: "app-nomina-detalle",
  imports: [CommonModule, LxIcon, NominaDetalleDesktop, NominaDetalleMobile],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./nomina-detalle.html",
})
export default class NominaDetalle {
  private apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);
  private route = inject(ActivatedRoute);

  platformS = inject(PlatformService);

  nominaId = signal<string>("");
  encabezado = signal<NominaEncabezadoDTO | null>(null);
  resumen = signal<NominaResumenDTO | null>(null);
  loading = signal(true);
  data = signal<NominaDetalleDTO[]>([]);

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
      this.apiResponseS.onGetItem<NominaEncabezadoDTO>(
        Endpoints.HR.Nomina.Encabezado.getById(nominaId),
      ),
      this.apiResponseS.onGetList<NominaDetalleDTO[]>(
        Endpoints.HR.Nomina.Encabezado.getDetalles(nominaId),
      ),
      this.apiResponseS.onGetItem<NominaResumenDTO>(
        Endpoints.HR.Nomina.Encabezado.getResumenEjecutivo(nominaId),
      ),
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
        this.dialogHandlerS.sizeXl,
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
