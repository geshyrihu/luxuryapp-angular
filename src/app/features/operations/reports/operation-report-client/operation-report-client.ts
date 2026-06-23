import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiResponseService } from "src/app/core/services/api-response.service";
@Component({
  selector: "app-operation-report-client",
  imports: [],
  templateUrl: "./operation-report-client.html",
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        overflow-y: auto;
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
    const urlApi = `task-report/GetReportClient/${this.customer}/${this.inicio}/${this.final}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.data.set(result);
    });
  }
}









