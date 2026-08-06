import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { LxTimeline } from "@ui/adaptive/timeline/timeline";
import { CandidateApplicationStage } from "src/app/core/enums/candidate-application-stage";
import { candidateStageLabel } from "./candidate-stage-labels";
import { CandidateStageHistoryItem } from "../candidate-application/interfaces/candidate-application";

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
        title: `${this.stageLabel(h.fromStage)} → ${this.stageLabel(h.toStage)}`,
        description: h.comment,
        date: this.formatDate(h.changedAt),
        badge: this.stageLabel(h.toStage),
        icon: "mdi:swap-horizontal",
      })),
  );

  private stageLabel(stage: CandidateApplicationStage | undefined): string {
    if (stage === undefined || stage === null) return "Inicio";
    return candidateStageLabel(stage);
  }

  private formatDate(iso: string): string {
    if (!iso) return "";
    return new Date(iso).toLocaleString();
  }
}