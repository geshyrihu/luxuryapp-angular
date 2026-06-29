import { Component, computed, inject, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ImageModule } from "primeng/image";
import { TableModule } from "primeng/table";
import { CustomButtonConfirm } from "src/app/core/components/web/buttons/custom-button-confirm";
import { CustomInputTextSignal } from "src/app/core/components/web/inputs/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { TaskGroupService } from "src/app/features/operations/task-engine/tasks/task.service";

@Component({
  selector: "app-task-report-work-plan-preview",
  imports: [
    TableModule,
    PrimeNgCustomCaption,
    ReactiveFormsModule,
    CustomButtonConfirm,
    CustomInputTextSignal,
    ImageModule,
  ],
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
  numeroSemana: number = 0; // Almacena el nómero de semana seleccionado
  weekInputValueControl = new FormControl<string>("");

  ngOnInit(): void {
    this.setCurrentWeekAndYear();
    this.onLoadData(); // Cargar datos al inicializar el componente
  }

  onSendWorkPlan() {
    this.apiResponseS.onGetList(
      Endpoints.TaskWorkPlans.create(
        this.authS.applicationUserId,
        this.customerIdS.customerId(),
        this.year,
        this.numeroSemana,
      ),
    );
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


