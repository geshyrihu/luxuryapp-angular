import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { Medidor } from "@core/interfaces/medidor.interface";
import { WebButtonLabelAdd } from "@ui/buttons/web-label/button-add";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelDownload } from "@ui/buttons/web-label/button-download";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { ActionMenu } from "@ui/web/action-menu/action-menu";

@Component({
  selector: "app-medidores-list-desktop",
  templateUrl: "./medidores-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ActionMenu,
    WebButtonLabelAdd,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    WebButtonLabelItem,
    WebButtonLabelDownload,
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
