import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { TableModule } from "primeng/table";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
@Component({
  selector: "app-comites-list",
  templateUrl: "./comites-list.html",
  imports: [
    TableModule,
    PrimeNgCustomCaption,
    DataViewMobile,
    PrimeNgCustomTableFooter,
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
