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
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DateService } from "@core/services/date.service";
import {
  DialogHandlerService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { FiltroCalendarService } from "@core/services/filtro-calendar.service";
import { PlatformService } from "@core/services/platform.service";
import { CardEmployee } from "@shared/integration/recursos-humanos";
import { BitacoraIndividualDesktop } from "./desktop/bitacora-individual-desktop";
import { BitacoraIndividualMobile } from "./mobile/bitacora-individual-mobile";
@Component({
  selector: "app-bitacora-individual",
  templateUrl: "./bitacora-individual.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [BitacoraIndividualDesktop, BitacoraIndividualMobile],
})
export class BitacoraIndividual implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  dateS = inject(DateService);
  rangoCalendarioService = inject(FiltroCalendarService);
  platformS = inject(PlatformService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

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
      this.dialogHandlerS.sizeXl,
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
