import { Component, computed, effect, inject, signal, ChangeDetectionStrategy } from "@angular/core";
import { Router } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { calculatorOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
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
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { FaqsFondeo } from "src/app/features/accounting/fondeos-y-reporteo/funding/faqs-fondeo";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-funding-accounting-list",
  imports: [
    WebButtonIconItem,
    TooltipModule,
    TableModule,
    WebButtonLabelItem,
    PrimeNgCustomTableEmptyMessage,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    IonItem,
    IonLabel,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./funding-accounting-list.html",
})
export class FundingAccountingList {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  router = inject(Router);
  fechaInicio: Date | string | null = null;
  fechaFin: Date | string | null = null;

  loading = signal(true);
  dataSignal = signal<any[]>([]);

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  globalFilterFields = computed(() => {
    const current = this.dataSignal();
    return current.length > 0 ? globalFilterFields(current) : [];
  });

  constructor() {
    addIcons({ calculatorOutline });
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
    const urlApi = `fundingaccounting/list/${this.customerIdS.customerId()}`;
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
      this.dialogHandlerS.sizeLg,
    );
  }
}
