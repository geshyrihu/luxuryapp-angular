import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { TableModule } from "primeng/table";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { FiltroCalendarService } from "src/app/core/services/filtro-calendar.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
@Component({
  selector: "app-resultado-general-posicion",
  templateUrl: "./resultado-general-posicion.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TableModule, PrimeNgCustomCaption],
})
export class ResultadoGeneralPosicion {
  apiResponseS = inject(ApiResponseService);
  dateS = inject(DateService);
  rangoCalendarioService = inject(FiltroCalendarService);
  tableScrollHeightS = inject(TableScrollHeightService);
  fechaInicial: string = "";
  fechaFinal: string = "";
  dataSignal = signal<any>(null);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    this.rangoCalendarioService.fechaInicial;
    effect(() => {
      // Reaccionar a cambios en el servicio de rango de fechas (asumiendo que tiene signals o usando effect si dispara cambios detectables)
      // Nota: Si fechas$ es observable, mejor usar toSignal.
      // Dado el código anterior: this.rangoCalendarioService.fechas$.subscribe
      // Vamos a usar una estrategia hóbrida si el servicio no expone signals aun, pero aqui usaremos toSignal con el observable.
      const fechas = this.fechasSignal();
      if (fechas) {
        this.onLoadData(fechas.fechaInicio, fechas.fechaFinal);
      }
    });
  }

  // Convertir el observable a signal
  fechasSignal = toSignal(this.rangoCalendarioService.fechas$, {
    initialValue: {
      fechaInicio: this.dateS.getDateFormat(
        this.rangoCalendarioService.fechaInicial,
      ),
      fechaFinal: this.dateS.getDateFormat(
        this.rangoCalendarioService.fechaFinal,
      ),
    },
  });

  onLoadData(fechaInicio: string, fechaFinal: string) {
    const urlApi = `ResumenGeneral/Posicion/${fechaInicio}/${fechaFinal}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.dataSignal.set(result);
    });
  }
}
