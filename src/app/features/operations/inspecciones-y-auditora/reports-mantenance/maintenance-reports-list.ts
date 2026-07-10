import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PageTitleReport } from "@ui/web/title-page-report/page-title-report";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { PeriodMonthService } from "src/app/core/services/periodo-month.service";
import { StorageService } from "src/app/core/services/storage.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { MenuReportMaintenance } from "./menu-report-maintenance";
@Component({
  selector: "app-maintenance-reports",
  templateUrl: "./maintenance-reports-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    RouterModule,
    NgbTooltipModule,
    InputTextModule,
    TableModule,
    PrimeNgCustomCaption,
    PageTitleReport,
    CustomInputTextSignal,
    DataViewMobile,
    PrimeNgCustomTableEmptyMessage,
  ],
})
export class MaintenanceReports {
  apiResponseS = inject(ApiResponseService);
  dateS = inject(DateService);
  private storageS = inject(StorageService);
  PeriodMonthService = inject(PeriodMonthService);
  customerIdS = inject(CustomerIdService);
  tableScrollHeightS = inject(TableScrollHeightService);
  menu = signal<any>(MenuReportMaintenance);

  // Convertimos el observable a signal
  periodoInicial = toSignal(this.PeriodMonthService.getPeriodoInicial$());

  private storageKey = "selectedPeriodo";
  periodo = signal<string>("");
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    // Inicializar periodo desde localStorage
    const savedPeriodo = this.storageS.retrieve(this.storageKey);
    if (savedPeriodo) {
      this.periodo.set(savedPeriodo);
      this.PeriodMonthService.setPeriodo(savedPeriodo);
    }

    effect(() => {
      // Reaccionar a cambios en el periodo inicial si es necesario
      const pInicial = this.periodoInicial();
      if (pInicial) {
        this.onLoadMenu();
      }
    });
  }

  onFilterPeriod(periodo: string) {
    this.PeriodMonthService.setPeriodo(periodo);
    this.storageS.store(this.storageKey, periodo);
    this.periodo.set(periodo);
  }

  onLoadMenu() {
    this.menu.set(MenuReportMaintenance);
  }
}
