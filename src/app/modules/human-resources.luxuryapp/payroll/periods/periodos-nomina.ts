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
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { PeriodoNominaDTO } from "../interfaces/periodo-nomina.interface";
import ModalPeriodoAdd from "./add-period-modal/modal-periodo-add";
import { PeriodosNominaDesktop } from "./desktop/periodos-nomina-desktop";
import { PeriodosNominaMobile } from "./mobile/periodos-nomina-mobile";
import ModalDiasNoHabiles from "./non-working-days-modal/modal-dias-no-habiles";

@Component({
  selector: "app-periodos-nomina",
  imports: [WebButtonLabel, PeriodosNominaDesktop, PeriodosNominaMobile],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./periodos-nomina.html",
})
export default class PeriodosNomina {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);

  platformS = inject(PlatformService);

  loading = signal(true);
  data = signal<PeriodoNominaDTO[]>([]);
  anioFiltro = signal<number>(new Date().getFullYear());

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
    await this.apiResponseS.onPost(
      Endpoints.HR.Nomina.Periodos.autoCrear(customerId),
      {},
    );
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
      .openDialog(
        ModalPeriodoAdd,
        {},
        "Nuevo Periodo de Nomina",
        this.dialogHandlerS.sizeMd,
      )
      .then((result) => {
        if (result)
          this.onLoadData(this.customerIdS.customerId(), this.anioFiltro());
      });
  }

  openEdit(item: PeriodoNominaDTO): void {
    this.dialogHandlerS
      .openDialog(
        ModalPeriodoAdd,
        { item },
        "Editar Periodo",
        this.dialogHandlerS.sizeMd,
      )
      .then((result) => {
        if (result)
          this.onLoadData(this.customerIdS.customerId(), this.anioFiltro());
      });
  }

  openDiasNoHabiles(item: PeriodoNominaDTO): void {
    this.dialogHandlerS
      .openDialog(
        ModalDiasNoHabiles,
        { periodoId: item.id },
        `Dias No Habiles - ${item.quincenaDisplay}`,
        this.dialogHandlerS.sizeXl,
      )
      .then(() => {});
  }

  onDelete(item: PeriodoNominaDTO): void {
    this.apiResponseS
      .onDelete(Endpoints.HR.Nomina.Periodos.delete(item.id))
      .then((result) => {
        if (result)
          this.onLoadData(this.customerIdS.customerId(), this.anioFiltro());
      });
  }
}
