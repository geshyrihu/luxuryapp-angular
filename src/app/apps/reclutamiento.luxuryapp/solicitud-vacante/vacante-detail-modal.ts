import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxDivider } from "@ui/adaptive/divider/divider";
import { LxTabs } from "@ui/adaptive/tabs/tabs";
import { DynamicDialogConfig } from "src/app/core/services/dialog-handler.service";

import { LxTag } from "@ui/adaptive/tag/tag";
import { IWorkPositionForm } from "src/app/apps/reclutamiento.luxuryapp/work-position/interfaces/work-position.model";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { WorkSchedulePresentationService } from "src/app/core/services/work-schedule-presentation.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

interface IJobDescription {
  summary: string;
  responsibilities: string;
  skills: string;
  additionalRequirements: string;
  workEnvironment: string;
  requiresWeekendShift: boolean;
}

@Component({
  selector: "app-vacante-detail-modal",
  templateUrl: "./vacante-detail-modal.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule, LxTabs, LxTag, AppIcon, LxDivider],
})
export class VacanteDetailModal implements OnInit {
  private config = inject(DynamicDialogConfig);

  activeTab = signal("horarios");
  tabs = [
    { id: "horarios", label: "Horarios" },
    { id: "descripcion", label: "Descripción del puesto" },
    { id: "prestaciones", label: "Prestaciones y observaciones" },
  ];
  private apiS = inject(ApiResponseService);
  readonly schedulePresentationS = inject(WorkSchedulePresentationService);

  workPosition = signal<IWorkPositionForm | null>(null);
  jobDescription = signal<IJobDescription | null>(null);

  dias = [
    { n: "Lunes", dw: 1 },
    { n: "Martes", dw: 2 },
    { n: "Miércoles", dw: 3 },
    { n: "Jueves", dw: 4 },
    { n: "Viernes", dw: 5 },
    { n: "Sábado", dw: 6 },
    { n: "Domingo", dw: 0 },
  ];

  ngOnInit() {
    const id = this.config.data?.workPositionId;
    if (id) {
      this.loadWorkPosition(id);
      this.loadJobDescription(id);
    }
  }

  async loadWorkPosition(id: string) {
    const result = await this.apiS.onGetItem<IWorkPositionForm>(
      `work-positions/${id}`,
    );
    this.workPosition.set(result);
  }

  async loadJobDescription(id: string) {
    const result = await this.apiS.onGetItem<IJobDescription>(
      Endpoints.JobDescriptions.getByWorkPosition(id),
    );
    this.jobDescription.set(result);
  }
}
