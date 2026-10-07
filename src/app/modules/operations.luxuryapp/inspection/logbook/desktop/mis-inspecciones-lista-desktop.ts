import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LuxInputDateSignal } from "@ui/inputs/web/lux-input-date-signal";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-mis-inspecciones-lista-desktop",
  templateUrl: "./mis-inspecciones-lista-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableEmptyMessage,
    NgbTooltipModule,
    ApiDatePipe,
    LuxInputDateSignal,
    ReactiveFormsModule,
    AppTable,
    LxIcon,
  ],
})
export class MisInspeccionesListaDesktop {
  data = input.required<any[]>();
  dateSelectControl = input.required<FormControl<Date | string>>();

  dateChange = output<string>();
  resultado = output<string>();
  inspeccionar = output<string>();
}
