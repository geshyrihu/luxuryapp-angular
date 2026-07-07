import { Component, inject, OnInit, output, ChangeDetectionStrategy } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { InputTextModule } from "primeng/inputtext";
import { FiltroCalendarService } from "src/app/core/services/filtro-calendar.service";

/**
 * 📅 MES Y AÑO SELECTOR
 * -------------------------------------------------------------------------
 * Input nativo de tipo 'month' estilizado.
 * Permite seleccionar un periodo (YYYY-MM).
 */
@Component({
  selector: "app-mesanio",
  imports: [FormsModule, NgbTooltip, InputTextModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="grid gap-4 mb-4">
      <label
        for="horizontal-firstname-input"
        class="col-12 md:col-3 form-label"
      >
        Periodo
      </label>
      <div class="col-12 md:col-9">
        <input
          type="month"
          ngbTooltip="SELECCIONA PERIODO"
          pInputText
          [(ngModel)]="periodo"
          (change)="onChangePeriodo()"
        />
      </div>
    </div>
  `,
})
export class Mesanio implements OnInit {
  private rangoCalendarioService = inject(FiltroCalendarService);

  periodoEmit = output<string>();

  // Mantenemos ngModel simple por ahora para este input nativo
  periodo: string = "";

  ngOnInit(): void {
    // Inicializar con la fecha del servicio
    this.periodo = this.onParseToInputMonth(
      this.rangoCalendarioService.fechaInicial,
    );
  }

  // Convertir fecha JS a string YYYY-MM para input[type="month"]
  onParseToInputMonth(date: Date): string {
    const mm = date.getMonth() + 1;
    return [date.getFullYear(), (mm > 9 ? "" : "0") + mm].join("-");
  }

  onChangePeriodo() {
    this.periodoEmit.emit(this.periodo);
  }
}
