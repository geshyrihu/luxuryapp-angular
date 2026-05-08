import { Component, inject, OnInit } from "@angular/core";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { ApiResponseService } from "src/app/core/services/api-response.service";
@Component({
  selector: "app-tarjeta-producto",
  templateUrl: "./tarjeta-producto.html",
  imports: [CardModule],
})
export class TarjetaProducto implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  productoId: string = this.config.data.productoId;
  producto: any;

  ngOnInit(): void {
    const urlApi = `Productos/${this.productoId}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.producto = result;
    });
  }
}









