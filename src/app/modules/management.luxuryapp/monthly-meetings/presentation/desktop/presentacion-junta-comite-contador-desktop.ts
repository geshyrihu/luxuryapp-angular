import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabelViewPdf } from "@ui/buttons/web-label";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-presentacion-junta-comite-contador-desktop",
  templateUrl: "./presentacion-junta-comite-contador-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LxTag,
    WebButtonLabel,
    WebButtonLabelViewPdf,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    AppIcon,
  ],
})
export class PresentacionJuntaComiteContadorDesktop {
  data = input.required<any[]>();

  add = output<void>();
  edit = output<string>();
  deleteItem = output<string>();
  upload = output<{ id: string; titulo: string }>();
  deleteFile = output<{ id: string; area: string }>();
  validar = output<string>();
  onlyValidate = output<string>();
}
