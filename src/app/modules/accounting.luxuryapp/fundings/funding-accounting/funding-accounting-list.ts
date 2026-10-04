import { FaqsFondeo } from "@accounting.luxuryapp/fundings/funding/faqs-fondeo";
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
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ROUTES } from "src/app/routing/route-paths";
import { FundingAccountingListDesktop } from "./desktop/funding-accounting-list-desktop";
import { FundingAccountingListMobile } from "./mobile/funding-accounting-list-mobile";

@Component({
  selector: "app-funding-accounting-list",
  imports: [FundingAccountingListDesktop, FundingAccountingListMobile],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./funding-accounting-list.html",
})
export class FundingAccountingList {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  router = inject(Router);
  platformS = inject(PlatformService);

  fechaInicio: Date | string | null = null;
  fechaFin: Date | string | null = null;

  dataSignal = signal<any[]>([]);
  globalFilterFields = computed(() => {
    const current = this.dataSignal();
    return current.length > 0 ? globalFilterFields(current) : [];
  });

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData();
      }
    });
  }

  isBuscarDisabled(): boolean {
    if (!this.fechaInicio || !this.fechaFin) return true;
    return new Date(this.fechaFin as any) < new Date(this.fechaInicio as any);
  }

  onLoadData(): void {
    const urlApi = Endpoints.Funding.listAccounting(
      this.customerIdS.customerId(),
    );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.dataSignal.set(result || []);
    });
  }

  onDetails(id: string) {
    this.router.navigate(ROUTES.CONTABILIDAD.DETALLE_FONDEO(id));
  }

  onFaqsFondeo(): void {
    this.dialogHandlerS.openDialog(
      FaqsFondeo,
      {},
      "",
      this.dialogHandlerS.sizeXl,
    );
  }
}
