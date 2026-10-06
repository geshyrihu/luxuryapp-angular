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
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { PrestamoEmpleadoDTO } from "../interfaces/prestamo-empleado.interface";
import ModalPrestamoAdd from "./add-loan-modal/modal-prestamo-add";
import { PrestamosEmpleadoDesktop } from "./desktop/prestamos-empleado-desktop";
import ModalPrestamoDetalle from "./loan-detail-modal/modal-prestamo-detalle";
import { PrestamosEmpleadoMobile } from "./mobile/prestamos-empleado-mobile";

@Component({
  selector: "app-prestamos-empleado",
  imports: [PrestamosEmpleadoDesktop, PrestamosEmpleadoMobile],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./prestamos-empleado.html",
})
export default class PrestamosEmpleado {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);

  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);

  loading = signal(true);
  data = signal<PrestamoEmpleadoDTO[]>([]);

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
      .onGetList<PrestamoEmpleadoDTO[]>(
        Endpoints.HR.Nomina.Prestamos.list(customerId),
      )
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
        this.dialogHandlerS.sizeXl,
      )
      .then((result) => {
        if (result) this.onLoadData(this.customerIdS.customerId());
      });
  }

  async onDelete(item: PrestamoEmpleadoDTO): Promise<void> {
    const ok = await this.confirmS.confirm(
      "¿Está seguro de eliminar este préstamo?",
    );
    if (!ok) return;
    this.apiResponseS
      .onDelete(Endpoints.HR.Nomina.Prestamos.delete(item.id))
      .then((result) => {
        if (result) this.onLoadData(this.customerIdS.customerId());
      });
  }
}
