import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { ButtonWeb } from "@ui/buttons/web";
import { PdfViewerTrigger } from "@ui/web/pdf-viewer-trigger/pdf-viewer-trigger";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-presentacion-junta-comite-desktop",
  templateUrl: "./presentacion-junta-comite-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WebButtonLabel, LxTag, ButtonWeb, PdfViewerTrigger, AppIcon],
})
export class PresentacionJuntaComiteDesktop {
  aspRoleS = inject(AspRoleService);
  public AspRole = ApplicationRole;

  data = input.required<any[]>();

  add = output<void>();
  edit = output<string>();
  deleteItem = output<string>();
  upload = output<{ id: string; titulo: string }>();
  deleteFile = output<{ id: string; area: string }>();
  validar = output<string>();
  onlyValidate = output<string>();
}
