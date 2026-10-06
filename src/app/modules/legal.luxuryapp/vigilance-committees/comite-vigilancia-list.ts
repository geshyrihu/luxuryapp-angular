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
import { ComiteVigilancia } from "@core/interfaces/comite-vigilancia.interface";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { SwalService } from "@core/services/swal.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { ComiteVigilanciaForm } from "./comite-vigilancia-form";
import { ComiteVigilanciaListDesktop } from "./desktop/comite-vigilancia-list-desktop";
import { ComiteVigilanciaListMobile } from "./mobile/comite-vigilancia-list-mobile";

@Component({
  selector: "app-comite-vigilancia-list",
  templateUrl: "./comite-vigilancia-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ComiteVigilanciaListDesktop, ComiteVigilanciaListMobile],
})
export class ComiteVigilanciaList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);
  swalS = inject(SwalService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  dataSignal = signal<ComiteVigilancia[]>([]);
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  ref!: DynamicDialogRef;

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    this.loading.set(true);
    this.apiResponseS
      .onGetList<ComiteVigilancia[]>(
        Endpoints.CommitteeVigilance.list(this.customerIdS.customerId()),
      )
      .then((result) => {
        this.dataSignal.set(result);
        this.loading.set(false);
      });
  }

  async onSendCredential(id: string) {
    const ok = await this.swalS.confirm({
      title: "Confirmación",
      text: "Enviar usuario y contrasena de acceso.",
      icon: "warning",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      focusCancel: true,
    });
    if (!ok) return;
    this.apiResponseS
      .onPost(Endpoints.CommitteeVigilance.sendCredentials(id))
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  async onDelete(id: string) {
    const ok = await this.confirmS.confirm(
      "¿Está seguro de eliminar este miembro del comité?",
    );
    if (!ok) return;
    this.apiResponseS
      .onDelete(Endpoints.CommitteeVigilance.delete(id))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
        }
      });
  }

  onModalForm(data: { id: string; title: string; nameProperty?: string }) {
    this.dialogHandlerS
      .openDialog(
        ComiteVigilanciaForm,
        {
          id: data.id,
          nameProperty: data.nameProperty,
        },
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
