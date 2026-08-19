import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { LxTimeline } from "@ui/adaptive/timeline/timeline";
import { CandidateProcessStage } from "src/app/core/enums/candidate-process-stage";
import { CandidateStageHistoryItem } from "../candidate-application/interfaces/candidate-application";
import { CANDIDATE_PROCESS_STAGE_LABELS } from "./candidate-stage-labels";

@Component({
  selector: "app-candidate-stage-timeline",
  template: `<lx-timeline [events]="events()" align="left" layout="vertical" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LxTimeline],
})
export class CandidateStageTimeline {
  history = input.required<CandidateStageHistoryItem[]>();

  events = computed(() =>
    this.history()
      .slice()
      .reverse()
      .map((h) => ({
        title: `${this.stageLabel(h.fromStage)} -> ${this.stageLabel(h.toStage)}`,
        description: h.comment,
        date: this.formatDate(h.changedAt),
        badge: this.stageLabel(h.toStage),
        icon: "material-symbols-light:swap-horiz",
      })),
  );

  private stageLabel(stage: CandidateProcessStage | string | undefined): string {
    if (!stage) return "Inicio";

    if (typeof stage === "number") {
      return CANDIDATE_PROCESS_STAGE_LABELS[stage] ?? stage.toString();
    }

    return stage;
  }

  private formatDate(iso: string): string {
    if (!iso) return "";
    return new Date(iso).toLocaleString();
  }
}
