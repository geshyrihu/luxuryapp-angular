import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
@Component({
  selector: "app-mantenimientos-programados",
  templateUrl: "./mantenimientos-programados.html",
  imports: [CommonModule, TableModule, PrimeNgCustomTableFooter],
})
export class MantenimientosProgramados implements OnInit {
  customerIdS = inject(CustomerIdService);
  apiResponseS = inject(ApiResponseService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  dataSignal = signal<any[]>([]);

  cuentaId: string = "";

  ngOnInit() {
    this.cuentaId = this.config.data.cuentaId;
    if (this.cuentaId !== "0") this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        `Presupuesto/ServiciosMttoProgramados/${this.cuentaId}/${this.customerIdS.customerId()}`,
      )
      .then((result: any) => {
        this.dataSignal.set(result);
      });
  }
}









