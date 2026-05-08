import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ApiResponseService } from "src/app/core/services/api-response.service";
@Component({
  selector: "app-presupuesto-detalle-edicion-historial",
  templateUrl: "./presupuesto-detalle-edicion-historial.html",
  imports: [CommonModule, TableModule],
})
export class PresupuestoDetalleEdicionHistorial implements OnInit {
  apiResponseS = inject(ApiResponseService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  dataSignal = signal<any[]>([]);

  id: string = "";

  ngOnInit() {
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(`Presupuesto/HistorialToEdition/${this.id}`)
      .then((result: any) => {
        this.dataSignal.set(result);
      });
  }
}









