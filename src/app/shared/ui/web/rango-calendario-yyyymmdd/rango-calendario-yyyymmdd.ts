import { Component, inject, input, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FlatpickrDirective } from "angularx-flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es";
import { InputTextModule } from "primeng/inputtext";
import { FechasFiltro } from "src/app/core/interfaces/fechas-filtro.interface";
import { DateService } from "src/app/core/services/date.service";
import { FiltroCalendarService } from "src/app/core/services/filtro-calendar.service";

/**
 * 📅 RANGO CALENDARIO (YYYY-MM-DD)
 * -------------------------------------------------------------------------
 * Selector de rango de fechas usando Flatpickr.
 * Permite seleccionar día inicio y día fin con un UI amigable.
 */
@Component({
  selector: "app-rango-calendario-yyyymmdd",
  templateUrl: "./rango-calendario-yyyymmdd.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, FlatpickrDirective, InputTextModule],
})
export class RangoCalendarioyyyymmdd implements OnInit {
  private dateS = inject(DateService);
  private rangoCalendarioService = inject(FiltroCalendarService);

  // <--- Inputs --->
  mostrarLabelDesde = input<boolean>(true, { alias: "mostrartextDesde" });
  mostrarLabelHasta = input<boolean>(true, { alias: "mostrartextHasta" });

  readonly localeSpanish = Spanish;

  // Fechas por defecto
  private date = new Date();
  fechaInicioDate: Date = new Date(
    this.date.getFullYear(),
    this.date.getMonth(),
    1,
  ); // Día primero del mes actual
  fechaFinalDate: Date = new Date(
    this.date.getFullYear(),
    this.date.getMonth() + 1,
    0,
  ); // Día último del mes actual

  ngOnInit(): void {}

  onSendDateRange(fechaInicio: any, fechaFinal: any) {
    this.rangoCalendarioService.setFechas(fechaInicio, fechaFinal);
    if (fechaInicio != null && fechaFinal != null) {
      const fechasFiltro: FechasFiltro = {
        fechaInicio: this.dateS.getDateFormat(fechaInicio),
        fechaFinal: this.dateS.getDateFormat(fechaFinal),
      };
      this.rangoCalendarioService.fechas$.emit(fechasFiltro);
    }
  }
}









