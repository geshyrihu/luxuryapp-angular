import { Component, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { filter, map, startWith } from "rxjs/operators";
import { FilterRequests } from "./recruitment-shared/filter-requests";

const ROUTE_FILTER_CONFIG: Record<string, { apiUrl: string; nameFile: string }> = {
  vacancies: {
    apiUrl: "RequestPosition/ExportRequestToExcel",
    nameFile: "Reporte de vacantes.xlsx",
  },
  hirings: {
    apiUrl: "RequestEmployeeRegister/ExportRequestToExcel",
    nameFile: "Reporte de altas.xlsx",
  },
  dismissals: {
    apiUrl: "RequestDismissal/ExportRequestToExcel",
    nameFile: "Reporte de bajas.xlsx",
  },
  "salary-increase": {
    apiUrl: "RequestSalaryModification/ExportRequestToExcel",
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
