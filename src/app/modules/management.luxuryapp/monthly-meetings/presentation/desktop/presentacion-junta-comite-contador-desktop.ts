import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { ButtonWeb } from "@ui/buttons/web";
import { PdfViewerTrigger } from "@ui/web/pdf-viewer-trigger/pdf-viewer-trigger";
import { LxIcon } from '@ui/adaptive/icon/icon';

@Component({
  selector: "app-presentacion-junta-comite-contador-desktop",
  templateUrl: "./presentacion-junta-comite-contador-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LxTag, WebButtonLabel, PdfViewerTrigger, ButtonWeb, LxIcon],
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
