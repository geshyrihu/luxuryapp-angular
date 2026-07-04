import { DecimalPipe } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { NgxEchartsDirective } from "ngx-echarts";
import { chartJsToCartesianOption } from "@ui/web/charts/echarts-adapters";
import { RangoCalendarioyyyymmdd } from "@ui/web/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { FiltroCalendarService } from "src/app/core/services/filtro-calendar.service";
import { IRecepcionPipaAgua } from "./recepcion-pipas-agua.interfaces";

interface IDatoAgrupado {
  periodo: string;
  totalLitros: number;
  recepciones: number;
  promedioLitros: number;
  diferenciaPromCisterna: number;
}

@Component({
  selector: "app-recepcion-pipas-agua-analisis",
  templateUrl: "./recepcion-pipas-agua-analisis.html",
  imports: [
    DecimalPipe,
    NgxEchartsDirective,
    RangoCalendarioyyyymmdd,
  ],
})
export class RecepcionPipasAguaAnalisis implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  filtroCalendarService = inject(FiltroCalendarService);

  rawData = signal<IRecepcionPipaAgua[]>([]);

  fechaInicio = signal(this.dateS.getDateFormat(this.filtroCalendarService.fechaInicioDateFull));
  fechaFin = signal(this.dateS.getDateFormat(this.filtroCalendarService.fechaFinalDateFull));

  // KPIs calculados desde los datos crudos
  totalRecepciones = computed(() => this.rawData().length);
  totalLitros = computed(() => this.rawData().reduce((s, x) => s + (x.capacidadPipa ?? 0), 0));
  promedioLitrosPorEntrega = computed(() =>
    this.totalRecepciones() > 0 ? this.totalLitros() / this.totalRecepciones() : 0
  );
  diferenciaPromCisterna = computed(() => {
    const data = this.rawData().filter((x) => x.horaTermino);
    if (!data.length) return 0;
    return data.reduce((s, x) => s + (x.nivelCisternaDespues - x.nivelCisternaAntes), 0) / data.length;
  });
  placasMasFrecuente = computed(() => {
    const freq: Record<string, number> = {};
    this.rawData().forEach((x) => (freq[x.placasCamion] = (freq[x.placasCamion] ?? 0) + 1));
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";
  });

  // Datos agrupados por mes para la tabla de tendencia
  tendenciaMensual = computed<IDatoAgrupado[]>(() => {
    const grupos: Record<string, IRecepcionPipaAgua[]> = {};
    this.rawData().forEach((x) => {
      const key = x.horaLlegada.slice(0, 7); // "YYYY-MM"
      (grupos[key] ??= []).push(x);
    });
    return Object.entries(grupos)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([periodo, items]) => {
        const completadas = items.filter((x) => x.horaTermino);
        const litros = items.reduce((s, x) => s + (x.capacidadPipa ?? 0), 0);
        const difCist = completadas.length
          ? completadas.reduce((s, x) => s + (x.nivelCisternaDespues - x.nivelCisternaAntes), 0) / completadas.length
          : 0;
        return {
          periodo,
          totalLitros: litros,
          recepciones: items.length,
          promedioLitros: items.length ? litros / items.length : 0,
          diferenciaPromCisterna: difCist,
        };
      });
  });

  // Dataset para grafico de barras (litros por mes)
  chartLitros = computed(() => ({
    labels: this.tendenciaMensual().map((x) => x.periodo),
    datasets: [
      {
        label: "Litros recibidos",
        data: this.tendenciaMensual().map((x) => x.totalLitros),
        backgroundColor: "rgba(2, 132, 199, 0.6)",
        borderColor: "rgba(2, 132, 199, 1)",
        borderWidth: 1,
        barPercentage: 0.5,
      },
    ],
    options: {
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true } },
    },
  }));

  // Opción ECharts (barras) derivada del dataset de litros por mes
  optLitros = computed(() => chartJsToCartesianOption(this.chartLitros(), "bar"));

  // Dataset para grafico de linea (diferencia de cisterna por mes)
  chartCisterna = computed(() => ({
    labels: this.tendenciaMensual().map((x) => x.periodo),
    datasets: [
      {
        label: "Diferencia promedio cisterna",
        data: this.tendenciaMensual().map((x) => x.diferenciaPromCisterna),
        borderColor: "rgba(22, 163, 74, 1)",
        backgroundColor: "rgba(22, 163, 74, 0.15)",
        fill: true,
        tension: 0.3,
      },
    ],
    options: { maintainAspectRatio: false },
  }));

  // Opción ECharts (línea con área) derivada del dataset de cisterna
  optCisterna = computed(() => chartJsToCartesianOption(this.chartCisterna(), "line"));

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(`recepcion-pipas-agua/list/${this.customerIdS.customerId()}`)
      .then((result: IRecepcionPipaAgua[]) => {
        const inicio = new Date(this.fechaInicio());
        const fin = new Date(this.fechaFin());
        fin.setHours(23, 59, 59);
        this.rawData.set(
          (result ?? []).filter((x) => {
            const f = new Date(x.horaLlegada);
            return f >= inicio && f <= fin;
          })
        );
      });
  }

  onFechasChange(event: { fechaInicio: string; fechaFinal: string }) {
    this.fechaInicio.set(event.fechaInicio);
    this.fechaFin.set(event.fechaFinal);
    this.onLoadData();
  }
}
