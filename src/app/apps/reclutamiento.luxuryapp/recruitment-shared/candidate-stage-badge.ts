import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import {
  CANDIDATE_PROCESS_STAGE_CLASSES,
  CANDIDATE_PROCESS_STAGE_LABELS,
} from "./candidate-stage-labels";

@Component({
  selector: "app-candidate-stage-badge",
  template: `<span
    class="inline-flex font-bold text-xs px-2 py-1 border-round"
    [ngClass]="class()"
  >
    {{ label() }}
  </span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class CandidateStageBadge {
  stage = input.required<number | null | undefined>();

  protected label = computed(() => {
    const stage = this.stage();
    if (stage === null || stage === undefined) return "Sin etapa";
    return CANDIDATE_PROCESS_STAGE_LABELS[stage] ?? "Sin etapa";
  });

  protected class = computed(() => {
    const stage = this.stage();
    if (stage === null || stage === undefined)
      return "bg-gray-200 text-gray-600";
    return (
      CANDIDATE_PROCESS_STAGE_CLASSES[stage] ?? "bg-gray-200 text-gray-600"
    );
  });
}
