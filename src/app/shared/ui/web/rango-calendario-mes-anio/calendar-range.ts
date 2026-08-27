import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputTextModule } from "primeng/inputtext";
import { DateService } from "src/app/core/services/date.service";
import { FiltroCalendarService } from "src/app/core/services/filtro-calendar.service";

/**
 * 📅 CALENDAR RANGE (MONTH)
 * -------------------------------------------------------------------------
 * Selector de rango de fechas por mes (Input type="month").
 * Ideal para reportes mensuales.
 */
@Component({
  selector: "app-calendar-range",
  templateUrl: "./calendar-range.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    LxTooltipDirective,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
})
export class CalendarRange {
  private filtroCalendarService = inject(FiltroCalendarService);
  private dateS = inject(DateService);

  fechaInicial: string = this.dateS.onParseToInputMonth(
    this.filtroCalendarService.fechaInicial,
  );
  fechaFinal: string = this.dateS.onParseToInputMonth(
    this.filtroCalendarService.fechaFinal,
  );

  onSendDateRange(fechaInicial: string, fechaFinal: string) {
    this.filtroCalendarService.SetFechasMonth(fechaInicial, fechaFinal);
  }
}
