import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CardModule } from "primeng/card";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
@Component({
  selector: "app-report-client",
  templateUrl: "./report-client.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule, CardModule],
})
export class ReportClient implements OnInit {
  apiResponseS = inject(ApiResponseService);
  rutaActiva = inject(ActivatedRoute);
  customerIdS = inject(CustomerIdService);
  data: any = [];

  customer: string = "";
  inicio: string = "";
  final: string = "";
  rutaFinal: string = "";

  ngOnInit(): void {
    this.customer = this.rutaActiva.snapshot.params.customer;
    this.inicio = this.rutaActiva.snapshot.params.inicio;
    this.final = this.rutaActiva.snapshot.params.final;
    this.rutaFinal = `tasks/GetReportClient/${this.customer}/${this.inicio}/${this.final}`;

    this.apiResponseS.onGetList(this.rutaFinal).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.data = result;
    });
  }
}
