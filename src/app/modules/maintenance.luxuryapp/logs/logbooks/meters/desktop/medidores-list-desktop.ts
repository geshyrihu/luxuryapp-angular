import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { Medidor } from "@core/interfaces/medidor.interface";
import { ButtonWeb } from "@ui/buttons/web";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { ActionMenu } from "@ui/web/action-menu/action-menu";

@Component({
  selector: "app-medidores-list-desktop",
  templateUrl: "./medidores-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ActionMenu,
    ButtonWeb,
    AppIcon,
  ],
})
export class MedidoresListDesktop {
  data = input.required<Medidor[]>();

  add = output<{ id: number; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<any>();
  registerReading = output<Medidor>();
  goToLecturas = output<any>();
  goToGrafico = output<any>();
  exportExcel = output<any>();
}
