import { ApiDatePipe } from "../../../../../../shared/pipes/api-date.pipe";
import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxCard } from "@ui/adaptive/card/card";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { CheckboxModule } from "@ui/web/primeng-checkbox/primeng-checkbox";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import Swal from "sweetalert2";
import { EmployeeOnboardingChecklistItemDTO } from "../interfaces/employee-file.interfaces";

@Component({
  selector: "app-employee-onboarding-checklist",
  templateUrl: "./employee-onboarding-checklist.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    ApiDatePipe,
    LxCard,
    LxTag,
    AppIcon,
    WebButtonIconItem,
    CheckboxModule,
  ],
})
export class EmployeeOnboardingChecklist implements OnInit {
  employeeId = input.required<string>();

  readonly checklist = signal<EmployeeOnboardingChecklistItemDTO[]>([]);
  readonly isLoading = signal(true);
  readonly busyTaskId = signal<string | null>(null);

  private readonly apiResponseS = inject(ApiResponseService);
  private readonly toastS = inject(CustomToastService);

  async ngOnInit(): Promise<void> {
    await this.loadChecklist();
  }

  async loadChecklist(): Promise<void> {
    this.isLoading.set(true);
    try {
      let tasks = await this.apiResponseS.onGetList<EmployeeOnboardingChecklistItemDTO[]>(
        Endpoints.HR.EmployeeFile.onboardingChecklist(this.employeeId()),
      );

      if (!tasks || tasks.length === 0) {
        const initialized = await this.apiResponseS.onPost<EmployeeOnboardingChecklistItemDTO[]>(
          Endpoints.HR.EmployeeFile.initializeOnboardingChecklist(this.employeeId()),
        );
        tasks = initialized ? initialized : [];
      }

      this.checklist.set(tasks);
    } finally {
      this.isLoading.set(false);
    }
  }

  async onToggle(task: EmployeeOnboardingChecklistItemDTO, isCompleted: boolean): Promise<void> {
    if (this.busyTaskId() === task.id) return;
    this.busyTaskId.set(task.id);
    try {
      const updated = await this.apiResponseS.onPost<EmployeeOnboardingChecklistItemDTO>(
        Endpoints.HR.EmployeeFile.toggleOnboardingChecklistTask(task.id),
        { isCompleted, notes: task.notes },
      );
      if (updated) {
        this.checklist.update((tasks) =>
          tasks.map((t) => (t.id === task.id ? { ...t, ...updated } : t)),
        );
      }
    } finally {
      this.busyTaskId.set(null);
    }
  }

  async onEditNotes(task: EmployeeOnboardingChecklistItemDTO): Promise<void> {
    const { value: notes } = await Swal.fire({
      title: `Notas de "${task.optionName}"`,
      input: "textarea",
      inputLabel: "Observaciones de la tarea:",
      inputValue: task.notes ?? "",
      inputPlaceholder: "Ej. Talla de uniforme M entregada",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
    });

    if (notes === undefined || notes === task.notes) return;

    this.busyTaskId.set(task.id);
    try {
      const updated = await this.apiResponseS.onPost<EmployeeOnboardingChecklistItemDTO>(
        Endpoints.HR.EmployeeFile.toggleOnboardingChecklistTask(task.id),
        { isCompleted: task.isCompleted, notes: notes as string },
      );
      if (updated) {
        this.checklist.update((tasks) =>
          tasks.map((t) => (t.id === task.id ? { ...t, ...updated } : t)),
        );
        this.toastS.showSuccess("Nota guardada correctamente");
      }
    } finally {
      this.busyTaskId.set(null);
    }
  }
}