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
import {
  WebButtonLabelConfirm,
  WebButtonLabelViewPdf,
} from "@ui/buttons/web-label";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { ButtonWeb } from "@ui/buttons/web";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-presentacion-junta-comite-desktop",
  templateUrl: "./presentacion-junta-comite-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WebButtonLabel,
    LxTag,
    ButtonWeb,
    WebButtonLabelDelete,
    WebButtonLabelConfirm,
    WebButtonLabelViewPdf,
    AppIcon,
  ],
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
