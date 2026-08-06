import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { CandidateApplicationStage } from "src/app/core/enums/candidate-application-stage";
import {
  CANDIDATE_STAGE_CLASSES,
  CANDIDATE_STAGE_LABELS,
} from "./candidate-stage-labels";

@Component({
  selector: "app-candidate-stage-badge",
  standalone: true,
  template: `<span class="inline-flex font-bold text-xs px-2 py-1 border-round" [class]="class()">
    {{ label() }}
  </span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class CandidateStageBadge {
  stage = input.required<CandidateApplicationStage | null | undefined>();

  protected label = computed(() => {
    const stage = this.stage();
    if (stage === null || stage === undefined) return "Sin etapa";
    return CANDIDATE_STAGE_LABELS[stage] ?? "Sin etapa";
  });

  protected class = computed(() => {
    const stage = this.stage();
    if (stage === null || stage === undefined) return "bg-gray-200 text-gray-600";
    return CANDIDATE_STAGE_CLASSES[stage] ?? "bg-gray-200 text-gray-600";
  });
}
