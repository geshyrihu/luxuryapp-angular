import { Component, effect, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { documentTextOutline } from "ionicons/icons";
import { RouterModule } from "@angular/router";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PageTitleReport } from "src/app/core/components/title-page-report/page-title-report";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { PeriodMonthService } from "src/app/core/services/periodo-month.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { MenuReportMaintenance } from "./menu-report-maintenance";
@Component({
  selector: "app-maintenance-reports",
  templateUrl: "./maintenance-reports-list.html",
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
    IonItem,
    IonLabel,
    IonIcon,
  ],
})
export class MaintenanceReports {
  apiResponseS = inject(ApiResponseService);
  dateS = inject(DateService);
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
    addIcons({ documentTextOutline });
    // Inicializar periodo desde localStorage
    const savedPeriodo = localStorage.getItem(this.storageKey);
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
    localStorage.setItem(this.storageKey, periodo);
    this.periodo.set(periodo);
  }

  onLoadMenu() {
    this.menu.set(MenuReportMaintenance);
  }
}









