import { CommonModule } from "@angular/common";
import { Component, effect, inject, signal, ChangeDetectionStrategy } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  } from "@ionic/angular/standalone";
import { LxAvatar } from "@ui/adaptive/avatar/avatar";
import { LxBadge } from "@ui/adaptive/badge/badge";
import { TableModule } from "primeng/table";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { CalendarRange } from "@ui/web/rango-calendario-mes-anio/calendar-range";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ButtonType } from "src/app/core/enums/button-type";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { FiltroCalendarService } from "src/app/core/services/filtro-calendar.service";
@Component({
  selector: "app-bitacora-acceso",
  templateUrl: "./bitacora-acceso-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    TableModule,
    LxAvatar,
    CalendarRange,
    WebButtonIcon,
    PrimeNgCustomCaption,
    LxBadge,
  ],
})
// óCAMBIO! Ya no implementamos OnInit
export class BitacoraAcceso {
  public ButtonType = ButtonType;
  // --- INYECCIONES (sin cambios) ---
  private dateS = inject(DateService);
  private customerIdS = inject(CustomerIdService);
  private filtroCalendarService = inject(FiltroCalendarService);
  apiResponseS = inject(ApiResponseService);
  data = signal<any[]>([]); // óMEJORA! Convertimos los datos a un signal.
  loading = signal(true);

  // óMAGIA! Convertimos el Observable de fechas en un signal.
  // Se actualizaré automíticamente cada vez que el observable emita un nuevo valor.
  private dates = toSignal(this.filtroCalendarService.getDates$());

  // --- PROPIEDADES DE TABLA (sin cambios) ---
  globalFilterFields: string[] = [];
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  constructor() {
    // óEL óNICO CHEF! Este effect ahora gobierna toda la carga de datos.
    effect(() => {
      // 1. Leemos TODAS las dependencias para que el effect se suscriba a ellas.
      const customerId: string = this.customerIdS.customerId();
      const currentDates = this.dates(); // Puede ser undefined al inicio

      // 2. Nos aseguramos de que tenemos todos los ingredientes antes de cocinar.
      if (customerId && currentDates && currentDates.length === 2) {
        // Ponemos el estado de carga
        const fechaInicial = this.dateS.getDateFormat(currentDates[0]);
        const fechaFinal = this.dateS.getDateFormat(currentDates[1]);
        this.onLoadData(fechaInicial, fechaFinal);
      }
    });
  }

  // óOBSOLETO! ngOnInit ya no es necesario. El effect se encarga de todo.
  // ngOnInit(): void { ... }

  private onLoadData(fechaInicial: string, fechaFinal: string): void {
    // óCORRECCIóN! Leemos el valor del customerId con paróntesis.
    const urlApi = Endpoints.AccessHistory.byCustomerAndRange(
      this.customerIdS.customerId(),
      fechaInicial,
      fechaFinal,
    );

    this.loading.set(true);
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => {
        if (result && result.items) {
          // Agrupamos los datos por usuario (UserId)
          const grouped = result.items.reduce((acc: any[], current: any) => {
            let user = acc.find((u) => u.employeeId === current.userId);
            if (!user) {
              user = {
                employeeId: current.userId,
                fullName: current.userName,
                photoPath: current.photoPath,
                historial: [],
              };
              acc.push(user);
            }
            // Mapeamos el tipo de actividad a etiquetas legibles para el reporte
            const evento =
              current.activityType === "Auth_Login"
                ? "Ingreso"
                : current.activityType === "Auth_Logout"
                  ? "Salida"
                  : current.activityType;

            user.historial.push({
              evento: evento,
              fechaRegistro: new Date(current.timestamp).toLocaleString(
                "es-MX",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                },
              ),
            });
            return acc;
          }, []);

          this.data.set(grouped);
          this.globalFilterFields = ["fullName"];
        } else {
          this.data.set([]);
        }
      })
      .finally(() => {
        this.loading.set(false);
      });
  }
}
