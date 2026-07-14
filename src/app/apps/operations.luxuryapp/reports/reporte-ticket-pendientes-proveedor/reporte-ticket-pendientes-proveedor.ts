import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ReportService } from "src/app/core/services/report.service";
@Component({
  selector: "app-reporte-ticket-pendientes-proveedor",
  templateUrl: "./reporte-ticket-pendientes-proveedor.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule],
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
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  nameCustomer: string = "";
  logoCustomer: string = "";

  ngOnInit(): void {
    this.customerId = this.routerActivate.snapshot.params["customerId"];
    this.departamentId = this.routerActivate.snapshot.params["departamentId"];

    this.onLoadData();
  }
  onLoadData() {
    const urlApi =
      Endpoints.RefactorOperations.ticketGetreportpendingproviderByIdById(
        this.customerId,
        this.departamentId,
      );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.data = result;

      this.globalFilterFields = globalFilterFields(this.data);
    });
  }
}
