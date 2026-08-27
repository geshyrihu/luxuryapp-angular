import { CommonModule, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxAvatar } from "@ui/adaptive/avatar/avatar";
import { LxTag } from "@ui/adaptive/tag/tag";
import { TimelineModule } from "primeng/timeline";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DynamicDialogConfig } from "src/app/core/services/dialog-handler.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

interface VacancyTimelineDialogData {
  requestPositionId: string;
  vacancyFolio?: string;
}

interface VacancyTimelineEvent {
  stageName: string;
  fromStageName: string;
  eventDate?: string | null;
  createdAt?: string | null;
  markerColor: string;
  comment: string;
  changedBy: string;
}

interface VacancyCandidateTimeline {
  candidateProcessId: string;
  candidateName: string;
  photoUrl: string;
  registerDate?: string | null;
  createdAt?: string | null;
  events: VacancyTimelineEvent[];
}

@Component({
  selector: "app-vacancy-candidates-timeline-modal",
  templateUrl: "./vacancy-candidates-timeline-modal.html",
  styleUrl: "./vacancy-candidates-timeline-modal.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DatePipe, LxAvatar, LxTag, TimelineModule, AppIcon],
})
export class VacancyCandidatesTimelineModal implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly config = inject(DynamicDialogConfig);

  readonly dialogData = this.config.data as VacancyTimelineDialogData;
  readonly loading = signal(false);
  readonly candidateTimelines = signal<VacancyCandidateTimeline[]>([]);

  async ngOnInit(): Promise<void> {
    await this.loadTimeline();
  }

  private async loadTimeline(): Promise<void> {
    if (!this.dialogData.requestPositionId) return;

    this.loading.set(true);
    try {
      const candidates = await this.apiResponseS.onGetList<
        VacancyCandidateTimeline[]
      >(
        EndpointsReclutamiento.CandidateProcesses.timelineByVacancy(
          this.dialogData.requestPositionId,
        ),
      );

      this.candidateTimelines.set(candidates ?? []);
    } finally {
      this.loading.set(false);
    }
  }
}
