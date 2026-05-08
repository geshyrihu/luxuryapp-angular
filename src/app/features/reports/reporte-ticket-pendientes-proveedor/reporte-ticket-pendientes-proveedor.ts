import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { ReportService } from "src/app/core/services/report.service";
@Component({
  selector: "app-reporte-ticket-pendientes-proveedor",
  templateUrl: "./reporte-ticket-pendientes-proveedor.html",
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
    const urlApi = `ticket/getreportpendingprovider/${this.customerId}/${this.departamentId}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.data = result;

      this.globalFilterFields = globalFilterFields(this.data);
    });
  }
}









