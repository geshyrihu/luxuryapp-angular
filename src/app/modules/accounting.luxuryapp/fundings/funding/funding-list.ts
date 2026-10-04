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
import { FundingListDesktop } from "./desktop/funding-list-desktop";
import { FundingForm } from "./funding-form";
import { FundingListMobile } from "./mobile/funding-list-mobile";

@Component({
  selector: "app-funding-list",
  imports: [FundingListDesktop, FundingListMobile],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./funding-list.html",
})
export class FundingList {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private router = inject(Router);
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
    const urlApi = Endpoints.Funding.list(this.customerIdS.customerId());
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any): void {
    this.apiResponseS.onDelete(Endpoints.Funding.delete(id)).then(() => {
      this.dataSignal.update((data) => data.filter((item) => item.id !== id));
    });
  }

  onDetails(id: string) {
    this.router.navigate(ROUTES.FONDEOS.DETALLE(id));
  }

  onModalCreate(): void {
    this.dialogHandlerS
      .openDialog(FundingForm, {}, "Crear Fondeo", this.dialogHandlerS.sizeXl)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalForm(data: any): void {
    this.dialogHandlerS
      .openDialog(FundingForm, data, data.title, this.dialogHandlerS.sizeXl)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
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
