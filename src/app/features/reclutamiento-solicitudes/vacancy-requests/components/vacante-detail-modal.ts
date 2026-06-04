import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TabsModule } from "primeng/tabs";
import { TagModule } from "primeng/tag";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { IWorkPositionForm } from "src/app/features/work-position/models/work-position.model";

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
  imports: [CommonModule, CardModule, DividerModule, TabsModule, TagModule],
})
export class VacanteDetailModal implements OnInit {
  private config = inject(DynamicDialogConfig);
  private apiS = inject(ApiResponseService);

  workPosition = signal<IWorkPositionForm | null>(null);
  jobDescription = signal<IJobDescription | null>(null);

  dias = [
    { n: "Lunes", e: "lunesEntrada" as const, s: "lunesSalida" as const },
    { n: "Martes", e: "martesEntrada" as const, s: "martesSalida" as const },
    { n: "Miércoles", e: "miercolesEntrada" as const, s: "miercolesSalida" as const },
    { n: "Jueves", e: "juevesEntrada" as const, s: "juevesSalida" as const },
    { n: "Viernes", e: "viernesEntrada" as const, s: "viernesSalida" as const },
    { n: "Sábado", e: "sabadoEntrada" as const, s: "sabadoSalida" as const },
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
    const result = await this.apiS.onGetItem<IWorkPositionForm>(`work-positions/${id}`);
    this.workPosition.set(result);
  }

  async loadJobDescription(id: string) {
    const result = await this.apiS.onGetItem<IJobDescription>(
      Endpoints.JobDescriptions.getByWorkPosition(id),
    );
    this.jobDescription.set(result);
  }
}
