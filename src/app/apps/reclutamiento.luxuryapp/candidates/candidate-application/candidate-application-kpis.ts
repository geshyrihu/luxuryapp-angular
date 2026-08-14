import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { ChartWrapper } from "@ui/web/charts/chart-wrapper";
import { ChartJsData } from "@ui/web/charts/echarts-adapters";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import {
  MappedPTag,
  MappedTagOption,
} from "../recruitment-shared/mapped-p-tag";
import { CandidateApplicationKpisDto } from "./interfaces/candidate-application";
import { LxSpinner } from "src/app/shared/ui/adaptive/spinner/spinner";

@Component({
  selector: "app-candidate-application-kpis",
  standalone: true,
  templateUrl: "./candidate-application-kpis.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    WebButtonLabel,
    TableModule,
    MappedPTag,
    ChartWrapper,
    AppIcon,
    LxSpinner,
  ],
})
export class CandidateApplicationKpis implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private router = inject(Router);

  kpis = signal<CandidateApplicationKpisDto | null>(null);
  loading = signal(true);

  readonly statusOptions: MappedTagOption[] = [
    { value: "critical", label: "Crítico", severity: "danger" },
    { value: "warning", label: "Atención", severity: "warn" },
    { value: "good", label: "OK", severity: "success" },
    { value: "neutral", label: "Info", severity: "info" },
  ];

  readonly kpiCards = computed(() => {
    const k = this.kpis();
    if (!k) return [];

    return [
      {
        title: "Vacantes abiertas",
        value: k.vacantesAbiertas,
        subtitle: `${k.porcentajeVacantesConPostulacion}% con postulación`,
        icon: "material-symbols-light:work-outline",
        severity:
          k.vacantesSinPostulacion > k.vacantesAbiertas * 0.5
            ? "danger"
            : k.vacantesSinPostulacion > 0
              ? "warn"
              : "success",
        route: "/recruitment/requests/vacancies",
      },
      {
        title: "Vacantes sin postulación",
        value: k.vacantesSinPostulacion,
        subtitle:
          k.vacantesSinPostulacion > 0
            ? "Requieren atención"
            : "Todas cubiertas",
        icon: "material-symbols-light:work-history",
        severity: k.vacantesSinPostulacion > 0 ? "danger" : "success",
        route: "/recruitment/requests/vacancies",
      },
      {
        title: "Postulaciones activas",
        value: k.postulacionesActivas,
        subtitle: `Últimos 7 días: ${k.postulacionesUltimos7Dias}`,
        icon: "material-symbols-light:description",
        severity: "info",
        route: "/recruitment/candidates/applications",
      },
      {
        title: "En Entrevista Operaciones",
        value: k.postulacionesEnEntrevistaOperaciones,
        subtitle: `Sin entrevistador: ${k.entrevistasOperacionesSinEntrevistador} | Pend. agenda: ${k.entrevistasOperacionesPendientesAgenda}`,
        icon: "material-symbols-light:record-voice-over",
        severity:
          k.entrevistasOperacionesSinEntrevistador > 0 ||
          k.entrevistasOperacionesPendientesAgenda > 0
            ? "warn"
            : "info",
        route: "/recruitment/candidates/recruitment-agenda",
      },
      {
        title: "Vencidas / Overdue",
        value: k.entrevistasOperacionesVencidas,
        subtitle:
          k.entrevistasOperacionesVencidas > 0
            ? "Acción inmediata"
            : "Sin vencidas",
        icon: "material-symbols-light:error-outline",
        severity: k.entrevistasOperacionesVencidas > 0 ? "danger" : "success",
        route: "/recruitment/candidates/recruitment-agenda",
      },
      {
        title: "Tasa de selección",
        value: `${k.tasaSeleccion}%`,
        subtitle: `${k.postulacionesContratadas} contratados de ${k.postulacionesContratadas + k.postulacionesRechazadasONoPresentadas} cerradas`,
        icon: "material-symbols-light:check-circle-outline",
        severity:
          k.tasaSeleccion >= 30
            ? "success"
            : k.tasaSeleccion >= 15
              ? "info"
              : "warn",
        route: "/recruitment/candidates/applications",
      },
      // V2-F2: Tiempo Vacante -> Primera Postulacion
      {
        title: "Tiempo Vacante → 1ª Postulación (Prom.)",
        value:
          k.promedioDiasVacanteAPrimeraPostulacion !== null
            ? `${k.promedioDiasVacanteAPrimeraPostulacion} días`
            : "N/A",
        subtitle: `Mediana: ${k.medianaDiasVacanteAPrimeraPostulacion ?? "N/A"} | P90: ${k.percentil90DiasVacanteAPrimeraPostulacion ?? "N/A"} | SLA ≤7d: ${k.porcentajeVacantesEnSla}%`,
        icon: "material-symbols-light:timer-outline",
        severity:
          k.porcentajeVacantesEnSla >= 80
            ? "success"
            : k.porcentajeVacantesEnSla >= 50
              ? "info"
              : "warn",
        route: "/recruitment/candidates/applications",
      },
      {
        title: "Vacantes en SLA (≤7 días)",
        value: `${k.vacantesConPostulacionEnSla} / ${k.vacantesConPostulacion}`,
        subtitle: `${k.porcentajeVacantesEnSla}% de vacantes con postulación`,
        icon: "material-symbols-light:track-changes",
        severity:
          k.porcentajeVacantesEnSla >= 80
            ? "success"
            : k.porcentajeVacantesEnSla >= 50
              ? "info"
              : "warn",
        route: "/recruitment/candidates/applications",
      },
    ];
  });

  readonly pipelineStages = computed(() => {
    const k = this.kpis();
    if (!k) return [];

    return [
      { label: "Nuevo", value: k.postulacionesEnNuevo, color: "info" },
      { label: "Pre-Filtro", value: k.postulacionesEnPreFiltro, color: "info" },
      { label: "En Espera", value: k.postulacionesEnEspera, color: "warn" },
      {
        label: "Entrevista Reclut.",
        value: k.postulacionesEnEntrevistaReclutamiento,
        color: "primary",
      },
      {
        label: "Entrevista Ops.",
        value: k.postulacionesEnEntrevistaOperaciones,
        color: "warn",
      },
      {
        label: "Seleccionado",
        value: k.postulacionesSeleccionadas,
        color: "success",
      },
      {
        label: "Alta en Proceso",
        value: k.postulacionesAltaEnProceso,
        color: "primary",
      },
      {
        label: "Contratado",
        value: k.postulacionesContratadas,
        color: "success",
      },
      {
        label: "Rechazado/No se presentó",
        value: k.postulacionesRechazadasONoPresentadas,
        color: "danger",
      },
    ];
  });

  readonly agendaBreakdown = computed(() => {
    const k = this.kpis();
    if (!k) return [];

    const total = k.postulacionesEnEntrevistaOperaciones;
    if (total === 0) return [];

    return [
      {
        label: "Agendadas",
        value: k.entrevistasOperacionesAgendadas,
        pct:
          total > 0
            ? Math.round((k.entrevistasOperacionesAgendadas / total) * 100)
            : 0,
        severity: "info",
      },
      {
        label: "Con feedback",
        value: k.entrevistasOperacionesConFeedback,
        pct:
          total > 0
            ? Math.round((k.entrevistasOperacionesConFeedback / total) * 100)
            : 0,
        severity: "success",
      },
      {
        label: "Pend. agenda",
        value: k.entrevistasOperacionesPendientesAgenda,
        pct:
          total > 0
            ? Math.round(
                (k.entrevistasOperacionesPendientesAgenda / total) * 100,
              )
            : 0,
        severity: "contrast",
      },
      {
        label: "Sin entrevistador",
        value: k.entrevistasOperacionesSinEntrevistador,
        pct:
          total > 0
            ? Math.round(
                (k.entrevistasOperacionesSinEntrevistador / total) * 100,
              )
            : 0,
        severity: "warn",
      },
      {
        label: "Vencidas",
        value: k.entrevistasOperacionesVencidas,
        pct:
          total > 0
            ? Math.round((k.entrevistasOperacionesVencidas / total) * 100)
            : 0,
        severity: "danger",
      },
    ];
  });

  readonly fuenteTable = computed(() => {
    const k = this.kpis();
    if (!k?.porFuente?.length) return [];
    return k.porFuente;
  });

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.loading.set(true);
    this.apiResponseS
      .onGetItem<CandidateApplicationKpisDto>(
        EndpointsReclutamiento.CandidateProcesses.kpis,
      )
      .then((result) => {
        if (result) {
          this.kpis.set(result);
        }
        this.loading.set(false);
      })
      .catch(() => this.loading.set(false));
  }

  async runAutomation() {
    try {
      await this.apiResponseS.onPost(
        EndpointsReclutamiento.CandidateApplications.runAutomation,
        {},
      );
      this.onLoadData();
    } catch {
      // error ya manejado por ApiResponseService
    }
  }

  navigate(route: string) {
    void this.router.navigateByUrl(route);
  }

  getStageSeverity(
    count: number,
    total: number,
  ): "success" | "info" | "warn" | "danger" | "contrast" {
    if (total === 0) return "info";
    const pct = count / total;
    if (pct > 0.3) return "warn";
    if (pct > 0.15) return "info";
    return "success";
  }

  // ===== CHARTS DATA =====

  readonly pipelineChartData = computed<ChartJsData | null>(() => {
    const k = this.kpis();
    if (!k) return null;
    return {
      labels: [
        "Nuevo",
        "Pre-Filtro",
        "En Espera",
        "Entrevista Reclut.",
        "Entrevista Ops.",
        "Seleccionado",
        "Alta en Proceso",
        "Contratado",
        "Rechazado/No se presentó",
      ],
      datasets: [
        {
          label: "Postulaciones",
          data: [
            k.postulacionesEnNuevo,
            k.postulacionesEnPreFiltro,
            k.postulacionesEnEspera,
            k.postulacionesEnEntrevistaReclutamiento,
            k.postulacionesEnEntrevistaOperaciones,
            k.postulacionesSeleccionadas,
            k.postulacionesAltaEnProceso,
            k.postulacionesContratadas,
            k.postulacionesRechazadasONoPresentadas,
          ],
          backgroundColor: [
            "var(--blue-500)",
            "var(--blue-500)",
            "var(--yellow-500)",
            "var(--purple-500)",
            "var(--yellow-500)",
            "var(--green-500)",
            "var(--purple-500)",
            "var(--green-600)",
            "var(--red-500)",
          ],
        },
      ],
    };
  });

  readonly interviewStatusChartData = computed<ChartJsData | null>(() => {
    const k = this.kpis();
    if (!k || k.postulacionesEnEntrevistaOperaciones === 0) return null;
    const total = k.postulacionesEnEntrevistaOperaciones;
    return {
      labels: [
        "Agendadas",
        "Con retroalimentación",
        "Pend. agenda",
        "Sin entrevistador",
        "Vencidas",
      ],
      datasets: [
        {
          label: "Entrevistas",
          data: [
            k.entrevistasOperacionesAgendadas,
            k.entrevistasOperacionesConFeedback,
            k.entrevistasOperacionesPendientesAgenda,
            k.entrevistasOperacionesSinEntrevistador,
            k.entrevistasOperacionesVencidas,
          ],
          backgroundColor: [
            "var(--blue-500)",
            "var(--green-500)",
            "var(--gray-500)",
            "var(--yellow-500)",
            "var(--red-500)",
          ],
        },
      ],
    };
  });

  readonly timeToFirstChartData = computed<ChartJsData | null>(() => {
    const k = this.kpis();
    if (!k || k.promedioDiasVacanteAPrimeraPostulacion === null) return null;
    const sla = 7;
    const promedio = k.promedioDiasVacanteAPrimeraPostulacion;
    const mediana = k.medianaDiasVacanteAPrimeraPostulacion ?? promedio;
    const p90 = k.percentil90DiasVacanteAPrimeraPostulacion ?? promedio;
    return {
      labels: ["Promedio", "Mediana", "P90", "SLA objetivo"],
      datasets: [
        {
          label: "Días",
          data: [promedio, mediana, p90, sla],
          backgroundColor: [
            promedio <= sla
              ? "var(--green-500)"
              : promedio <= sla * 2
                ? "var(--yellow-500)"
                : "var(--red-500)",
            mediana <= sla
              ? "var(--green-500)"
              : mediana <= sla * 2
                ? "var(--yellow-500)"
                : "var(--red-500)",
            p90 <= sla ? "var(--green-500)" : p90 <= sla * 2 ? "var(--yellow-500)" : "var(--red-500)",
            "var(--blue-500)",
          ],
        },
      ],
    };
  });

  readonly sourceChartData = computed<ChartJsData | null>(() => {
    const k = this.kpis();
    if (!k?.porFuente?.length) return null;
    const top = k.porFuente.slice(0, 6);
    return {
      labels: top.map((f) => f.fuente),
      datasets: [
        {
          label: "Postulaciones",
          data: top.map((f) => f.totalPostulaciones),
          backgroundColor: "var(--blue-500)",
          yAxisID: "y",
        },
        {
          label: "Tasa conversión (%)",
          data: top.map((f) => f.tasaConversion),
          backgroundColor: "var(--green-500)",
          yAxisID: "y1",
        },
      ],
    };
  });

  readonly activityChartData = computed<ChartJsData | null>(() => {
    const k = this.kpis();
    if (!k) return null;
    return {
      labels: ["Últimos 7 días", "Últimos 30 días"],
      datasets: [
        {
          label: "Postulaciones",
          data: [k.postulacionesUltimos7Dias, k.postulacionesUltimos30Dias],
          backgroundColor: ["var(--blue-500)", "var(--purple-500)"],
        },
      ],
    };
  });
}

