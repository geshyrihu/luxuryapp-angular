import { Component, computed, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import { TableModule } from "primeng/table";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
@Component({
  selector: "app-comites-list",
  templateUrl: "./comites-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    PrimeNgCustomCaption,
    DataViewMobile,
    PrimeNgCustomTableFooter,
    MobileListItem,
    AppIcon,
  ],
})
export class ComitesList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  // Declaración e inicialización de variables
  dataSignal = signal<any[]>([]);
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  flatData = computed(() => {
    return this.dataSignal().flatMap((customerGroup) =>
      customerGroup.committeeMembers.map((member: any) => ({
        ...member,
        customerName: customerGroup.customer.nombreCorto,
      })),
    );
  });

  globalFilterFields = computed(() => {
    const data = this.flatData();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.loading.set(true);
    this.apiResponseS
      .onGetList(Endpoints.LegalDirectories.committees)
      .then((result: any) => {
        this.dataSignal.set(result);
        this.loading.set(false);
      });
  }
}
