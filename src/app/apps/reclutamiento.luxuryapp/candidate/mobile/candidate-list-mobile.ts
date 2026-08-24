import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileButtonLabelViewPdf } from "@ui/buttons/mobile-label/button-view-pdf";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { CandidateStatus } from "src/app/core/enums/candidate-status";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { CandidateListItem } from "../interfaces/candidate.dto";
import { MappedPTag } from "../../recruitment-shared/mapped-p-tag";
import { CANDIDATE_STATUS_TAG_OPTIONS } from "../candidate-status-tag-options";

@Component({
  selector: "app-candidate-list-mobile",
  templateUrl: "./candidate-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    DataViewMobile,
    MobileActionMenu,
    MobileButtonLabelDelete,
    MobileButtonLabelEdit,
    MobileButtonLabelItem,
    MobileButtonLabelViewPdf,
    MobileListItem,
    MappedPTag,
    AppIcon,
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

  readonly isSuperUser = this.aspRoleS.canAccessSignal(ApplicationRole.SuperUsuario);

  protected readonly candidateStatus = CandidateStatus;
  protected readonly candidateStatusOptions = CANDIDATE_STATUS_TAG_OPTIONS;
}
