import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxMultiSelect } from "@ui/adaptive/multi-select/multi-select";
import { LxProgressBar } from "@ui/adaptive/progress-bar/progress-bar";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { Mesanio } from "@ui/web/mesanio/mesanio";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DateService } from "src/app/core/services/date.service";
import { PeriodMonthService } from "src/app/core/services/periodo-month.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
@Component({
  selector: "app-resultado-general-dashboard",
  templateUrl: "./resultado-general-dashboard.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    WebButtonLabel,
    LxMultiSelect,
    CustomInputTextSignal,
    LxTag,
    LxProgressBar,
    Mesanio,
  ],
})
export class ResultadoGeneralDashboard implements OnInit {
  apiResponseS = inject(ApiResponseService);
  PeriodMonthService = inject(PeriodMonthService);
  dateS = inject(DateService);
  tableScrollHeightS = inject(TableScrollHeightService);
  reporteFiltro: string = "MINUTAS GENERAL";

  ref: DynamicDialogRef;
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  cb_customers: any[] = [];
  periodo: string = "";
  nivelReporte: number = 0;
  mostrar: boolean = false;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit(): void {
    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(`NombreCorto`)
      .then((response: any) => {
        this.cb_customers = response.map((selectList: any) => ({
          label: selectList.label,
        }));
      });

    this.periodo = this.dateS.getNameMontYear(
      this.PeriodMonthService.fechaInicial,
    );
    this.onLoadDataMinutas();
  }

  onFiltrarPeriodo(periodo: string) {
    this.PeriodMonthService.setPeriodo(periodo);
    this.periodo = this.dateS.getNameMontYear(
      this.PeriodMonthService.fechaInicial,
    );
    this.onLoadDataMinutas();
  }

  onFiltrarData(item: string) {
    this.reporteFiltro = item;
    this.onLoadDataMinutas();
  }

  onLoadDataMinutas() {
    this.reporteFiltro = "MINUTAS GENERAL";
    // Mostrar un mensaje de carga

    const urlApi = Endpoints.ResumenGeneral.reporteResumenMinutas(
      this.dateS.getDateFormat(this.PeriodMonthService.getPeriodoInicio),
      this.dateS.getDateFormat(this.PeriodMonthService.getPeriodoFin),
      this.nivelReporte,
    );

    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
  onLoadDataMinutaFiltro(AreaMinutasDetalles: number) {
    const urlApi = Endpoints.ResumenGeneral.reporteResumenMinutasFiltro(
      this.dateS.getDateFormat(this.PeriodMonthService.getPeriodoInicio),
      this.dateS.getDateFormat(this.PeriodMonthService.getPeriodoFin),
      AreaMinutasDetalles,
      this.nivelReporte,
    );

    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
  onLoadDataPreventivos() {
    const urlApi = Endpoints.ResumenGeneral.reporteResumenPreventivos(
      this.dateS.getDateFormat(this.PeriodMonthService.getPeriodoInicio),
      this.dateS.getDateFormat(this.PeriodMonthService.getPeriodoFin),
    );

    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
  onLoadDataTickets() {
    const urlApi = Endpoints.ResumenGeneral.reporteResumenTicket(
      this.dateS.getDateFormat(this.PeriodMonthService.getPeriodoInicio),
      this.dateS.getDateFormat(this.PeriodMonthService.getPeriodoFin),
    );

    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onValueProgress(value: number) {
    let color = "";
    if (value <= 94) {
      color = "danger"; // rojo
    }
    if (value >= 100) {
      color = "success"; // verde
    }
    if (value >= 95 && value <= 99) {
      color = "warning"; // naranja
    }
    return color;
  }
}
