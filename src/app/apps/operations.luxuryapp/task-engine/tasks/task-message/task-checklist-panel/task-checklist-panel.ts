import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TaskAttachmentInterface } from "src/app/core/interfaces/tasks/task-attachment.interface";
import { TaskChecklistItemInterface } from "src/app/core/interfaces/tasks/task-checklist-item.interface";

@Component({
  selector: "app-task-checklist-panel",
  templateUrl: "./task-checklist-panel.html",
  imports: [
    FormsModule,
    WebButtonIconDelete,
    WebButtonIconViewPdf,
    WebButtonLabel,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host {
        display: block;
      }

      .task-checklist-panel__thumbnail {
        width: 4rem;
        height: 4rem;
        object-fit: cover;
      }

      .task-checklist-panel__input {
        border: 1px solid var(--surface-border);
        border-radius: var(--ds-radius-md);
        color: var(--text-primary);
        background: var(--surface-card);
      }

      .task-checklist-panel__input:focus {
        outline: 2px solid var(--primary-500);
        outline-offset: 2px;
      }

      .file-input-hidden {
        display: none;
      }
    `,
  ],
})
export class TaskChecklistPanel implements OnInit {
  tasksId = input.required<string>();

  readonly checklistItems = signal<TaskChecklistItemInterface[]>([]);
  readonly attachments = signal<TaskAttachmentInterface[]>([]);
  readonly isLoading = signal(true);
  readonly isAddingChecklistItem = signal(false);
  readonly isUploadingAttachment = signal(false);
  readonly newDescription = signal("");

  private readonly apiResponseS = inject(ApiResponseService);

  async ngOnInit() {
    await this.loadPanelData();
  }

  async loadPanelData() {
    this.isLoading.set(true);
    try {
      const [checklistItems, attachments] = await Promise.all([
        this.apiResponseS.onGetList<TaskChecklistItemInterface[]>(
          Endpoints.TaskChecklistItems.byTask(this.tasksId()),
        ),
        this.apiResponseS.onGetList<TaskAttachmentInterface[]>(
          Endpoints.TaskAttachments.byTask(this.tasksId()),
        ),
      ]);

      this.checklistItems.set(checklistItems ?? []);
      this.attachments.set(attachments ?? []);
    } finally {
      this.isLoading.set(false);
    }
  }

  async onToggleDone(item: TaskChecklistItemInterface) {
    const result = await this.apiResponseS.onPatch<TaskChecklistItemInterface>(
      Endpoints.TaskChecklistItems.toggleDone(item.id),
      {},
    );

    if (!result) return;

    this.checklistItems.update((items) =>
      items.map((current) => (current.id === item.id ? result : current)),
    );
  }

  async onAddChecklistItem() {
    const description = this.newDescription().trim();
    if (!description) return;

    this.isAddingChecklistItem.set(true);
    try {
      const result = await this.apiResponseS.onPost<TaskChecklistItemInterface>(
        Endpoints.TaskChecklistItems.base,
        {
          tasksId: this.tasksId(),
          description,
        },
      );

      if (!result) return;

      this.checklistItems.update((items) => [...items, result]);
      this.newDescription.set("");
    } finally {
      this.isAddingChecklistItem.set(false);
    }
  }

  async onDeleteChecklistItem(id: string) {
    const deleted = await this.apiResponseS.onDelete(
      Endpoints.TaskChecklistItems.delete(id),
    );

    if (deleted) {
      this.checklistItems.update((items) =>
        items.filter((item) => item.id !== id),
      );
    }
  }

  async onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement | null;
    const file = inputElement?.files?.[0];
    if (!file) return;

    this.isUploadingAttachment.set(true);
    try {
      const formData = new FormData();
      formData.append("TasksId", this.tasksId());
      formData.append("File", file);

      const result =
        await this.apiResponseS.onPostFile<TaskAttachmentInterface>(
          Endpoints.TaskAttachments.upload,
          formData,
        );

      if (result) {
        this.attachments.update((items) => [...items, result]);
      }
    } finally {
      this.isUploadingAttachment.set(false);
      if (inputElement) {
        inputElement.value = "";
      }
    }
  }

  async onDeleteAttachment(id: string) {
    const deleted = await this.apiResponseS.onDelete(
      Endpoints.TaskAttachments.delete(id),
    );

    if (deleted) {
      this.attachments.update((items) =>
        items.filter((item) => item.id !== id),
      );
    }
  }

  isPdf(item: TaskAttachmentInterface) {
    return item.mimeType === "application/pdf";
  }
}
