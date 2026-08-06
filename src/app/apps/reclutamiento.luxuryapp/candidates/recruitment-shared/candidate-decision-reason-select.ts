import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CandidateDecision } from "src/app/core/enums/candidate-decision";
import { FormControl } from "@angular/forms";

interface DecisionReasonOption {
  value: string;
  label: string;
  appliesToDecision: number;
}

@Component({
  selector: "app-candidate-decision-reason-select",
  standalone: true,
  template: `
    <custom-input-select-signal
      [control]="control"
      label="Motivo de la decisión"
      [data]="reasons()"
      [filter]="true"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CustomInputSelectSignal],
})
export class CandidateDecisionReasonSelect implements OnInit {
  private apiS = inject(ApiResponseService);

  control = input.required<FormControl>();
  decision = input<CandidateDecision | null>(null);

  private allReasons = signal<DecisionReasonOption[]>([]);
  reasons = computed(() => {
    const decision = this.decision();
    return this.allReasons().filter((r) => r.appliesToDecision === decision);
  });

  ngOnInit(): void {
    this.loadReasons();
  }

  async loadReasons() {
    const result = await this.apiS.onGetList<
      { id: string; name: string; appliesToDecision: number; isActive: boolean }[]
    >(EndpointsReclutamiento.CandidateDecisionReasons.catalog, {
      page: 1,
      recordsNumber: 200,
    });
    if (result) {
      this.allReasons.set(
        result
          .filter((r) => r.isActive)
          .map((r) => ({
            value: r.id,
            label: r.name,
            appliesToDecision: r.appliesToDecision,
          })),
      );
    }
  }
}
