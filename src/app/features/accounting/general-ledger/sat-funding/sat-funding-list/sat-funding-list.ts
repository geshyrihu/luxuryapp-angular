import { CommonModule } from "@angular/common";
import { Component, OnInit, effect, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { ROUTES } from "src/app/routing/route-paths";
import { addIcons } from "ionicons";
import { cashOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { SatFundingDTO } from "src/app/core/interfaces/sat-funding.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-sat-funding-list",
  templateUrl: "./sat-funding-list.html",
  imports: [
    WebButtonIcon,
    TooltipModule,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    PrimeNgCustomCaption,
    WebButtonLabel,
    DataViewMobile,
    IonItem,
    IonLabel,
  ],
})
export class SatFundingListComponent implements OnInit {
  private router = inject(Router);
  private customerIdService = inject(CustomerIdService);
  private apiResponseService = inject(ApiResponseService);
  private tableScrollHeightS = inject(TableScrollHeightService);
  customerId: string = this.customerIdService.customerId();
  data = signal<SatFundingDTO[]>([]);
  selection: SatFundingDTO[] = [];
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
        .onGetList<SatFundingDTO[]>(`SatFunding/ForCustomer/${this.customerId}`)
        .then((result) => {
          if (result) this.data.set(result);
        });
    }
  }

  goToDetail(id: string) {
    this.router.navigate(ROUTES.SAT_FONDEOS.DETALLE(id));
  }
}
