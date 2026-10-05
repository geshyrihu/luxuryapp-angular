import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { PaymentMethodListDesktop } from "./desktop/payment-method-list-desktop";
import { PaymentMethodDto } from "./interfaces/payment-method.dto";
import { PaymentMethodListMobile } from "./mobile/payment-method-list-mobile";
import { PaymentMethodForm } from "./payment-method-form";

@Component({
  selector: "app-payment-method-list",
  templateUrl: "./payment-method-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PaymentMethodListDesktop, PaymentMethodListMobile],
})
export class PaymentMethodList implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);

  data = signal<PaymentMethodDto[]>([]);
  readonly globalFilterFields = computed(() => {
    const data = this.data();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<PaymentMethodDto[]>(Endpoints.Catalogs.PaymentMethods.getAll)
      .then((result) => {
        if (result) this.data.set(result);
      });
  }

  async onDelete(id: any): Promise<void> {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.Catalogs.PaymentMethods.delete(id))
      .then((result: boolean) => {
        if (result)
          this.data.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        PaymentMethodForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
