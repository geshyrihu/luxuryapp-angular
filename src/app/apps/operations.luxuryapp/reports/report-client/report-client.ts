import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
@Component({
  selector: "app-report-client",
  templateUrl: "./report-client.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule],
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
    this.rutaFinal = Endpoints.TasksReport.reportClient(
      this.customer,
      this.inicio,
      this.final,
    );

    this.apiResponseS.onGetList(this.rutaFinal).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.data = result;
    });
  }
}
