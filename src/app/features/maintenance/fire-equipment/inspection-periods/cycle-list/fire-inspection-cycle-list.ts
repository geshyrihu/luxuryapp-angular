import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { ROUTES } from "src/app/routing/route-paths";
import { TableModule } from "primeng/table";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";

import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";

import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-fire-inspection-cycle-list",
  templateUrl: "./fire-inspection-cycle-list.html",
  imports: [
    WebButtonIconItem,
    TooltipModule,
    MobileActionMenu,
    MobileButtonLabelItem,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    DataViewMobile,
    WebButtonLabelItem,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    ActionMenu,
    IonItem,
    IonLabel,
    WebButtonLabelItem,
  ],
})
export class FireInspectionCycleList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  router = inject(Router);

  dataSignal = signal<any[]>([]);
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(`FireInspectionCycle/list/${this.customerIdS.customerId()}`)
      .then((result: any) => this.dataSignal.set(result));
  }

  onViewDetail(id: string) {
    this.router.navigate(ROUTES.BITACORAS.CICLO_INSPECCION(id));
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      Pendiente: "text-blue-600",
      EnCurso: "text-orange-600",
      Completado: "text-green-600",
      Vencido: "text-red-600",
    };
    return map[status] ?? "";
  }
}
