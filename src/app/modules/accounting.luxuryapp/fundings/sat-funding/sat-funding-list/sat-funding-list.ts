import { SatFundingDto } from "@accounting.luxuryapp/general-ledger/sat-funding/interfaces/sat-funding.interface";
import { CommonModule } from "@angular/common";
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
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { addIcons } from "ionicons";
import { cashOutline } from "ionicons/icons";
import { ROUTES } from "src/app/routing/route-paths";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-sat-funding-list",
  templateUrl: "./sat-funding-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIcon,
    LxTooltipDirective,
    CommonModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,

    DataViewMobile,
    TableEmptyMessage,
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
