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
import { DynamicDialogConfig } from "primeng/dynamicdialog";

import { LxTag } from "@ui/adaptive/tag/tag";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { IWorkPositionForm } from 'src/app/apps/reclutamiento.luxuryapp/estructura-organizacional/work-position/interfaces/work-position.model';

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

  workPosition = signal<IWorkPositionForm | null>(null);
  jobDescription = signal<IJobDescription | null>(null);

  dias = [
    { n: "Lunes", e: "lunesEntrada" as const, s: "lunesSalida" as const },
    { n: "Martes", e: "martesEntrada" as const, s: "martesSalida" as const },
    {
      n: "Miórcoles",
      e: "miercolesEntrada" as const,
      s: "miercolesSalida" as const,
    },
    { n: "Jueves", e: "juevesEntrada" as const, s: "juevesSalida" as const },
    { n: "Viernes", e: "viernesEntrada" as const, s: "viernesSalida" as const },
    { n: "Sóbado", e: "sabadoEntrada" as const, s: "sabadoSalida" as const },
    { n: "Domingo", e: "domingoEntrada" as const, s: "domingoSalida" as const },
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
