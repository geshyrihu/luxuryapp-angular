import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { addIcons } from "ionicons";
import { chatbubblesOutline } from "ionicons/icons";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { CandidateApplicationStage } from "src/app/core/enums/candidate-application-stage";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PlatformService } from "src/app/core/services/platform.service";
import { CandidateApplicationListItem } from "../candidate-application/interfaces/candidate-application";
import { CandidateInterviewFeedbackForm } from "./candidate-interview-feedback-form";
import { CandidateInterviewPendingDesktop } from "./desktop/candidate-interview-pending-desktop";
import { CandidateInterviewPendingMobile } from "./mobile/candidate-interview-pending-mobile";

@Component({
  selector: "app-candidate-interview-pending-list",
  standalone: true,
  templateUrl: "./candidate-interview-pending-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CandidateInterviewPendingDesktop, CandidateInterviewPendingMobile],
})
export class CandidateInterviewPendingList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);

  dataSignal = signal<CandidateApplicationListItem[]>([]);

  readonly globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  constructor() {
    addIcons({ chatbubblesOutline });
  }

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const stages = [
      CandidateApplicationStage.EntrevistaReclutamiento,
      CandidateApplicationStage.EntrevistaOperaciones,
    ];
    const tasks = stages.map((stage) =>
      this.apiResponseS.onGetList<CandidateApplicationListItem[]>(
        EndpointsReclutamiento.CandidateApplications.listByStage(stage),
        { page: 1, recordsNumber: 200 },
      ),
    );

    Promise.all(tasks).then((results) => {
      const merged: CandidateApplicationListItem[] = [];
      results.forEach((r) => {
        if (r) merged.push(...r);
      });
      this.dataSignal.set(merged);
    });
  }

  onFeedback(candidateApplicationId: string) {
    this.dialogHandlerS
      .openDialog(
        CandidateInterviewFeedbackForm,
        { candidateApplicationId },
        "Retroalimentación de entrevista",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }
}
