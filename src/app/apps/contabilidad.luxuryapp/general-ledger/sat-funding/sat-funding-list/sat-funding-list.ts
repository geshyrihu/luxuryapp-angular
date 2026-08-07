import { CommonModule } from "@angular/common";
import { Component, OnInit, effect, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { addIcons } from "ionicons";
import { cashOutline } from "ionicons/icons";
import { SatFundingDto } from "src/app/apps/contabilidad.luxuryapp/general-ledger/sat-funding/interfaces/sat-funding.interface";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ROUTES } from "src/app/routing/route-paths";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-sat-funding-list",
  templateUrl: "./sat-funding-list.html",
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIcon,
    LxTooltipDirective,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    PrimeNgCustomCaption,
    DataViewMobile,
  ],
})
export class SatFundingListComponent implements OnInit {
  private router = inject(Router);
  private customerIdService = inject(CustomerIdService);
  private apiResponseService = inject(ApiResponseService);
  private tableScrollHeightS = inject(TableScrollHeightService);
  customerId: string = this.customerIdService.customerId();
  data = signal<SatFundingDto[]>([]);
  selection: SatFundingDto[] = [];
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    addIcons({ cashOutline });
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
