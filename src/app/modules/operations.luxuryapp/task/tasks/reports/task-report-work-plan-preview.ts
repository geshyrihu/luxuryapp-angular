import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { AppImage } from "@ui/web/image/image";
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { TaskGroupService } from "@operations.luxuryapp/task/tasks/task.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";

import { WebButtonIconConfirm } from "@ui/buttons/web-icon/button-confirm";

@Component({
  selector: "app-task-report-work-plan-preview",
  imports: [
    WebButtonIconConfirm,
    AppTable,

    AppSortableColumn,

    AppSorticon,
    TableCaption,
    ReactiveFormsModule,

    CustomInputTextSignal,
    AppImage,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./task-report-work-plan-preview.html",
})
export class TaskReportWorkPlanPreview {
  onCardEmployee(_arg0: any) {
    throw new Error("Method not implemented");
  }
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);
  TaskGroupService = inject(TaskGroupService);
  tableScrollHeightS = inject(TableScrollHeightService);
  dataSignal = signal<any>(null); // Almacena los datos obtenidos del API
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  year: number = 0; // Almacena el Año seleccionado
  numeroSemana: number = 0; // Almacena el número de semana seleccionado
  weekInputValueControl = new FormControl<string>("");

  ngOnInit(): void {
    this.setCurrentWeekAndYear();
    this.onLoadData(); // Cargar datos al inicializar el componente
  }

  onSendWorkPlan() {
    this.apiResponseS
      .onPost(
        Endpoints.TaskWorkPlans.create(
        this.authS.applicationUserId,
        this.customerIdS.customerId(),
        this.year,
        this.numeroSemana,
        ),
      )
      .then(() => this.onLoadData());
  }
  onLoadData() {
    // No sobreescribimos el Año y la semana seleccionados con los valores actuales
    this.apiResponseS
      .onGetList(
        Endpoints.TaskWorkPlans.preview(
          this.customerIdS.customerId(),
          this.year,
          this.numeroSemana,
        ),
      )
      .then((result: any) => this.dataSignal.set(result));
  }

  handleWeekChange(event: Event): void {
    const weekValue = (event.target as HTMLInputElement).value; // '2024-W41' o '2024-W42'

    // Verifica el valor de 'weekValue'
    if (weekValue) {
      const [year, week] = weekValue.split("-W");
      this.year = parseInt(year, 10);
      this.numeroSemana = parseInt(week, 10);

      // Luego carga los datos
      this.onLoadData();
    }
  }
  setCurrentWeekAndYear(): void {
    this.TaskGroupService.setCurrentWeekAndYear();
    this.year = this.TaskGroupService.year;
    this.numeroSemana = this.TaskGroupService.numeroSemana;
    this.weekInputValueControl.setValue(
      `${this.year}-W${this.numeroSemana.toString().padStart(2, "0")}`,
      { emitEvent: false },
    );
  }
}


