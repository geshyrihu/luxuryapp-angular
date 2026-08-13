import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  OnInit,
  signal,
} from "@angular/core";
import { LxDivider } from "@ui/adaptive/divider/divider";
import { LxTabs } from "@ui/adaptive/tabs/tabs";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { CandidateApplicationStage } from "src/app/core/enums/candidate-application-stage";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogConfig,
} from "src/app/core/services/dialog-handler.service";
import { CandidateApplicationForm } from "../candidate-application/candidate-application-form";
import { CandidateProcessHiringModal } from "../candidate-application/candidate-process-hiring-modal";
import { CandidateApplicationListItem } from "../candidate-application/interfaces/candidate-application";
import { CandidateStageBadge } from "../recruitment-shared/candidate-stage-badge";
import { CandidateDetail as CandidateDetailDto } from "./interfaces/candidate.dto";

@Component({
  selector: "app-candidate-detail",
  templateUrl: "./candidate-detail.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [CommonModule, LxTabs, LxDivider, CandidateStageBadge, WebButtonLabel],
})
export class CandidateDetail implements OnInit {
  private config = inject(DynamicDialogConfig);
  private apiS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);

  activeTab = model<string>("datos");
  tabs = [
    { id: "datos", label: "Datos" },
    { id: "procesos", label: "Procesos" },
  ];

  onTabChange(tab: { id: string; label: string }) {
    this.activeTab.set(tab.id);
  }

  detail = signal<CandidateDetailDto | null>(null);
  applications = signal<CandidateApplicationListItem[]>([]);

  ngOnInit() {
    const id = this.config.data?.id;
    if (id) {
      this.loadCandidate(id);
      this.loadApplications(id);
    }
  }

  async loadCandidate(id: string) {
    const result = await this.apiS.onGetItem<CandidateDetailDto>(
      EndpointsReclutamiento.Candidates.getById(id),
    );
    if (result) {
      this.detail.set(result);
      if (result.applications) this.applications.set(result.applications);
    }
  }

  async loadApplications(candidateId: string) {
    const result = await this.apiS.onGetItem<CandidateDetailDto>(
      EndpointsReclutamiento.Candidates.getById(candidateId),
    );
    if (result?.applications) this.applications.set(result.applications);
  }

  onAddApplication() {
    this.dialogHandlerS
      .openDialog(
        CandidateApplicationForm,
        {
          id: "",
          title: "Asignar vacante e iniciar entrevista",
          candidateId: this.config.data?.id,
          allowCreateCandidate: false,
        },
        "Asignar vacante e iniciar entrevista",
        this.dialogHandlerS.sizeLg,
      )
      .then((created: boolean) => {
        if (created) this.loadApplications(this.config.data?.id);
      });
  }

  onProcessHiring(app: CandidateApplicationListItem) {
    this.dialogHandlerS
      .openDialog(
        CandidateProcessHiringModal,
        {
          id: app.id,
          candidateProcessId: app.candidateProcessId ?? undefined,
          toStage: CandidateApplicationStage.AltaEnProceso,
        },
        "Procesar alta",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.loadApplications(this.config.data?.id);
      });
  }

  isSelected(stage: CandidateApplicationStage): boolean {
    return stage === CandidateApplicationStage.Seleccionado;
  }
}
