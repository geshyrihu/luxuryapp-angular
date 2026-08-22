import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { TaskJustificationInterface } from "src/app/core/interfaces/tasks/task-justification.interface";
import { WebButtonLabel } from "@ui/buttons/web-label";

const TASK_JUSTIFICATION_STATE = {
  Solicitada: 0,
  Aprobada: 1,
  Rechazada: 2,
} as const;

@Component({
  selector: "app-task-justification-panel",
  standalone: true,
  templateUrl: "./task-justification-panel.html",
  imports: [FormsModule, WebButtonLabel],
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host {
        display: block;
      }

      .task-justification-panel__input {
        border: 1px solid var(--surface-border);
        border-radius: var(--ds-radius-md);
        color: var(--text-primary);
        background: var(--surface-card);
        resize: vertical;
      }

      .task-justification-panel__input:focus {
        outline: 2px solid var(--primary-500);
        outline-offset: 2px;
      }
    `,
  ],
})
export class TaskJustificationPanel implements OnInit {
  tasksId = input.required<string>();
  assigneeId = input.required<string>();

  readonly justifications = signal<TaskJustificationInterface[]>([]);
  readonly stateLabels = signal<Map<number, string>>(new Map());
  readonly isLoading = signal(true);
  readonly isRequesting = signal(false);
  readonly newReason = signal("");

  readonly pendingJustification = computed(() =>
    this.justifications().find(
      (item) => item.state === TASK_JUSTIFICATION_STATE.Solicitada,
    ),
  );

  readonly canRequestJustification = computed(
    () =>
      this.assigneeId() === this.authS.applicationUserId &&
      !this.pendingJustification(),
  );

  readonly taskJustificationState = TASK_JUSTIFICATION_STATE;

  readonly authS = inject(AuthService);
  private readonly apiResponseS = inject(ApiResponseService);

  async ngOnInit() {
    await this.loadPanelData();
  }

  async loadPanelData() {
    this.isLoading.set(true);
    try {
      const [justifications, stateOptions] = await Promise.all([
        this.apiResponseS.onGetList<TaskJustificationInterface[]>(
          Endpoints.TaskJustifications.byTask(this.tasksId()),
        ),
        this.apiResponseS.onGetEnumSelectItem<SelectItemDto<number>[]>(
          Endpoints.SelectItems.taskJustificationState,
        ),
      ]);

      this.justifications.set(justifications ?? []);
      this.stateLabels.set(
        new Map(
          (stateOptions ?? []).map((item) => [
            item.value,
            String(item.label ?? item.value),
          ]),
        ),
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  async onRequestJustification() {
    const reason = this.newReason().trim();
    if (reason.length < 20) return;

    this.isRequesting.set(true);
    try {
      const result = await this.apiResponseS.onPost<TaskJustificationInterface>(
        Endpoints.TaskJustifications.request,
        {
          tasksId: this.tasksId(),
          reason,
        },
      );

      if (!result) return;

      this.justifications.update((items) => [...items, result]);
      this.newReason.set("");
    } finally {
      this.isRequesting.set(false);
    }
  }

  async onApprove(id: string) {
    await this.resolveJustification(Endpoints.TaskJustifications.approve(id));
  }

  async onReject(id: string) {
    await this.resolveJustification(Endpoints.TaskJustifications.reject(id));
  }

  stateLabel(state: number) {
    return this.stateLabels().get(state) ?? "Desconocido";
  }

  private async resolveJustification(endpoint: string) {
    const result = await this.apiResponseS.onPatch<TaskJustificationInterface>(
      endpoint,
      {},
    );

    if (!result) return;

    this.justifications.update((items) =>
      items.map((item) => (item.id === result.id ? result : item)),
    );
  }
}
