import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
@Component({
  selector: "app-operation-report-client",
  imports: [],
  templateUrl: "./operation-report-client.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        overflow-y: auto;
        overflow-x: hidden;
      }
    `,
  ],
})
export class OperationReportClient implements OnInit {
  apiResponseS = inject(ApiResponseService);
  rutaActiva = inject(ActivatedRoute);
  data = signal<any>(null);
  customer: string = "";
  inicio: string = "";
  final: string = "";

  ngOnInit(): void {
    this.customer = this.rutaActiva.snapshot.params.customer;
    this.inicio = this.rutaActiva.snapshot.params.inicio;
    this.final = this.rutaActiva.snapshot.params.final;

    this.onLoadData();
  }

  onLoadData() {
    const urlApi =
      Endpoints.RefactorOperations.taskReportGetReportClientByIdByIdById(
        this.customer,
        this.inicio,
        this.final,
      );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.data.set(result);
    });
  }
}
