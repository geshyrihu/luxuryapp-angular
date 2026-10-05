import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-mis-inspecciones-lista-mobile",
  templateUrl: "./mis-inspecciones-lista-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MobileActionMenu,
    ApiDatePipe,
    CustomInputDateSignal,
    DataViewMobile,
    MobileButtonLabelItem,
    ReactiveFormsModule,
    AppIcon,
  ],
})
export class MisInspeccionesListaMobile {
  data = input.required<any[]>();
  dateSelectControl = input.required<FormControl<Date | string>>();

  dateChange = output<string>();
  resultado = output<string>();
  inspeccionar = output<string>();
}
