import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DynamicDialogConfig } from "@core/services/dialog-handler.service";
import { LxTag } from "@ui/adaptive/tag/tag";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

interface JobDescriptionView {
  summary: string | null;
  responsibilities: string | null;
  skills: string | null;
  additionalRequirements: string | null;
  workEnvironment: string | null;
  requiresWeekendShift: boolean;
}

@Component({
  selector: "app-vacante-job-description-modal",
  imports: [CommonModule, AppIcon, LxTag],
  templateUrl: "./vacante-job-description-modal.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [`
    :host { display: block; }
    .description-shell { display: flex; flex-direction: column; gap: 0.9rem; }
    .description-hero { padding: 1rem; border: 1px solid var(--ds-border); border-left: 4px solid var(--ds-primary); border-radius: var(--ds-radius-lg); background: linear-gradient(135deg, var(--ds-bg-surface), var(--ds-bg-sunken)); }
    .description-eyebrow { margin: 0 0 0.25rem; color: var(--ds-primary); font-size: var(--ds-font-size-xs); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
    .description-title { margin: 0; color: var(--ds-text-primary); font-size: 1.15rem; font-weight: 750; }
    .description-card { padding: 1rem; border: 1px solid var(--ds-border); border-radius: var(--ds-radius-lg); background: var(--ds-bg-surface); }
    .description-card h3 { display: flex; align-items: center; gap: 0.45rem; margin: 0 0 0.55rem; color: var(--ds-text-primary); font-size: 1rem; }
    .description-card p { margin: 0; color: var(--ds-text-primary); line-height: 1.65; white-space: pre-line; }
    .description-footer { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.85rem 1rem; border: 1px solid var(--ds-border); border-radius: var(--ds-radius-lg); background: var(--ds-bg-sunken); }
  `],
})
export class VacanteJobDescriptionModal implements OnInit {
  private readonly config = inject(DynamicDialogConfig);
  private readonly api = inject(ApiResponseService);

  readonly description = signal<JobDescriptionView | null>(null);

  ngOnInit(): void {
    const workPositionId = this.config.data?.workPositionId;
    if (workPositionId) this.loadDescription(workPositionId);
  }

  private async loadDescription(workPositionId: string): Promise<void> {
    const result = await this.api.onGetItem<JobDescriptionView>(
      Endpoints.JobDescriptions.getByWorkPosition(workPositionId),
    );
    this.description.set(result);
  }
}
