import { CommonModule, DatePipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { TaskDateRangeSelector } from "src/app/features/operations/task-engine/tasks/components/task-date-range-selector/task-date-range-selector";
@Component({
  selector: "app-ticket-legal-reportes-externos",
  templateUrl: "./ticket-legal-reportes-externos.html",
  imports: [CommonModule, TableModule, CardModule, TaskDateRangeSelector],
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

