import { CommonModule } from "@angular/common";
import { Component, effect, inject, OnInit } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { SanitizeHtmlPipe } from "src/app/core/pipes/sanitize-html.pipe";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { PeriodMonthService } from "src/app/core/services/periodo-month.service";
@Component({
  selector: "app-reporte-ordenes-servicio",
  templateUrl: "./reporte-ordenes-servicio.html",
  imports: [CommonModule, SanitizeHtmlPipe],
})
export class ReporteOrdenesServicio implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  PeriodMonthService = inject(PeriodMonthService);
  // route = inject(ActivatedRoute); // Se elimina al no ser necesario.

  data: any[] = [];
  fecha: string = "";
  dataCustomer: any;
  nameCarpetaFecha: string = "";
  logoCustomer = "";
  nameCustomer = "";

  periodoInicial = toSignal(this.PeriodMonthService.getPeriodoInicial$());

  constructor() {
    effect(() => {
      const periodo = this.periodoInicial();
      if (periodo) {
        this.onLoadData();
      }
    });
  }

  ngOnInit(): void {
    this.onLoadDataCustomer();
  }

  //TODO: Centralizar obtener ifno de customer...
  onLoadDataCustomer() {
    const urlApi = "Customers/" + this.customerIdS.customerId();

    // CUSTOMERS module was already refactored to ApiResponseDTO in previous steps.
    // So apiResponseS.onGetItem will expect ApiResponseDTO and return data.
    // If getting list, it might be onGetList if URL is /Customers/id returning single item?
    // Reviewing CustomersController: GetById returns ApiResponseDTO<CustomerDTO>.
    // So onGetItem is correct.
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.dataCustomer = result;
      this.nameCustomer = result.nameCustomer;
      this.logoCustomer = result.photoPath;
    });
  }

  onLoadData() {
    const customerId: string = this.customerIdS.customerId();
    const periodo = this.dateS.getDateFormat(
      this.PeriodMonthService.getPeriodoInicio,
    );
    const urlApi = `ServiceOrders/ReporteOrdenesServicio/${customerId}/${periodo}`;

    this.apiResponseS.onPost(urlApi).then((result: any) => {
      this.data = result;
      if (this.data && this.data.length > 0) {
        this.nameCarpetaFecha = this.data[0].nameFolder;
      } else {
        this.nameCarpetaFecha = "";
      }
    });
  }
}









