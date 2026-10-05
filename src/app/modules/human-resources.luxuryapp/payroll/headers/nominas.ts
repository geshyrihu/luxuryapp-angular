import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ROUTES } from "src/app/routing/route-paths";
import { NominaEncabezadoDTO } from "../interfaces/nomina-encabezado.interface";
import { NominasDesktop } from "./desktop/nominas-desktop";
import ModalGenerarNomina from "./generate-payroll-modal/modal-generar-nomina";
import { NominasMobile } from "./mobile/nominas-mobile";

@Component({
  selector: "app-nominas",
  imports: [NominasDesktop, NominasMobile],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./nominas.html",
})
export default class Nominas {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private router = inject(Router);

  platformS = inject(PlatformService);

  loading = signal(true);
  data = signal<NominaEncabezadoDTO[]>([]);

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
}
