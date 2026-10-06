import { UpperCasePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { LxFieldset } from "@ui/adaptive/fieldset/fieldset";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonWeb } from "@ui/buttons/web";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PdfViewerTrigger } from "@ui/web/pdf-viewer-trigger/pdf-viewer-trigger";

@Component({
  selector: "app-presentacion-junta-comite-mobile",
  templateUrl: "./presentacion-junta-comite-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UpperCasePipe,
    LxTag,
    LxFieldset,
    DataViewMobile,
    ButtonWeb,
    PdfViewerTrigger],
})
export class PresentacionJuntaComiteMobile {
  aspRoleS = inject(AspRoleService);
  public AspRole = ApplicationRole;

  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<string>();
  deleteItem = output<string>();
  upload = output<{ id: string; titulo: string }>();
  deleteFile = output<{ id: string; area: string }>();
  validar = output<string>();
  onlyValidate = output<string>();
}
