import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@core/auth/services/auth.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { ReportService } from "@core/services/report.service";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
@Component({
  selector: "app-reporte-ticket-pendientes-proveedor",
  templateUrl: "./reporte-ticket-pendientes-proveedor.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ApiDatePipe],
})
export class ReporteTicketPendientesProveedor implements OnInit {
  authS = inject(AuthService);
  apiResponseS = inject(ApiResponseService);
  reportService = inject(ReportService);
  router = inject(Router);
  routerActivate = inject(ActivatedRoute);
  customerId: string;
  departamentId: string;

  urlImg = "";
  data: any[] = [];

  globalFilterFields: string[] = [];
  loading = signal(true);
  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  nameCustomer: string = "";
  logoCustomer: string = "";

  ngOnInit(): void {
    this.customerId = this.routerActivate.snapshot.params["customerId"];
    this.departamentId = this.routerActivate.snapshot.params["departamentId"];

    this.onLoadData();
  }
  onLoadData() {
    const urlApi = Endpoints.Tickets.pendingProviderReport(
      this.customerId,
      this.departamentId,
    );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.data = result;

      this.globalFilterFields = globalFilterFields(this.data);
    });
  }
}

