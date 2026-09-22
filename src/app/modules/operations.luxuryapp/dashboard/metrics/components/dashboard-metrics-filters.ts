import { ChangeDetectionStrategy, Component, output, signal, inject, OnInit, input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DateService } from "@core/services/date.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";

export interface DashboardMetricsFilter {
  fechaInicio: string;
  fechaFin: string;
  tipoOperacion: string;
  customerId: string;
}

@Component({
  selector: "app-dashboard-metrics-filters",
  standalone: true,
  imports: [CommonModule, FormsModule, CustomInputSelectSignal, CustomInputDateSignal],
  template: `
    <div class="card p-3 mb-4" style="background-color: var(--ds-bg-surface); border-color: var(--ds-border)">
      <div class="row g-3">
        @if (isCorporate()) {
          <div class="col-12 col-md-3">
            <custom-input-select-signal
              label="Cliente (opcional)"
              [data]="customerOptions()"
              [ngModel]="customerId()"
              (ngModelChange)="customerId.set($event); onFilterChange()"
              optionValue="value"
              optionLabel="label"
              [filter]="true"
              [noMargin]="true"
            ></custom-input-select-signal>
          </div>
        }

        <div class="col-12 col-md-3">
          <custom-input-select-signal
            label="Tipo de Operación"
            [data]="tiposOperacion"
            [ngModel]="tipoOperacion()"
            (ngModelChange)="tipoOperacion.set($event); onFilterChange()"
            optionValue="value"
            optionLabel="label"
            [noMargin]="true"
          ></custom-input-select-signal>
        </div>

        <div class="col-12 col-md-3">
          <custom-input-date-signal
            label="Fecha Inicio"
            [ngModel]="fechaInicio()"
            (ngModelChange)="fechaInicio.set($event); onFilterChange()"
            [noMargin]="true"
          ></custom-input-date-signal>
        </div>

        <div class="col-12 col-md-3">
          <custom-input-date-signal
            label="Fecha Fin"
            [ngModel]="fechaFin()"
            (ngModelChange)="fechaFin.set($event); onFilterChange()"
            [noMargin]="true"
          ></custom-input-date-signal>
        </div>
      </div>
    </div>
    @if (errorMensaje()) {
      <div class="px-3 mb-4 fw-bold" style="color: var(--ds-danger); font-size: 0.875rem">
        {{ errorMensaje() }}
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardMetricsFilters implements OnInit {
  private dateS = inject(DateService);
  private authS = inject(AuthService);
  
  filterChange = output<DashboardMetricsFilter>();

  tipoOperacion = signal<string>("");
  fechaInicio = signal<string>("");
  fechaFin = signal<string>("");
  customerId = signal<string>("");
  
  errorMensaje = signal<string>("");

  tiposOperacion = [
    { label: "Todas", value: "" },
    { label: "Mantenimiento", value: "Mantenimiento" },
    { label: "Tickets", value: "Tickets" }
  ];

  isCorporate = input<boolean>(false);
  customerOptions = signal<{value: string, label: string}[]>([]);

  constructor() {
    // Rango por defecto: hoy (se reporta que DateService carece de método para restar días)
    const todayStr = this.dateS.getDateNow(); 

    this.fechaInicio.set(todayStr);
    this.fechaFin.set(todayStr);
  }

  ngOnInit() {
    const access = this.authS.customerAccess || [];
    this.customerOptions.set([
      { value: "", label: "Todos" },
      ...access
    ]);

    this.onFilterChange();
  }

  onFilterChange() {
    const start = this.dateS.parseDate(this.fechaInicio());
    const end = this.dateS.parseDate(this.fechaFin());
    this.errorMensaje.set("");

    if (start && end) {
      if (start > end) {
        this.errorMensaje.set("La fecha de inicio no puede ser mayor a la fecha de fin.");
        return;
      }
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 366) {
        this.errorMensaje.set("El rango de fechas no puede superar 366 días.");
        return;
      }
    }

    this.filterChange.emit({
      fechaInicio: this.fechaInicio(),
      fechaFin: this.fechaFin(),
      tipoOperacion: this.tipoOperacion(),
      customerId: this.customerId()
    });
  }
}
