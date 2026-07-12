import { CommonModule, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxEmptyState } from "@ui/adaptive/empty-state/empty-state";
import { LxTag } from "@ui/adaptive/tag/tag";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PageTitleReport } from "@ui/web/title-page-report/page-title-report";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { TaskDateRangeSelector } from "src/app/apps/operations.luxuryapp/task-engine/tasks/task-date-range-selector/task-date-range-selector";
@Component({
  selector: "app-ticket-legal-reportes-externos",
  templateUrl: "./ticket-legal-reportes-externos.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    DatePipe,
    TableModule,
    AppIcon,
    DataViewMobile,
    LxEmptyState,
    PageTitleReport,
    PrimeNgCustomCaption,
    TaskDateRangeSelector,
    MobileListItem,
    LxTag,
  ],
})
export class TicketLegalReportesExternos implements OnInit {
  apiResponseS = inject(ApiResponseService);
  datePipe = inject(DatePipe);
  tableScrollHeightS = inject(TableScrollHeightService);

  // Declaración e inicialización de variables con signals
  reportData = signal<any>(null);
  requestsAttended = signal<any[]>([]);
  requestsPending = signal<any[]>([]);
  startDate = signal<string>("");
  endDate = signal<string>("");
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  kpiRows = computed(() => {
    const d = this.reportData();
    if (!d) return [];
    return [
      {
        icon: null,
        iconColor: null,
        value: d.ticketsAlInicio,
        label: "TICKET INICIAL",
      },
      {
        icon: null,
        iconColor: null,
        value: d.ticketsAlFinal,
        label: "TICKET FINAL",
      },
      {
        icon: "mdi:plus",
        iconColor: "var(--ds-primary)",
        value: d.ticketsEnRango,
        label: "SOLICITUDES NUEVAS",
      },
      {
        icon: "mdi:minus",
        iconColor: "var(--ds-success)",
        value: d.solicitudesAtendidas,
        label: "SOLICITUDES ATENDIDAS",
      },
      {
        icon: "mdi:equal",
        iconColor: "var(--ds-warning)",
        value: d.pendientesSoloDelPeriodo,
        label: "SOLICITUDES PENDIENTES DEL PERIODO",
      },
      {
        icon: "mdi:equal",
        iconColor: "var(--ds-danger)",
        value: d.pendientesAlFinal,
        label: "SOLICITUDES PENDIENTES ACUMULADAS",
      },
    ];
  });

  async ngOnInit(): Promise<void> {
    // Calculate the start date as the first day of the previous month
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    startDate.setDate(1);

    // Calculate the end date as the last day of the previous month
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth());
    endDate.setDate(0);

    // Format the dates
    this.startDate.set(this.formatDate(startDate));
    this.endDate.set(this.formatDate(endDate));

    // Format dates as strings (YYYY-MM-DD)
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    // Call onLoadData with the formatted dates
    await Promise.all([
      this.onLoadReport(formattedStartDate, formattedEndDate),
      this.onRequestsAttended(formattedStartDate, formattedEndDate),
      this.onRequestsPending(),
    ]);
  }

  onLoadReport(startDate: string, endDate: string) {
    return this.apiResponseS
      .onGetList(Endpoints.LegalReports.results(startDate, endDate, false))
      .then((result: any) => {
        this.reportData.set(result);
      });
  }
  onRequestsAttended(startDate: string, endDate: string) {
    return this.apiResponseS
      .onGetList(
        Endpoints.LegalReports.requestsAttended(startDate, endDate, false),
      )
      .then((result: any) => {
        this.requestsAttended.set(this.mapResults(result, "fecha"));
      });
  }
  onRequestsPending() {
    return this.apiResponseS
      .onGetList(Endpoints.LegalReports.requestsPending(false))
      .then((result: any) => {
        this.requestsPending.set(this.mapResults(result, "fecha"));
      });
  }

  onDateRangeSelected(event: { startDate: Date; endDate: Date }) {
    // Convierte las fechas a formato ISO
    const startDateFormatted = event.startDate.toISOString();
    const endDateFormatted = event.endDate.toISOString();

    // Format the dates
    this.startDate.set(this.formatDate(event.startDate));
    this.endDate.set(this.formatDate(event.endDate));

    this.onLoadReport(startDateFormatted, endDateFormatted);
    this.onRequestsAttended(startDateFormatted, endDateFormatted);
    this.onRequestsPending();
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, "dd-MMM-yyyy") || "";
  }

  private mapResults(results: any[], dateField: string): any[] {
    if (!results) return [];
    return results.map((item) => {
      if (
        typeof item[dateField] === "string" &&
        item[dateField].includes("-")
      ) {
        item[dateField] = this.parseSpanishDate(item[dateField]);
      }
      return item;
    });
  }

  private parseSpanishDate(dateStr: string): Date | string {
    const months: { [key: string]: number } = {
      ene: 0,
      feb: 1,
      mar: 2,
      abr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      ago: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dic: 11,
    };
    const parts = dateStr.toLowerCase().split("-");
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = months[parts[1]];
      const year = parseInt(parts[2]);
      if (!isNaN(day) && month !== undefined && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    return dateStr;
  }
}
