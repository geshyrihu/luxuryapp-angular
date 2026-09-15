import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { TaskDateRangeSelector } from "@operations.luxuryapp/task-engine/tasks/task-date-range-selector/task-date-range-selector";
import { TaskGroupService } from "@operations.luxuryapp/task-engine/tasks/task.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { tablePrimeNgRows } from "@core/helpers/table-primeng-option";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
@Component({
  selector: "app-task-report-resumen",
  templateUrl: "./task-report-resumen.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TaskDateRangeSelector, ApiDatePipe, TableModule],
})
export class TaskMessageReportResumen {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  TaskGroupService = inject(TaskGroupService);
  customerIdS = inject(CustomerIdService);
  tableScrollHeightS = inject(TableScrollHeightService);

  data: any;
  status: number = this.TaskGroupService.taskGroupMessageStatus;
  tablePrimeNgRows: number = tablePrimeNgRows();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  onLoadData(startDate: string, endDate: string) {
    this.apiResponseS
      .onGetList(
        Endpoints.TaskReports.ticketReport(
          this.customerIdS.customerId(),
          startDate,
          endDate,
        ),
      )
      .then((result: any) => {
        this.data = result;
      });
  }

  onDateRangeSelected(event: { startDate: Date; endDate: Date }) {
    // Convierte las fechas a formato ISO
    const startDateFormatted = event.startDate.toISOString(); // Formato: '2024-09-30T00:00:00.000Z'
    const endDateFormatted = event.endDate.toISOString(); // Formato: '2024-10-17T00:00:00.000Z'

    // Aqué puedes usar las fechas seleccionadas para obtener el reporte de tickets
    this.onLoadData(startDateFormatted, endDateFormatted);
  }
}


