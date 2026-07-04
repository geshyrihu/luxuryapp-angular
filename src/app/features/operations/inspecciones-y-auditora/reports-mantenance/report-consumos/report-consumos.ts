import { CommonModule } from "@angular/common";
import { Component, effect, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import * as FileSaver from "file-saver";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDownload } from "@ui/buttons/web-label/button-download";
import { CustomInputMultiselectSignal } from "@ui/inputs/web/custom-input-multiselect-signal";
import { MultiAxisChart } from "@ui/web/charts/multi-axis-chart";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { RangoCalendarioyyyymmdd } from "@ui/web/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd";
import { PageTitleReportMaintenance } from "@ui/web/title-page-report-maintenance/page-title-report-maintenance";
import { Endpoints } from "src/app/core/constants/endpoints";
import { IMedidor } from "src/app/core/interfaces/medidor.interface";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { FiltroCalendarService } from "src/app/core/services/filtro-calendar.service";

interface IExecutiveReportFilters {
  medidorIds: FormControl<string[]>;
  medidorCategoriaIds: FormControl<string[]>;
  areas: FormControl<string[]>;
}

interface IWeeklyExecutiveCategory {
  medidorCategoriaId: string;
  categoria: string;
  totalMedidores: number;
  totalConsumo: number;
}

interface IWeeklyExecutiveMeter {
  medidorId: string;
  medidorCategoriaId: string;
  categoria: string;
  numeroMedidor: string;
  descripcion: string;
  area: string;
  consumoTotal: number;
  promedioSemanal: number;
  consumoDiarioMaximoConfigurado: number;
  consumoMaximoDetectado: number;
}

interface IWeeklyExecutiveChart {
  labels: string[];
  datasets: {
    label: string;
    backgroundColor: string;
    data: number[];
    fill: boolean;
    tension: number;
    yAxisID: string;
  }[];
}

interface IWeeklyExecutiveReport {
  fechaInicio: string;
  fechaFin: string;
  areaFilterAvailable: boolean;
  areaFilterSource: string;
  totalConsumo: number;
  promedioSemanal: number;
  totalMedidores: number;
  totalCategorias: number;
  totalSemanas: number;
  graficaSemanal: IWeeklyExecutiveChart;
  categorias: IWeeklyExecutiveCategory[];
  medidores: IWeeklyExecutiveMeter[];
}

@Component({
  selector: "app-report-consumos",
  templateUrl: "./report-consumos.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    TableModule,
    PageTitleReportMaintenance,
    MultiAxisChart,
    RangoCalendarioyyyymmdd,
    CustomInputMultiselectSignal,
    WebButtonLabel,
    WebButtonLabelDownload,
    PrimeNgCustomCaption,
  ],
})
export class ReportConsumos {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly customerIdS = inject(CustomerIdService);
  private readonly dateS = inject(DateService);
  private readonly filtroCalendarService = inject(FiltroCalendarService);

  readonly loading = signal(false);
  readonly report = signal<IWeeklyExecutiveReport | null>(null);
  readonly medidores = signal<IMedidor[]>([]);
  readonly medidorOptions = signal<ISelectItem[]>([]);
  readonly categoriaOptions = signal<ISelectItem[]>([]);
  readonly areaOptions = signal<ISelectItem[]>([]);

  readonly filtersForm = new FormGroup<IExecutiveReportFilters>({
    medidorIds: new FormControl<string[]>([], { nonNullable: true }),
    medidorCategoriaIds: new FormControl<string[]>([], { nonNullable: true }),
    areas: new FormControl<string[]>([], { nonNullable: true }),
  });

  readonly fechasSignal = toSignal(this.filtroCalendarService.fechas$);

  fechaInicio = this.dateS.getDateFormat(
    this.filtroCalendarService.fechaInicioDateFull,
  );
  fechaFin = this.dateS.getDateFormat(
    this.filtroCalendarService.fechaFinalDateFull,
  );

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) {
        this.loadCatalogs();
      }
    });

    effect(() => {
      const fechas = this.fechasSignal();
      if (fechas) {
        this.fechaInicio = fechas.fechaInicio;
        this.fechaFin = fechas.fechaFinal;
      }
    });
  }

  loadCatalogs() {
    const customerId = this.customerIdS.customerId();
    const urlApi = Endpoints.Meters.listByCustomer(customerId);

    this.apiResponseS.onGetList<IMedidor[]>(urlApi).then((result) => {
      const medidores = result || [];
      this.medidores.set(medidores);
      this.medidorOptions.set(
        medidores.map((item) => ({
          label: `${item.numeroMedidor} - ${item.descripcion}`,
          value: item.id,
        })),
      );

      this.categoriaOptions.set(
        medidores
          .reduce((acc, item) => {
            if (
              !acc.some((option) => option.value === item.medidorCategoriaId)
            ) {
              acc.push({
                label: item.medidorCategoria.nombreMedidorCategoria,
                value: item.medidorCategoriaId,
              });
            }
            return acc;
          }, [] as ISelectItem[])
          .sort((a, b) => `${a.label}`.localeCompare(`${b.label}`)),
      );

      this.areaOptions.set(
        medidores
          .filter((item) => !!item.descripcion)
          .reduce((acc, item) => {
            if (!acc.some((option) => option.value === item.descripcion)) {
              acc.push({
                label: item.descripcion,
                value: item.descripcion,
              });
            }
            return acc;
          }, [] as ISelectItem[])
          .sort((a, b) => `${a.label}`.localeCompare(`${b.label}`)),
      );

      this.loadReport();
    });
  }

  loadReport() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;

    this.loading.set(true);

    this.apiResponseS
      .onPostPaged<IWeeklyExecutiveReport>(
        Endpoints.MaintenanceReports.weeklyExecutiveReport,
        {
          customerId,
          fechaInicio: this.fechaInicio,
          fechaFin: this.fechaFin,
          medidorIds: this.filtersForm.controls.medidorIds.getRawValue(),
          medidorCategoriaIds:
            this.filtersForm.controls.medidorCategoriaIds.getRawValue(),
          areas: this.filtersForm.controls.areas.getRawValue(),
        },
      )
      .then((result) => {
        this.report.set(result?.data || null);
      })
      .finally(() => this.loading.set(false));
  }

  onClearFilters() {
    this.filtersForm.reset({
      medidorIds: [],
      medidorCategoriaIds: [],
      areas: [],
    });
    this.loadReport();
  }

  exportExcel() {
    const report = this.report();
    if (!report) return;

    import("xlsx").then((xlsx) => {
      const dataToExport = report.medidores.map((item) => ({
        Categoria: item.categoria,
        "Numero de medidor": item.numeroMedidor,
        "Area o ubicacion": item.area,
        Descripcion: item.descripcion,
        "Consumo total": item.consumoTotal,
        "Promedio semanal": item.promedioSemanal,
        "Maximo diario configurado": item.consumoDiarioMaximoConfigurado,
        "Maximo detectado": item.consumoMaximoDetectado,
      }));

      const worksheet = xlsx.utils.json_to_sheet(dataToExport);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: ArrayBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });
      FileSaver.saveAs(data, "reporte-ejecutivo-medidores.xlsx", {
        autoBom: false,
      });
    });
  }
}
