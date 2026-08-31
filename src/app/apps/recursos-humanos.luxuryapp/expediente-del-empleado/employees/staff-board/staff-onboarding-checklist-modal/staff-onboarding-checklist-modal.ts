import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxCard } from "@ui/adaptive/card/card";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CheckboxModule } from "@ui/web/primeng-checkbox/primeng-checkbox";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { ApiDatePipe } from "../../../../../../shared/pipes/api-date.pipe";
import { EmployeeOnboardingChecklistItemDTO } from "../../../recursos-humanos/employee-file/interfaces/employee-file.interfaces";

interface StaffOnboardingChecklistViewModel extends EmployeeOnboardingChecklistItemDTO {
  draftNotes: string;
  draftCompleted: boolean;
}

@Component({
  selector: "app-staff-onboarding-checklist-modal",
  templateUrl: "./staff-onboarding-checklist-modal.html",
  styleUrl: "./staff-onboarding-checklist-modal.scss",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    ApiDatePipe,
    LxCard,
    LxTag,
    AppIcon,
    WebButtonLabel,
    CheckboxModule,
  ],
})
export class StaffOnboardingChecklistModal {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);

  readonly employeeId = this.config.data?.employeeId as string;
  readonly employeeName =
    (this.config.data?.employeeName as string) || "Colaborador";
  readonly workPositionName =
    (this.config.data?.workPositionName as string) || "Puesto sin nombre";

  readonly tasks = signal<StaffOnboardingChecklistViewModel[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly busyTaskId = signal<string | null>(null);
  readonly summary = computed(() => {
    const items = this.tasks();
    return {
      total: items.length,
      completed: items.filter((task) => task.draftCompleted).length,
      overdue: items.filter((task) => this.isOverdue(task)).length,
    };
  });

  constructor() {
    void this.loadChecklist();
  }

  async loadChecklist(): Promise<void> {
    this.loading.set(true);
    try {
      let tasks = await this.apiResponseS.onGetList<
        EmployeeOnboardingChecklistItemDTO[]
      >(Endpoints.HR.EmployeeFile.onboardingChecklist(this.employeeId));

      if (!tasks || tasks.length === 0) {
        const initialized = await this.apiResponseS.onPost<
          EmployeeOnboardingChecklistItemDTO[]
        >(
          Endpoints.HR.EmployeeFile.initializeOnboardingChecklist(
            this.employeeId,
          ),
          null,
          undefined,
          false,
        );
        tasks = initialized || [];
      }

      this.tasks.set(
        (tasks ?? []).map((task) => ({
          ...task,
          draftNotes: task.notes ?? "",
          draftCompleted: task.isCompleted,
        })),
      );
    } finally {
      this.loading.set(false);
    }
  }

  async onSaveTask(task: StaffOnboardingChecklistViewModel): Promise<void> {
    if (this.busyTaskId() === task.id) return;
    this.busyTaskId.set(task.id);
    try {
      const updated =
        await this.apiResponseS.onPut<EmployeeOnboardingChecklistItemDTO>(
          Endpoints.HR.EmployeeFile.updateOnboardingChecklistTask(task.id),
          {
            isCompleted: task.draftCompleted,
            notes: task.draftNotes,
          },
          true,
        );

      if (!updated) return;

      this.tasks.update((items) =>
        items.map((item) =>
          item.id === task.id
            ? {
                ...item,
                ...updated,
                draftCompleted: updated.isCompleted,
                draftNotes: updated.notes ?? "",
              }
            : item,
        ),
      );
    } finally {
      this.busyTaskId.set(null);
    }
  }

  async onSaveAll(): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    try {
      for (const task of this.tasks()) {
        await this.onSaveTask(task);
      }

      // this.ref.close(true);
    } finally {
      // this.saving.set(false);
    }
  }

  isOverdue(task: StaffOnboardingChecklistViewModel): boolean {
    if (task.draftCompleted || !task.deadline) return false;
    const deadline = new Date(task.deadline);
    const today = new Date();
    deadline.setHours(23, 59, 59, 999);
    return deadline.getTime() < today.getTime();
  }

  getDeadlineSeverity(
    task: StaffOnboardingChecklistViewModel,
  ): "success" | "danger" {
    return this.isOverdue(task) ? "danger" : "success";
  }

  getDeadlineLabel(task: StaffOnboardingChecklistViewModel): string {
    return this.isOverdue(task) ? "Vencido" : "En tiempo";
  }

  onClose(): void {
    this.ref.close(false);
  }
}
