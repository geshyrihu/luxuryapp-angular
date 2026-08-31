import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { Menubar } from "@ui/web/menubar/menubar";
import { MenuItem } from "@ui/web/primeng-api/primeng-api";
import { filter, map, startWith } from "rxjs/operators";
import { FilterRequests } from "src/app/apps/reclutamiento.luxuryapp/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/recruitment-shared/filter-requests";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";

type ShellFilterConfig = {
  apiUrl?: string;
  nameFile?: string;
  showRequestFilters?: boolean;
};

const REQUEST_FILTER_CONFIG: Record<string, ShellFilterConfig> = {
  vacancies: {
    apiUrl: EndpointsReclutamiento.RequestPosition.exportExcel,
    nameFile: "Reporte de vacantes.xlsx",
    showRequestFilters: true,
  },
  hirings: {
    apiUrl: EndpointsReclutamiento.RequestEmployeeRegister.exportExcel,
    nameFile: "Reporte de altas.xlsx",
    showRequestFilters: true,
  },
  dismissals: {
    apiUrl: EndpointsReclutamiento.RequestDismissal.exportExcel,
    nameFile: "Reporte de bajas.xlsx",
    showRequestFilters: true,
  },
  "salary-increase": {
    apiUrl: EndpointsReclutamiento.RequestSalaryModification.exportExcel,
    nameFile: "Reporte Modificacion Salario.xlsx",
    showRequestFilters: true,
  },
};

const SEARCH_ONLY_FILTER_CONFIG: ShellFilterConfig = {
  showRequestFilters: false,
};

@Component({
  selector: "app-recruitment-shell",
  templateUrl: "./recruitment-shell.html",
  styleUrl: "./recruitment-shell.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FilterRequests, Menubar, RouterModule],
})
export class RecruitmentShellComponent {
  private readonly router = inject(Router);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly navigationItems: MenuItem[] = [
    {
      label: "Plantilla Interna",
      command: () => this.navigate("/recruitment/plantilla-interna"),
    },
    {
      label: "Solicitudes",
      items: [
        {
          label: "Vacantes",
          command: () => this.navigate("/recruitment/requests/vacancies"),
        },
        {
          label: "Altas",
          command: () => this.navigate("/recruitment/requests/hirings"),
        },
        {
          label: "Bajas",
          command: () => this.navigate("/recruitment/requests/dismissals"),
        },
        {
          label: "Aumento de Sueldo",
          command: () =>
            this.navigate("/recruitment/requests/salary-increase"),
        },
      ],
    },
    {
      label: "Candidatos",
      items: [
        {
          label: "Directorio de Talento",
          command: () => this.navigate("/recruitment/candidates/candidates"),
        },
        {
          label: "Ex-empleados",
          command: () =>
            this.navigate("/recruitment/candidates/former-employees"),
        },
        {
          label: "Procesos Activos",
          command: () => this.navigate("/recruitment/candidates/applications"),
        },
        {
          label: "Entrevistas",
          command: () =>
            this.navigate("/recruitment/candidates/recruitment-interviews"),
        },
        {
          label: "Indicadores",
          command: () => this.navigate("/recruitment/candidates/kpis"),
        },
      ],
    },
    {
      label: "Solicitudes por Cliente",
      command: () => this.navigate("/recruitment/solicitudes_cliente"),
    },
    {
      label: "Documentos",
      command: () => this.navigate("/recruitment/document-catalog"),
    },
  ];

  readonly filterConfig = computed<ShellFilterConfig | null>(() => {
    const url = this.url();
    if (url.includes("/recruitment/plantilla-interna")) {
      return SEARCH_ONLY_FILTER_CONFIG;
    }

    const isRequestsRoute = url.includes("/recruitment/requests/");
    if (!isRequestsRoute) return null;

    const segment = Object.keys(REQUEST_FILTER_CONFIG).find((key) =>
      url.includes("/" + key),
    );

    return segment ? REQUEST_FILTER_CONFIG[segment] : null;
  });

  private navigate(url: string): void {
    void this.router.navigateByUrl(url);
  }
}
