import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { InventarioIluminacionDesktop } from "./desktop/inventario-iluminacion-desktop";
import { InventarioIluminacionForm } from "./inventario-iluminacion-form";
import { InventarioIluminacionMobile } from "./mobile/inventario-iluminacion-mobile";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";

@Component({
  selector: "app-inventario-iluminacion",
  templateUrl: "./inventario-iluminacion.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InventarioIluminacionDesktop, InventarioIluminacionMobile],
})
export class InventarioIluminacion {
  apiResponseS = inject(ApiResponseService);
  confirmS = inject(ConfirmService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);

  dataSignal = signal<any[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);

  ref: DynamicDialogRef;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        Endpoints.InventarioIluminacion.listByCustomer(
          this.customerIdS.customerId(),
        ),
      )
      .then((result: any) => {
        this.dataSignal.set(result);
      });
  }
  async onDelete(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.InventarioIluminacion.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        InventarioIluminacionForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
