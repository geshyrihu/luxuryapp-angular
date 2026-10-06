import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import {
  IncidenciaNominaDTO,
  SincronizarIncidenciasDTO,
} from "../interfaces/incidencia-nomina.interface";
import { PeriodoNominaDTO } from "../interfaces/periodo-nomina.interface";
import ModalIncidenciaAdd from "./add-incident-modal/modal-incidencia-add";
import { IncidenciasNominaDesktop } from "./desktop/incidencias-nomina-desktop";
import { IncidenciasNominaMobile } from "./mobile/incidencias-nomina-mobile";

@Component({
  selector: "app-incidencias-nomina",
  imports: [
    IncidenciasNominaDesktop,
    IncidenciasNominaMobile],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./incidencias-nomina.html",
})
export default class IncidenciasNomina {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);

  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);

  loading = signal(true);
  sincronizando = signal(false);
  data = signal<IncidenciaNominaDTO[]>([]);
  periodos = signal<SelectItemDto[]>([]);
  periodoSeleccionado = signal<string>("");

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

  async onDelete(item: IncidenciaNominaDTO): Promise<void> {
    const ok = await this.confirmS.confirm(
      "¿Está seguro de eliminar esta incidencia?",
    );
    if (!ok) return;
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
}
