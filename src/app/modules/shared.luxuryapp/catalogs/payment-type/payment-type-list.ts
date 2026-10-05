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
import { PaymentTypeListDesktop } from "./desktop/payment-type-list-desktop";
import { PaymentTypeListMobile } from "./mobile/payment-type-list-mobile";
import { PaymentTypeForm } from "./payment-type-form";

@Component({
  selector: "app-payment-type-list",
  templateUrl: "./payment-type-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PaymentTypeListDesktop, PaymentTypeListMobile],
})
export class PaymentTypeList implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);

  data = signal<any[]>([]);
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
      .onGetList(Endpoints.Catalogs.PaymentTypes.getAll)
      .then((result: any) => {
        this.data.set(result);
      });
  }

  async onDelete(id: any): Promise<void> {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.Catalogs.PaymentTypes.delete(id))
      .then((result: boolean) => {
        if (result)
          this.data.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(PaymentTypeForm, data, data.title, this.dialogHandlerS.sizeXl)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
