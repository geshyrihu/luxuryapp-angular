import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxTabs } from "@ui/adaptive/tabs/tabs";
import { DynamicDialogConfig } from "@core/services/dialog-handler.service";

import { LxTag } from "@ui/adaptive/tag/tag";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { IWorkPositionForm } from "@operations.luxuryapp/work-positions/interfaces/work-position.model";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

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
  imports: [CommonModule, LxTabs, LxTag, AppIcon],
  styles: [`
    :host { display: block; }
    :host ::ng-deep app-tabs > .nav.nav-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid var(--ds-border);
    }
    :host ::ng-deep app-tabs > .nav.nav-tabs .nav-link {
      border: 0;
      border-bottom: 2px solid transparent;
      border-radius: var(--ds-radius-sm, 0.25rem) var(--ds-radius-sm, 0.25rem) 0 0;
      color: var(--ds-text-secondary);
      font-size: var(--ds-font-size-sm);
      font-weight: 600;
      padding: 0.65rem 0.85rem;
    }
    :host ::ng-deep app-tabs > .nav.nav-tabs .nav-link:hover,
    :host ::ng-deep app-tabs > .nav.nav-tabs .nav-link.active {
      background: var(--ds-bg-sunken);
      border-bottom-color: var(--ds-primary);
      color: var(--ds-primary);
    }
    .vacancy-detail-shell { display: flex; flex-direction: column; gap: 1rem; }
    .vacancy-detail-hero {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid var(--ds-border);
      border-left: 4px solid var(--ds-primary);
      border-radius: var(--ds-radius-lg);
      background: linear-gradient(135deg, var(--ds-bg-surface), var(--ds-bg-sunken));
    }
    .vacancy-detail-eyebrow {
      margin: 0 0 0.25rem;
      color: var(--ds-primary);
      font-size: var(--ds-font-size-xs);
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .vacancy-detail-title { margin: 0; color: var(--ds-text-primary); font-size: 1.2rem; font-weight: 750; }
    .vacancy-detail-subtitle { margin: 0.25rem 0 0; color: var(--ds-text-secondary); font-size: var(--ds-font-size-sm); }
    .vacancy-detail-meta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.75rem; }
    .vacancy-detail-stat { padding: 0.75rem; border: 1px solid var(--ds-border); border-radius: var(--ds-radius-md); background: var(--ds-bg-surface); }
    .vacancy-detail-stat-label { color: var(--ds-text-secondary); font-size: var(--ds-font-size-xs); }
    .vacancy-detail-stat-value { margin-top: 0.2rem; color: var(--ds-text-primary); font-weight: 650; }
    .vacancy-detail-card { padding: 1rem; border: 1px solid var(--ds-border); border-radius: var(--ds-radius-lg); background: var(--ds-bg-surface); }
    .vacancy-detail-card-title { display: flex; align-items: center; gap: 0.5rem; margin: 0 0 0.75rem; color: var(--ds-text-primary); font-size: 1rem; font-weight: 700; }
    .vacancy-detail-copy { margin: 0; color: var(--ds-text-primary); line-height: 1.65; white-space: pre-line; }
    .benefit-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.75rem; }
    .benefit-item { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.7rem 0.8rem; border: 1px solid var(--ds-border); border-radius: var(--ds-radius-md); background: var(--ds-bg-sunken); }
    .benefit-label { color: var(--ds-text-secondary); font-size: var(--ds-font-size-sm); }
    .benefit-value { color: var(--ds-text-primary); font-weight: 650; text-align: right; }
    .schedule-meta { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.9rem; }
    .schedule-meta-item { padding: 0.45rem 0.7rem; border: 1px solid var(--ds-border); border-radius: 999px; background: var(--ds-bg-sunken); color: var(--ds-text-secondary); font-size: var(--ds-font-size-sm); }
    .schedule-meta-item strong { color: var(--ds-text-primary); }
    .schedule-scroll { overflow-x: auto; padding-bottom: 0.25rem; }
    .schedule-grid { display: grid; grid-template-columns: 6.5rem repeat(7, minmax(7rem, 1fr)); min-width: 58rem; border: 1px solid var(--ds-border); border-radius: var(--ds-radius-md); overflow: hidden; }
    .schedule-cell { min-height: 4.25rem; padding: 0.55rem; border-right: 1px solid var(--ds-border); border-bottom: 1px solid var(--ds-border); background: var(--ds-bg-surface); }
    .schedule-cell:nth-child(8n) { border-right: 0; }
    .schedule-header { min-height: auto; background: var(--ds-primary); color: var(--ds-on-primary); font-size: var(--ds-font-size-xs); font-weight: 700; text-align: center; text-transform: uppercase; }
    .schedule-week { display: flex; align-items: center; justify-content: center; background: var(--ds-bg-sunken); color: var(--ds-text-primary); font-size: var(--ds-font-size-xs); font-weight: 700; }
    .schedule-worked { background: color-mix(in srgb, var(--ds-success) 8%, var(--ds-bg-surface)); }
    .schedule-rest { display: flex; align-items: center; justify-content: center; color: var(--ds-text-muted); font-size: var(--ds-font-size-xs); font-style: italic; }
    .schedule-time { color: var(--ds-text-primary); font-size: var(--ds-font-size-sm); font-weight: 650; white-space: nowrap; }
    .schedule-time span { color: var(--ds-text-secondary); margin: 0 0.15rem; }
    @media (max-width: 768px) {
      .vacancy-detail-hero { flex-direction: column; }
      .vacancy-detail-meta, .benefit-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 480px) {
      .vacancy-detail-meta, .benefit-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class VacanteDetailModal implements OnInit {
  private config = inject(DynamicDialogConfig);

  activeTab = signal("horarios");
  tabs = [
    { id: "resumen", label: "Resumen" },
    { id: "horarios", label: "Horarios" },
    { id: "descripcion", label: "Descripción del puesto" },
    { id: "prestaciones", label: "Prestaciones" },
  ];
  private apiS = inject(ApiResponseService);
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

  semanas = [1, 2, 3, 4];

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

  scheduleCell(week: number, day: number) {
    return this.workPosition()?.diasDeTrabajo?.find(
      (item) => item.numeroSemanaCiclo === week && item.diaSemana === day,
    );
  }

  stateLabel(state: number | boolean | null | undefined): string {
    return state === 0 || state === true ? "Activo" : "Inactivo";
  }
}


