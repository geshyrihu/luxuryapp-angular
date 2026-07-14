import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { MobileButtonLabelViewPdf } from "@ui/buttons/mobile-label/button-view-pdf";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { differenceInDays } from "date-fns"; // Utilidad para calcular la diferencia en días
import { TableModule } from "primeng/table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";

@Component({
  selector: "app-contracts-policies",
  templateUrl: "./contracts-policies.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    DataViewMobile,
    MobileListItem,
    MobileActionMenu,
    MobileButtonLabelViewPdf,
    WebButtonIconViewPdf,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
  ],
})
export class ContractsPolicies {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  tableScrollHeightS = inject(TableScrollHeightService);
  dataSignal = signal<any[]>([]);
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = Endpoints.RefactorOperations.policyContractListById(
      this.customerIdS.customerId(),
    );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
  // Suponiendo que 'item.endDate' es una fecha en formato ISO o de tipo Date
  isCloseToEndDate(endDate: string | Date): boolean {
    const today = new Date();
    const end = new Date(endDate);
    const daysDifference = differenceInDays(end, today);
    return daysDifference <= 45;
  }
}
