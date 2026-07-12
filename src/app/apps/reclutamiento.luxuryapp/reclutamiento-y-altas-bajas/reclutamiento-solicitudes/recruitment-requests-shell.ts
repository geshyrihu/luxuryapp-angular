import { Component, computed, inject, ChangeDetectionStrategy } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { filter, map, startWith } from "rxjs/operators";
import { FilterRequests } from "./recruitment-shared/filter-requests";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints.reclutamiento";

const ROUTE_FILTER_CONFIG: Record<string, { apiUrl: string; nameFile: string }> = {
  vacancies: {
    apiUrl: EndpointsReclutamiento.RequestPosition.exportExcel,
    nameFile: "Reporte de vacantes.xlsx",
  },
  hirings: {
    apiUrl: EndpointsReclutamiento.RequestEmployeeRegister.exportExcel,
    nameFile: "Reporte de altas.xlsx",
  },
  dismissals: {
    apiUrl: EndpointsReclutamiento.RequestDismissal.exportExcel,
    nameFile: "Reporte de bajas.xlsx",
  },
  "salary-increase": {
    apiUrl: EndpointsReclutamiento.RequestSalaryModification.exportExcel,
    nameFile: "Reporte Modificacion Salario.xlsx",
  },
};

const DEFAULT_CONFIG = ROUTE_FILTER_CONFIG["vacancies"];

@Component({
  selector: "app-recruitment-requests-shell",
  template: `
    <div class="mb-3">
      <app-filter-requests
        [apiUrl]="filterConfig().apiUrl"
        [nameFile]="filterConfig().nameFile"
      />
    </div>
    <router-outlet />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FilterRequests, RouterModule],
})
export class RecruitmentRequestsShell {
  private router = inject(Router);

  private url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  filterConfig = computed(() => {
    const url = this.url();
    const segment = Object.keys(ROUTE_FILTER_CONFIG).find((key) =>
      url.includes("/" + key),
    );
    return segment ? ROUTE_FILTER_CONFIG[segment] : DEFAULT_CONFIG;
  });
}
