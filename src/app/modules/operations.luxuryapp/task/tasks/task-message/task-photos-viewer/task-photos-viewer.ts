import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DynamicDialogConfig } from "@core/services/dialog-handler.service";
import { LxImage } from "@ui/adaptive/image/image";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { AppSpinner } from "@ui/web/spinner/spinner";
import { TaskAdditionalImage } from "../../shared/interfaces/task-refactor.interface";

export type TaskPhotosViewerMode = "before-after" | "additional";

@Component({
  selector: "app-task-photos-viewer",
  templateUrl: "./task-photos-viewer.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AppIcon, AppSpinner, LxImage],
  styles: [
    `
      .photos-label {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--ds-text-secondary, #6c757d);
        margin-bottom: 0.5rem;
      }
      :host ::ng-deep .photos-trigger {
        display: block;
        width: 100%;
      }
      :host ::ng-deep .photos-preview {
        display: block;
        width: 100%;
        max-height: 70vh;
        object-fit: contain;
        border-radius: 0.5rem;
        border: 1px solid var(--ds-border, #dee2e6);
      }
      .photos-figure {
        display: flex;
        flex-direction: column;
        width: 14rem;
        max-width: 100%;
      }
      :host ::ng-deep .photos-thumb {
        display: block;
        width: 100%;
        max-height: 12rem;
        object-fit: contain;
        border-radius: 0.5rem;
        border: 1px solid var(--ds-border, #dee2e6);
      }
      .photos-caption {
        font-size: 0.75rem;
        color: var(--ds-text-secondary, #6c757d);
        margin-top: 0.25rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .photos-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 7rem;
        border: 1px dashed var(--ds-border, #dee2e6);
        border-radius: 0.5rem;
        color: var(--ds-text-secondary, #6c757d);
      }
      .photos-empty-icon {
        font-size: 1.75rem;
        margin-bottom: 0.5rem;
      }
    `,
  ],
})
export class TaskPhotosViewer implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly config = inject(DynamicDialogConfig);

  readonly mode: TaskPhotosViewerMode =
    this.config.data?.mode ?? "before-after";
  readonly beforeWork: string | null = this.config.data?.beforeWork ?? null;
  readonly afterWork: string | null = this.config.data?.afterWork ?? null;
  private readonly taskId: string = this.config.data?.taskId ?? "";

  readonly loading = signal(false);
  readonly additionalImages = signal<TaskAdditionalImage[]>([]);

  async ngOnInit(): Promise<void> {
    if (this.mode !== "additional" || !this.taskId) return;

    this.loading.set(true);
    try {
      const result = await this.apiResponseS.onGetList<TaskAdditionalImage[]>(
        Endpoints.TaskAdditionalImages.list(this.taskId),
      );
      this.additionalImages.set(result ?? []);
    } catch {
      this.additionalImages.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
