import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";

@Component({
  selector: "app-mis-inspecciones-lista-mobile",
  templateUrl: "./mis-inspecciones-lista-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    MobileActionMenu,
    ApiDatePipe,
    CustomInputDateSignal,
    DataViewMobile,
    ReactiveFormsModule,
    LxIcon],
})
export class MisInspeccionesListaMobile {
  data = input.required<any[]>();
  dateSelectControl = input.required<FormControl<Date | string>>();

  dateChange = output<string>();
  resultado = output<string>();
  inspeccionar = output<string>();
}
