import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { TableModule } from "primeng/table";
import { FichaTecnicaActivo } from "src/app/apps/mantenimiento.luxuryapp/equipos-y-maquinaria/machinery/ficha-tecnica-activo";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { environment } from "src/environments/environment";
import { MiEdificioMobile } from "./mi-edificio-mobile";
@Component({
  selector: "app-mi-edificio",
  templateUrl: "./mi-edificio.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AppIcon, TableModule, MiEdificioMobile],
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
    const urlApi = Endpoints.RefactorOperations.miEdificioCaratulaById(
      this.customerIdS.customerId(),
    );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.data.set(result);
    });
  }

  showModalFichatecnica(data: any) {
    this.dialogHandlerS
      .openDialog(
        FichaTecnicaActivo,
        data,
        "Ficha Tócnica",
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
