import { ButtonWeb } from "@ui/buttons/web";
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
import { PeriodoNominaDTO } from "../interfaces/periodo-nomina.interface";
import { TiempoExtraDTO } from "../interfaces/tiempo-extra.interface";
import ModalTiempoExtraAdd from "./add-overtime-modal/modal-tiempo-extra-add";
import { TiempoExtraDesktop } from "./desktop/tiempo-extra-desktop";
import { TiempoExtraMobile } from "./mobile/tiempo-extra-mobile";

@Component({
  selector: "app-tiempo-extra",
  imports: [ButtonWeb, TiempoExtraDesktop, TiempoExtraMobile],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./tiempo-extra.html",
})
export default class TiempoExtra {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);

  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);

  loading = signal(true);
  data = signal<TiempoExtraDTO[]>([]);
  periodos = signal<SelectItemDto[]>([]);
  periodoSeleccionado = signal<string>("");

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

  async onDelete(item: TiempoExtraDTO): Promise<void> {
    const ok = await this.confirmS.confirm(
      "¿Está seguro de eliminar este tiempo extra?",
    );
    if (!ok) return;
    this.apiResponseS
      .onDelete(Endpoints.HR.Nomina.TiempoExtra.delete(item.id))
      .then((result) => {
        if (result) this.onLoadData(this.periodoSeleccionado());
      });
  }
}
