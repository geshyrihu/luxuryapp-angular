import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { CandidateStatus } from "@core/enums/candidate-status";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { MappedPTag } from "../../../recruitment-shared/mapped-p-tag";
import { CANDIDATE_STATUS_TAG_OPTIONS } from "../candidate-status-tag-options";
import { CandidateListItem } from "../interfaces/candidate.dto";

import { PdfViewerTrigger } from "@ui/web/pdf-viewer-trigger/pdf-viewer-trigger";
@Component({
  selector: "app-candidate-list-mobile",
  templateUrl: "./candidate-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,

  imports: [
    PdfViewerTrigger,
    LuxDataViewMobile,
    MobileActionMenu,
    ButtonMobile,
    MobileListItem,
    MappedPTag,
    LxIcon,
  ],
})
export class CandidateListMobile {
  aspRoleS = inject(AspRoleService);

  data = input.required<CandidateListItem[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  archive = output<string>();
  delete = output<string>();
  detail = output<string>();

  readonly isSuperUser = this.aspRoleS.roleSignal(ApplicationRole.SuperUsuario);

  protected readonly candidateStatus = CandidateStatus;
  protected readonly candidateStatusOptions = CANDIDATE_STATUS_TAG_OPTIONS;
}
