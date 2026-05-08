import { Component, inject, input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  FlatpickrDirective,
  provideFlatpickrDefaults,
} from "angularx-flatpickr";
import { InputTextModule } from "primeng/inputtext";
import { IFechasFiltro } from "src/app/core/interfaces/fechas-filtro.interface";
import { DateService } from "src/app/core/services/date.service";
import { FiltroCalendarService } from "src/app/core/services/filtro-calendar.service";

/**
 * 📅 RANGO CALENDARIO (YYYY-MM-DD)
 * -------------------------------------------------------------------------
 * Selector de rango de fechas usando Flatpickr.
 * Permite seleccionar dia inicio y dia fin con un UI amigable.
 */
@Component({
  selector: "app-rango-calendario-yyyymmdd",

  templateUrl: "./rango-calendario-yyyymmdd.html",
  imports: [FormsModule, FlatpickrDirective, InputTextModule],
  providers: [provideFlatpickrDefaults()],
})
export class RangoCalendarioyyyymmdd implements OnInit {
  private dateS = inject(DateService);
  private rangoCalendarioService = inject(FiltroCalendarService);

  // <--- Inputs --->
  mostrartextDesde = input<boolean>(true);
  mostrartextHasta = input<boolean>(true);

  // Default dates
  private date = new Date();
  fechaInicioDate: Date = new Date(
    this.date.getFullYear(),
    this.date.getMonth(),
    1,
  ); //Dia primero del mes actual
  fechaFinalDate: Date = new Date(
    this.date.getFullYear(),
    this.date.getMonth() + 1,
    0,
  ); //Dia Ultimo del mes Actual

  ngOnInit(): void {}

  onSendDateRange(fechaInicio: any, fechaFinal: any) {
    this.rangoCalendarioService.setFechas(fechaInicio, fechaFinal);
    if (fechaInicio != null && fechaFinal != null) {
      const fechasFiltro: IFechasFiltro = {
        fechaInicio: this.dateS.getDateFormat(fechaInicio),
        fechaFinal: this.dateS.getDateFormat(fechaFinal),
      };
      this.rangoCalendarioService.fechas$.emit(fechasFiltro);
    }
  }
}









