import { Component, inject, OnInit, signal } from "@angular/core";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
@Component({
  selector: "app-ticket-legal-seguimiento-solicitud-detalle",
  templateUrl: "./ticket-legal-seguimiento-solicitud-detalle.html",
  imports: [CardModule],
})
export class TicketLegalSeguimientoSolicitudDetalle implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  data: string = "";
  id = this.config.data.id;

  loading = signal(true);

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.Tasks.getById(this.id))
      .then((result: any) => {
        this.data = result.description ?? "";
        this.loading.set(false);
      });
  }
}








