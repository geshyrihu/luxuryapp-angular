import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
@Component({
  selector: "app-tarjeta-producto",
  templateUrl: "./tarjeta-producto.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
})
export class TarjetaProducto implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  productoId: string = this.config.data.productoId;
  producto: any;

  ngOnInit(): void {
    const urlApi = Endpoints.RefactorSupplier.productosById(this.productoId);
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.producto = result;
    });
  }
}
