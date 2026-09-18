import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { AppTable } from "@ui/web/table/table";
import { RangoCalendarioyyyymmdd } from "@ui/web/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "@core/helpers/table-primeng-option";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DateService } from "@core/services/date.service";
import {
  DialogHandlerService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { FiltroCalendarService } from "@core/services/filtro-calendar.service";
import { CardEmployee } from "@shared/integration/recursos-humanos";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
@Component({
  selector: "app-bitacora-individual",
  templateUrl: "./bitacora-individual.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    RangoCalendarioyyyymmdd,
    ApiDatePipe,
    AppTable,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    MobileListItem,
  ],
})
export class BitacoraIndividual implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  dateS = inject(DateService);
  rangoCalendarioService = inject(FiltroCalendarService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  machineryId: any;
  nameMachinery: string = "";
  fechaInicial: string = this.dateS.getDateFormat(
    this.rangoCalendarioService.fechaInicioDateFull,
  );
  fechaFinal: string = this.dateS.getDateFormat(
    this.rangoCalendarioService.fechaFinalDateFull,
  );
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);

  fechasSignal = toSignal(this.rangoCalendarioService.fechas$);

  constructor() {
    effect(() => {
      const dates = this.fechasSignal();
      if (dates) {
        this.fechaInicial = dates.fechaInicio;
        this.fechaFinal = dates.fechaFinal;
        this.onLoadData();
      }
    });
  }

  ngOnInit(): void {
    this.machineryId = this.config.data.machineryId;
    this.nameMachinery = this.config.data.nameMachinery;
    this.onLoadData();
  }

  onFilter() {
    this.onLoadData();
  }

  onSendDateRange(event) {
    this.fechaFinal = event.fechaFinal;
    this.fechaInicial = event.fechaInicial;
    this.onLoadData();
  }

  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerS.openDialog(
      CardEmployee,
      { applicationUserId },
      "Colaborador",
      this.dialogHandlerS.sizeLg,
    );
  }

  onLoadData() {
    const urlApi = Endpoints.BitacoraMantenimientoConsultas.bitacoraIndividual(
      this.machineryId,
      this.fechaInicial,
      this.fechaFinal,
    );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
}

