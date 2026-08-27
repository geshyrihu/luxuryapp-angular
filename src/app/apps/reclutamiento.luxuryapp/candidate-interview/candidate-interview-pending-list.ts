import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { addIcons } from "ionicons";
import { chatbubblesOutline } from "ionicons/icons";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { CandidateProcessStage } from "src/app/core/enums/candidate-process-stage";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PlatformService } from "src/app/core/services/platform.service";
import { CandidateApplicationListItem } from "../candidate-application/interfaces/candidate-application";
import { CandidateInterviewFeedbackForm } from "./candidate-interview-feedback-form";
import { CandidateInterviewPendingDesktop } from "./desktop/candidate-interview-pending-desktop";
import { CandidateInterviewFeedbackTarget } from "./interfaces/candidate-interview-feedback-target.interface";
import { CandidateInterviewPendingMobile } from "./mobile/candidate-interview-pending-mobile";

@Component({
  selector: "app-candidate-interview-pending-list",
  templateUrl: "./candidate-interview-pending-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CandidateInterviewPendingDesktop,
    CandidateInterviewPendingMobile,
    RouterLink,
  ],
})
export class CandidateInterviewPendingList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);
  route = inject(ActivatedRoute);
  authS = inject(AuthService);

  dataSignal = signal<CandidateApplicationListItem[]>([]);

  readonly globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  readonly isMyPendingMode = computed(
    () => this.route.snapshot.queryParamMap.get("myPending") === "true",
  );
  readonly respondApplicationId = computed(
    () => this.route.snapshot.queryParamMap.get("applicationId") ?? "",
  );
  readonly isRespondMode = computed(
    () => this.route.snapshot.queryParamMap.get("action") === "respond",
  );
  readonly currentUserId = computed(() => this.authS.applicationUserId ?? "");

  readonly filteredData = computed(() => {
    const data = this.dataSignal();
    if (this.isMyPendingMode()) {
      return data.filter(
        (item) => item.assignedInterviewerUserId === this.currentUserId(),
      );
    }
    return data;
  });

  constructor() {
    addIcons({ chatbubblesOutline });
  }

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<CandidateApplicationListItem[]>(
        EndpointsReclutamiento.CandidateProcesses.listByStage(
          CandidateProcessStage.EntrevistaOperaciones,
        ),
        { page: 1, recordsNumber: 200 },
      )
      .then((result) => {
        this.dataSignal.set(result ?? []);
      });
  }

  onFeedback(target: CandidateInterviewFeedbackTarget) {
    this.dialogHandlerS
      .openDialog(
        CandidateInterviewFeedbackForm,
        {
          candidateApplicationId: target.candidateApplicationId,
          candidateProcessId: target.candidateProcessId ?? undefined,
        },
        "Retroalimentacion de entrevista",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }
}
