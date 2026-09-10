import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { AdvancedPieChart } from "@ui/web/charts/advanced-pie-chart";
import { ReporteOrdenesServicioService } from "src/app/core/services/reporte-ordenes-servicio.service";
@Component({
  selector: "app-resumen-ordenes-servicio-grafico",
  templateUrl: "./resumen-ordenes-servicio-grafico.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AdvancedPieChart],
})
export class ResumenOrdenesServicioGrafico {
  public reporteOrdenesServicioService = inject(ReporteOrdenesServicioService);
  get single() {
    return this.reporteOrdenesServicioService.getDateGrafico();
  }

  // options
  view: [number, number] = [700, 400];
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme: any = {
    domain: ["#5AA454", "#A10A28", "#3b3838"],
  };
}









