import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateRangeStorageService } from "src/app/apps/operations.luxuryapp/task-engine/tasks/date-range-storage.service";
import { TaskGroupService } from "src/app/apps/operations.luxuryapp/task-engine/tasks/task.service";

@Component({
  selector: "app-task-weekly-report-preview",
  templateUrl: "./task-weekly-report-preview.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
})
export class TaskWeeklyReportPreview implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dateRangeStorageService = inject(DateRangeStorageService);
  TaskGroupService = inject(TaskGroupService);
  // Declaración e inicialización de variables
  data = signal<any>(null);
  // Modificamos la declaración de dateRange para que use un objeto con from y to
  year: any = this.TaskGroupService.year || 0;
  numeroSemana: any = this.TaskGroupService.numeroSemana || 0;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        Endpoints.TaskReports.weeklyPreview(
          this.customerIdS.customerId(),
          this.year,
          this.numeroSemana,
        ),
      )
      .then((result: any) => {
        this.data.set(result);
      });
  }
}
