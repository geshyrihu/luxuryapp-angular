import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { chartJsToCartesianOption } from "@ui/web/charts/echarts-adapters";
import { CalendarRange } from "@ui/web/rango-calendario-mes-anio/calendar-range";
import { RangoCalendarioyyyymmdd } from "@ui/web/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd";
import type { EChartsCoreOption } from "echarts/core";
import { NgxEchartsDirective } from "ngx-echarts";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { RadioButtonModule } from "primeng/radiobutton";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ChartType } from "src/app/core/interfaces/chart-type.interface";
import { DataSet } from "src/app/core/interfaces/data-set.interface";
import { DateService } from "src/app/core/services/date.service";
import { FiltroCalendarService } from "src/app/core/services/filtro-calendar.service";
@Component({
  selector: "app-medidor-lectura-chart",
  templateUrl: "./medidor-lectura-chart.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    NgxEchartsDirective,
    CalendarRange,
    RangoCalendarioyyyymmdd,
    RadioButtonModule,
    FormsModule,
  ],
})
export class MedidorLecturaChart implements OnInit {
  apiResponseS = inject(ApiResponseService);
  rutaActiva = inject(ActivatedRoute);
  dateS = inject(DateService);
  filtroCalendarService = inject(FiltroCalendarService);
  data: DataSet;
  title: string = "";
  ViewMonth: boolean = false;
  ViewDay: boolean = true;
  medidorId: string = "";
  datesSignal = toSignal(this.filtroCalendarService.getDates$());
  fechasSignal = toSignal(this.filtroCalendarService.fechas$);

  fechaInicial: string = this.dateS.getDateFormat(
    this.filtroCalendarService.fechaInicioDateFull,
  );
  fechaFinal: string = this.dateS.getDateFormat(
    this.filtroCalendarService.fechaFinalDateFull,
  );

  ref: DynamicDialogRef;

  onCheckboxChange() {
    this.ViewMonth = !this.ViewMonth;
    this.ViewDay = !this.ViewDay;

    this.onLoadData();
  }

  onSegmentChange(value: string) {
    if (value === "month") {
      this.ViewMonth = true;
      this.ViewDay = false;
    } else {
      this.ViewMonth = false;
      this.ViewDay = true;
    }
    this.onLoadData();
  }

  onLoadData() {
    if (this.ViewMonth) {
      this.onDataGraficoMensual(
        this.dateS.getDateFormat(this.filtroCalendarService.fechaInicial),
        this.dateS.getDateFormat(this.filtroCalendarService.fechaFinal),
      );
    }
    if (this.ViewDay) {
      this.onDataGraficoDiaria();
    }
  }

  constructor() {
    effect(() => {
      const dates = this.datesSignal();
      if (dates) {
        this.onDataGraficoMensual(
          this.dateS.getDateFormat(dates[0]),
          this.dateS.getDateFormat(dates[1]),
        );
      }
    });

    effect(() => {
      const fechas = this.fechasSignal();
      if (fechas) {
        this.fechaInicial = fechas.fechaInicio;
        this.fechaFinal = fechas.fechaFinal;
        this.onLoadData();
      }
    });
  }

  ngOnInit(): void {
    this.medidorId = this.rutaActiva.snapshot.params.id;
    this.onLoadData();
  }

  onDataGraficoDiaria() {
    const urlApi = Endpoints.MeterReadings.dailyChart(
      this.medidorId,
      this.fechaInicial,
      this.fechaFinal,
    );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.onLoadChart(
        this.data.label,
        this.data.backgroundColor,
        this.data.hoverBackgroundColor,
        this.data.labels,
        this.data.data,
      );
    });
  }

  onDataGraficoMensual(fechaInicial: string, fechaFinal: string) {
    const urlApi = Endpoints.MeterReadings.monthlyChart(
      this.medidorId,
      fechaInicial,
      fechaFinal,
    );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.onLoadChart(
        this.data.label,
        this.data.backgroundColor,
        this.data.hoverBackgroundColor,
        this.data.labels,
        this.data.data,
      );
    });
  }
  lineBarChart: ChartType;
  chartOption = signal<EChartsCoreOption | null>(null);
  // lineBarChartDiario: ChartType;
  onLoadChart(
    label: string,
    backgroundColor: string,
    hoverBackgroundColor: string,
    labels: string[],
    data: any,
  ) {
    this.lineBarChart = {
      labels: labels,
      datasets: [
        {
          label: label,
          backgroundColor: backgroundColor,
          borderColor: backgroundColor,
          borderWidth: 1,
          hoverBackgroundColor: hoverBackgroundColor,
          hoverBorderColor: hoverBackgroundColor,
          data: data,
          barPercentage: 0.4,
        },
      ],
      options: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              gridLines: {
                color: "rgba(166, 176, 207, 0.1)",
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                color: "rgba(166, 176, 207, 0.1)",
              },
            },
          ],
        },
      },
    };
    this.chartOption.set(chartJsToCartesianOption(this.lineBarChart, "bar"));
  }
}
