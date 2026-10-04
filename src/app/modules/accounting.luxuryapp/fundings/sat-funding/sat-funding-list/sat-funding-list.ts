import { SatFundingDto } from "@accounting.luxuryapp/general-ledger/sat-funding/interfaces/sat-funding.interface";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { PlatformService } from "@core/services/platform.service";
import { ROUTES } from "src/app/routing/route-paths";
import { SatFundingListDesktop } from "./desktop/sat-funding-list-desktop";
import { SatFundingListMobile } from "./mobile/sat-funding-list-mobile";

@Component({
  selector: "app-sat-funding-list",
  templateUrl: "./sat-funding-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SatFundingListDesktop, SatFundingListMobile],
})
export class SatFundingListComponent implements OnInit {
  private router = inject(Router);
  private customerIdService = inject(CustomerIdService);
  private apiResponseService = inject(ApiResponseService);
  platformS = inject(PlatformService);

  customerId: string = this.customerIdService.customerId();
  data = signal<SatFundingDto[]>([]);

  constructor() {
    effect(() => {
      this.customerId = this.customerIdService.customerId();
      if (this.customerId) {
        this.onLoadData();
      }
    });
  }

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    if (this.customerId) {
      this.apiResponseService
        .onGetList<SatFundingDto[]>(
          Endpoints.SatFunding.forCustomer(this.customerId),
        )
        .then((result) => {
          if (result) this.data.set(result);
        });
    }
  }

  goToDetail(id: string) {
    this.router.navigate(ROUTES.SAT_FONDEOS.DETALLE(id));
  }
}
