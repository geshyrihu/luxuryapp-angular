import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import {
  AspelQueryMode,
  AspelQueryRequest,
  SelectItem,
} from "./aspel-cobranza-haus.models";

@Component({
  selector: "app-aspel-cobranza-haus-query-panel",

  imports: [
    FormsModule,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    WebButtonLabel,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="card shadow-none border-1 surface-border">
      <div class="grid formgrid align-items-start">
        <div class="col-12 md:col-6 lg:col flex flex-column gap-1">
          <custom-input-select-signal
            label="Endpoint"
            [ngModel]="mode"
            [data]="endpointOptions"
            [horizontal]="false"
            [noMargin]="true"
            (ngModelChange)="modeChange.emit($event)"
          />
          <small class="text-500">
            Selecciona la consulta {{ sourceLabel }} que quieres ejecutar.
          </small>
        </div>

        @if (mode !== "accounts" && mode !== "deudas-actuales") {
          <div class="col-12 md:col-6 lg:col flex flex-column gap-1">
            <custom-input-select-signal
              label="Numero de cuenta"
              [(ngModel)]="request.numCta"
              [data]="accountOptions"
              [filter]="true"
              [loading]="accountsLoading"
              [horizontal]="false"
              [noMargin]="true"
              placeholder="Selecciona una cuenta"
            />
            <small class="text-500">
              Cuenta cargada desde el catálogo {{ sourceLabel }} del ejercicio
              seleccionado.
            </small>
          </div>
        }

        @if (mode !== "deudas-actuales" && mode !== "detalle-cobranza-rango") {
          <div class="col-12 md:col-6 lg:col flex flex-column gap-1">
            <custom-input-date-signal
              [label]="
                mode === 'accounts' ? 'Fecha para ejercicio' : 'Fecha inicio'
              "
              [(ngModel)]="request.fechaInicio"
              (ngModelChange)="dateContextChange.emit()"
              [horizontal]="false"
              [noMargin]="true"
            />
          </div>
        } @else {
          <div class="col-12 md:col-6 lg:col flex flex-column gap-1">
            <label class="text-sm font-semibold text-900">Fecha corte</label>
            <div
              class="flex align-items-center h-3rem px-3 border-1 surface-border rounded surface-50 text-900 font-medium"
            >
              Hoy
            </div>
            <small class="text-500">
              El endpoint usa la fecha actual del servidor como corte.
            </small>
          </div>
        }

        @if (
          mode !== "accounts" &&
          mode !== "deudas-actuales" &&
          mode !== "detalle-cobranza-rango"
        ) {
          <div class="col-12 md:col-6 lg:col flex flex-column gap-1">
            <custom-input-date-signal
              label="Fecha fin"
              [(ngModel)]="request.fechaFin"
              (ngModelChange)="dateContextChange.emit()"
              [horizontal]="false"
              [noMargin]="true"
            />
          </div>
        }

        <div class="col-12 md:col-6 lg:col flex flex-column gap-1">
          <label class="hidden lg:block text-sm font-semibold opacity-0"
            >&nbsp;</label
          >
          <div class="flex gap-2 w-full mt-1 lg:mt-0">
            <il-button
              label="Consultar"
              iconClass="material-symbols-light:search"
              [loading]="loading"
              [disabled]="!canSearch"
              customClass="flex-1"
              (clicked)="search.emit()"
            />
            <il-button
              label="Limpiar"
              iconClass="material-symbols-light:ink-eraser"
              customClass="flex-1 p-button-secondary"
              (clicked)="clear.emit()"
            />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AspelCobranzaHausQueryPanel {
  @Input({ required: true }) mode!: AspelQueryMode;
  @Input({ required: true }) endpointOptions: SelectItem<AspelQueryMode>[] = [];
  @Input({ required: true }) request!: AspelQueryRequest;
  @Input({ required: true }) accountOptions: SelectItem<string>[] = [];
  @Input() accountsLoading = false;
  @Input() loading = false;
  @Input() canSearch = false;
  @Input() sourceLabel = "Aspel";

  @Output() modeChange = new EventEmitter<AspelQueryMode>();
  @Output() dateContextChange = new EventEmitter<void>();
  @Output() search = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();
}
