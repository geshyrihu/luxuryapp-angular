import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from "@angular/core";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";

/**
 * 🧾 CABECERA SOLICITUD PAGO PDF
 * -------------------------------------------------------------------------
 * Cabecera específica para solicitudes de pago en PDF.
 * Incluye folio, factura y datos del cliente.
 */
@Component({
  selector: "app-cabecera-solicitud-pago-pdf",

  templateUrl: "./cabecera-solicitud-pago-pdf.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./cabecera-solicitud-pago-pdf.component.scss"],
})
export class CabeceraSolicitudPagoPdf {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  data: any;
  // url: string = ""; // No se usa en el template original, pero si se usara, se define aqui.

  // <--- Inputs --->
  titulo = input<string>("");
  folio = input<string>("");
  factura = input<string>("");

  constructor() {
    effect(() => {
      if (Number(this.customerIdS.customerId()) > 0) {
        this.onloadData();
      }
    });
  }

  onloadData() {
    const urlApi = Endpoints.Customers.getByIdLegacy(
      this.customerIdS.customerId(),
    );
    // Usamos onGetList según el original, aunque parece que debería ser un item.
    // El original usaba onGetList y asignaba result a data. Asumimos result es el objeto cliente.
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
}
