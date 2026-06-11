import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SanitizeHtmlPipe } from "src/app/core/pipes/sanitize-html.pipe";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
@Component({
  selector: "app-soporte-orden-servicio",
  templateUrl: "./soporte-orden-servicio.html",
  imports: [CommonModule, SanitizeHtmlPipe],
})
export class SoporteOrdenServicio implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dateS = inject(DateService);
  route = inject(ActivatedRoute);
  customerIdS = inject(CustomerIdService);
  id: string = "";
  item: any;
  dataCustomer: any;
  nameCarpetaFecha: string = "";
  logoCustomer = "";
  nameCustomer = "";

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    this.onLoadItem();
    this.onLoadData();
  }
  onLoadItem() {
    const urlApi = Endpoints.ServiceOrders.soporte(this.id);
    // Controller returns ApiResponseDTO<object>.
    // SoporteOrdenServicio is a single object, but original code used onGetList?
    // Let's check original code: this.apiResponseS.onGetList(urlApi).then...
    // The previous implementation returned Ok(object).
    // Now it returns ApiResponseDTO<object>.
    // apiResponseS.onGetItem is appropriate for single item.
    // If it was onGetList, apiResponseS.onGetList works too if data is array.
    // But data is object { MachineryId, ... }.
    // So onGetItem is better.
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.nameCarpetaFecha = this.dateS.getDateFormat(result.fechaSolicitud);
      this.item = result;
    });
  }
  onLoadData() {
    const urlApi = Endpoints.Customers.getByIdLegacy(this.customerIdS.customerId());
    // Customers/{id} returns ApiResponseDTO<CustomerDTO> (single item).
    // Should use onGetItem.
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.dataCustomer = result;
      this.nameCustomer = result.nameCustomer;
      this.logoCustomer = result.photoPath;
    });
  }
}









