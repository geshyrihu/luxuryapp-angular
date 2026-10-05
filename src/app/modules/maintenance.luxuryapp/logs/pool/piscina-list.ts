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
import { PiscinaListDesktop } from "./desktop/piscina-list-desktop";
import { PiscinaListMobile } from "./mobile/piscina-list-mobile";
import { PiscinaForm } from "./piscina-form";

interface PiscinaDto {
  id: string;
  name: string;
  ubication: string;
  volumen: number;
  pathImage?: string;
  typePiscina: string | number;
}
@Component({
  selector: "app-piscina-list",
  templateUrl: "./piscina-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [PiscinaListDesktop, PiscinaListMobile],
})
export class PiscinaList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  platformS = inject(PlatformService);

  dataSignal = signal<PiscinaDto[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  ref: DynamicDialogRef;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = Endpoints.RefactorMantenimiento.piscinaListById(
      this.customerIdS.customerId(),
    );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(PiscinaForm, data, data.title, this.dialogHandlerS.sizeXl)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.Piscina.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
      });
  }
}
