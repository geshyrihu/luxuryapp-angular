import { Component, effect, inject, signal } from "@angular/core";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { environment } from "src/environments/environment";
import { FichaTecnicaActivo } from "src/app/features/tenant/machinery/ficha-tecnica-activo";
import { MiEdificioMobile } from "./mi-edificio-mobile";
@Component({
  selector: "app-mi-edificio",
  templateUrl: "./mi-edificio.html",
  imports: [TableModule, CardModule, MiEdificioMobile],
})
export class MiEdificio {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  data = signal<any>(null);
  baseUrlImg = environment.API_BASE_URL;

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  markers: any;
  zoom: number = 15;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = `MiEdificio/Caratula/${this.customerIdS.customerId()}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.data.set(result);
    });
  }

  showModalFichatecnica(data: any) {
    this.dialogHandlerS
      .openDialog(
        FichaTecnicaActivo,
        data,
        "Ficha Técnica",
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}










