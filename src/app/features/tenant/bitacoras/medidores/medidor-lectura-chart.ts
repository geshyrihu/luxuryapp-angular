import { Component, effect, inject, OnInit } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import {
  IonCard,
  IonCardContent,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/angular/standalone";
import { BaseChartDirective } from "ng2-charts";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { RadioButtonModule } from "primeng/radiobutton";
import { CalendarRange } from "src/app/core/components/rango-calendario-mes-anio/calendar-range";
import { RangoCalendarioyyyymmdd } from "src/app/core/components/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd";
import { IChartType } from "src/app/core/interfaces/chart-type.interface";
import { IDataSet } from "src/app/core/interfaces/data-set.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FiltroCalendarService } from "src/app/core/services/filtro-calendar.service";
@Component({
  selector: "app-medidor-lectura-chart",
  templateUrl: "./medidor-lectura-chart.html",
  imports: [
    BaseChartDirective,
    CalendarRange,
    RangoCalendarioyyyymmdd,
    RadioButtonModule,
    FormsModule,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardContent,
  ],
})
export class MedidorLecturaChart implements OnInit {
  apiResponseS = inject(ApiResponseService);
  rutaActiva = inject(ActivatedRoute);
  dateS = inject(DateService);
  filtroCalendarService = inject(FiltroCalendarService);
  data: IDataSet;
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

  onSegmentChange(event: any) {
    const value = event.detail.value;
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
  lineBarChart: IChartType;
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
  }
}