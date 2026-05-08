import { Component, inject, OnInit } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { ApiResponseService } from "src/app/core/services/api-response.service";
@Component({
  selector: "app-info-cuenta",
  templateUrl: "./info-cuenta.html",
})
export class InfoCuenta implements OnInit {
  config = inject(DynamicDialogConfig);
  apiResponseS = inject(ApiResponseService);

  id: string = "";
  info: string = "";

  ngOnInit() {
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(`Cuentas/Info/${this.id}`)
      .then((result: any) => {
        this.info = result.information;
      });
  }
}









