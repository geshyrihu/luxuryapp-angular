import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints";
import { tablePrimeNgRows } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { TaskDateRangeSelector } from "src/app/features/tenant/tasks/components/task-date-range-selector/task-date-range-selector";
import { TaskGroupService } from "src/app/features/tenant/tasks/task.service";
@Component({
  selector: "app-task-report-resumen",
  templateUrl: "./task-report-resumen.html",
  imports: [TaskDateRangeSelector, CommonModule, TableModule],
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

    // Aquí puedes usar las fechas seleccionadas para obtener el reporte de tickets
    this.onLoadData(startDateFormatted, endDateFormatted);
  }
}

