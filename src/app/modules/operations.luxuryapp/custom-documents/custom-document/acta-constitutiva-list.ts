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
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { EDocumentType } from "@legal.luxuryapp/legal/interfaces/document-type.enum";
import { ActaConstitutivaListDesktop } from "./desktop/acta-constitutiva-list-desktop";
import { ActaConstitutivaListMobile } from "./mobile/acta-constitutiva-list-mobile";

@Component({
  selector: "app-acta-constitutiva-list",
  templateUrl: "./acta-constitutiva-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ActaConstitutivaListDesktop, ActaConstitutivaListMobile],
})
export class ActaConstitutivaList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);
  platformS = inject(PlatformService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  filterText: string = "";

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const customerId: string = this.customerIdS.customerId();
    const urlApi = Endpoints.CustomDocuments.listByCustomerAndType(
      customerId,
      EDocumentType.ActaConstitutiva,
    );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
}
