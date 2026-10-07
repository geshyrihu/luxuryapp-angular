import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DateService } from "@core/services/date.service";
import { PeriodMonthService } from "@core/services/periodo-month.service";
import { PlatformService } from "@core/services/platform.service";
import { StorageService } from "@core/services/storage.service";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { LuxInputTextSignal } from "@ui/inputs/web/lux-input-text-signal";
import { PageTitleReport } from "@ui/web/title-page-report/page-title-report";
import { MaintenanceReportsDesktop } from "./desktop/maintenance-reports-list-desktop";
import { MenuReportMaintenance } from "./menu-report-maintenance";
import { MaintenanceReportsMobile } from "./mobile/maintenance-reports-list-mobile";
@Component({
  selector: "app-maintenance-reports",
  templateUrl: "./maintenance-reports-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    NgbTooltipModule,
    PageTitleReport,
    LuxInputTextSignal,
    MaintenanceReportsDesktop,
    MaintenanceReportsMobile,
  ],
})
export class MaintenanceReports {
  apiResponseS = inject(ApiResponseService);
  dateS = inject(DateService);
  private storageS = inject(StorageService);
  PeriodMonthService = inject(PeriodMonthService);
  customerIdS = inject(CustomerIdService);
  platformS = inject(PlatformService);
  menu = signal<any>(MenuReportMaintenance);

  // Convertimos el observable a signal
  periodoInicial = toSignal(this.PeriodMonthService.getPeriodoInicial$());

  private storageKey = "selectedPeriodo";
  periodo = signal<string>("");

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
